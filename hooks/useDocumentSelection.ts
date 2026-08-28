// hooks/useDocumentSelection.ts

import { useState, useMemo } from "react";

export function useDocumentSelection<T extends { id: string }>(
  items: T[],
  filteredItems: T[]
) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const selectAll = () => {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map((i) => i.id)));
    }
  };

  const clearSelection = () => setSelectedIds(new Set());

  const isAllSelected = useMemo(() => {
    return filteredItems.length > 0 && selectedIds.size === filteredItems.length;
  }, [selectedIds, filteredItems]);

  const isIndeterminate = useMemo(() => {
    return selectedIds.size > 0 && selectedIds.size < filteredItems.length;
  }, [selectedIds, filteredItems]);

  return {
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    isAllSelected,
    isIndeterminate,
  };
}