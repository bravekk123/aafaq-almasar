// hooks/useDocuments.ts

import { useState, useEffect, useCallback } from "react";
import {
  saveInvoiceToDropbox,
  loadAllInvoicesFromDropbox,
  deleteInvoiceFromDropbox,
  saveLetterToDropbox,
  loadAllLettersFromDropbox,
  deleteLetterFromDropbox,
  saveQuotationToDropbox,
  loadAllQuotationsFromDropbox,
  deleteQuotationFromDropbox,
} from "@/lib/dropboxSync";
import { confirmWithCode } from "@/lib/security";
import toast from "react-hot-toast";
import { DocumentType } from "@/types/documents";

export function useDocuments<T extends { id: string }>(
  type: DocumentType,
  currentFolderPath: string,
  trackCreated: () => void,
  trackUpdated: () => void,
  trackDeleted: () => void,
  trackBulkDeleted: (count: number) => void
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const loadItems = useCallback(async (folderPath: string) => {
    setLoading(true);
    try {
      let data: any[] = [];
      if (type === "invoice") {
        data = await loadAllInvoicesFromDropbox(folderPath);
      } else if (type === "letter") {
        data = await loadAllLettersFromDropbox(folderPath);
      } else if (type === "quotation") {
        data = await loadAllQuotationsFromDropbox(folderPath);
      }
      setItems(data as T[]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [type]);

  useEffect(() => {
    loadItems(currentFolderPath);
  }, [currentFolderPath, loadItems]);

  const saveItem = async (data: T) => {
    const fileName = `${data.id}.json`;
    if (type === "invoice") {
      await saveInvoiceToDropbox(fileName, data, currentFolderPath);
    } else if (type === "letter") {
      await saveLetterToDropbox(fileName, data, currentFolderPath);
    } else if (type === "quotation") {
      await saveQuotationToDropbox(fileName, data, currentFolderPath);
    }
    await loadItems(currentFolderPath);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} saved!`);
    trackCreated();
  };

  const updateItem = async (data: T) => {
    if (!selectedId) return;
    const fileName = `${selectedId}.json`;
    if (type === "invoice") {
      await saveInvoiceToDropbox(fileName, data, currentFolderPath);
    } else if (type === "letter") {
      await saveLetterToDropbox(fileName, data, currentFolderPath);
    } else if (type === "quotation") {
      await saveQuotationToDropbox(fileName, data, currentFolderPath);
    }
    await loadItems(currentFolderPath);
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} updated!`);
    trackUpdated();
  };

  const deleteItem = async (id: string) => {
    if (!await confirmWithCode()) return;
    if (!confirm(`Delete this ${type}?`)) return;
    const fileName = `${id}.json`;
    if (type === "invoice") {
      await deleteInvoiceFromDropbox(fileName, currentFolderPath);
    } else if (type === "letter") {
      await deleteLetterFromDropbox(fileName, currentFolderPath);
    } else if (type === "quotation") {
      await deleteQuotationFromDropbox(fileName, currentFolderPath);
    }
    await loadItems(currentFolderPath);
    if (selectedId === id) {
      setSelectedId(null);
      setIsEditing(false);
    }
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} deleted`);
    trackDeleted();
  };

  const bulkDelete = async (ids: Set<string>) => {
    if (!await confirmWithCode()) return;
    if (!confirm(`Delete ${ids.size} ${type}(s)?`)) return;
    let successCount = 0;
    for (const id of ids) {
      const fileName = `${id}.json`;
      if (type === "invoice") {
        await deleteInvoiceFromDropbox(fileName, currentFolderPath);
      } else if (type === "letter") {
        await deleteLetterFromDropbox(fileName, currentFolderPath);
      } else if (type === "quotation") {
        await deleteQuotationFromDropbox(fileName, currentFolderPath);
      }
      successCount++;
    }
    await loadItems(currentFolderPath);
    toast.success(`${successCount} ${type}(s) deleted.`);
    trackBulkDeleted(successCount);
    return successCount;
  };

  return {
    items,
    setItems,
    loading,
    loadItems,
    selectedId,
    setSelectedId,
    isEditing,
    setIsEditing,
    saveItem,
    updateItem,
    deleteItem,
    bulkDelete,
  };
}