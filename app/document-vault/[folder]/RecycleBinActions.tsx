"use client";

import { FaTrash, FaUndo } from "react-icons/fa";

interface RecycleBinActionsProps {
  isRecycleBin: boolean;
  selectedCount: number;
  onRestoreSelected: () => void;
  onEmptyRecycleBin: () => void;
}

export default function RecycleBinActions({
  isRecycleBin,
  selectedCount,
  onRestoreSelected,
  onEmptyRecycleBin,
}: RecycleBinActionsProps) {
  if (!isRecycleBin) return null;

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      <button
        onClick={onRestoreSelected}
        disabled={selectedCount === 0}
        className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
      >
        <FaUndo />
        Restore Selected ({selectedCount})
      </button>

      <button
        onClick={onEmptyRecycleBin}
        className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
      >
        <FaTrash />
        Empty Recycle Bin
      </button>
    </div>
  );
}