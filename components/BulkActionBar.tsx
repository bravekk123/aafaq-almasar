"use client";

import { FaTrash, FaTimes } from "react-icons/fa";

interface BulkActionBarProps {
  selectedCount: number;
  onDelete: () => void;
  onCancel: () => void;
}

export default function BulkActionBar({ selectedCount, onDelete, onCancel }: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg p-3 z-40 flex justify-between items-center">
      <div className="text-sm font-medium">
        {selectedCount} item{selectedCount !== 1 ? "s" : ""} selected
      </div>
      <div className="flex gap-3">
        <button
          onClick={onDelete}
          className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          <FaTrash size={14} /> Delete All
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2"
        >
          <FaTimes size={14} /> Cancel
        </button>
      </div>
    </div>
  );
}