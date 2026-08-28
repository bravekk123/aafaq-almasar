// hooks/useSearchFilter.ts

import { useMemo, useState } from "react";

export function useSearchFilter<T extends Record<string, any>>(
  items: T[],
  searchFields: string[]
): {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredItems: T[];
} {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredItems = useMemo(() => {
    if (!searchTerm.trim()) return items;
    const lower = searchTerm.toLowerCase();
    return items.filter((item) =>
      searchFields.some((field) => {
        const value = item[field];
        if (value === undefined || value === null) return false;
        return String(value).toLowerCase().includes(lower);
      })
    );
  }, [items, searchTerm, searchFields]);

  return {
    searchTerm,
    setSearchTerm,
    filteredItems,
  };
}