// components/documents/DocumentList.tsx

"use client";

import { DocumentType, Invoice, Letter, Quotation } from "@/types/documents";
import { getDisplayName, getClientName, getDate } from "@/lib/documentHelpers";

type DocumentItem = Invoice | Letter | Quotation;

interface DocumentListProps<T extends DocumentItem> {
  type: DocumentType;
  items: T[];
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onView: (item: T) => void;        // new
  onDownload: (item: T) => void;    // new
}

export default function DocumentList<T extends DocumentItem>({
  type,
  items,
  selectedIds,
  toggleSelect,
  onEdit,
  onDelete,
  onView,
  onDownload,
}: DocumentListProps<T>) {
  if (items.length === 0) {
    return (
      <div className="text-center text-gray-500 text-sm py-4">
        No {type}s found.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {items.map((item) => {
        const id = item.id;
        const isSelected = selectedIds.has(id);
        const displayName = getDisplayName(item);
        const clientName = getClientName(item);
        const date = getDate(item);

        return (
          <div
            key={id}
            className={`border rounded-lg p-3 flex justify-between items-center transition-all duration-200 hover:shadow-md ${
              isSelected ? "bg-blue-50 border-blue-300" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => toggleSelect(id)}
                className="w-4 h-4 rounded border-gray-300 focus:ring-green-500"
              />
              <div>
                <div className="font-bold">{displayName}</div>
                <div className="text-sm text-gray-600">{clientName}</div>
                <div className="text-xs text-gray-400">{date}</div>
              </div>
            </div>
            <div className="flex gap-2">
              {/* View – no password */}
              <button
                onClick={() => onView(item)}
                className="text-blue-600 text-sm transition-transform hover:scale-105"
                title="View"
              >
                View
              </button>
              {/* Download – no password */}
              <button
                onClick={() => onDownload(item)}
                className="text-green-600 text-sm transition-transform hover:scale-105"
                title="Download PDF"
              >
                Download
              </button>
              {/* Edit – password protected (handled in parent) */}
              <button
                onClick={() => onEdit(item)}
                className="text-yellow-600 text-sm transition-transform hover:scale-105"
              >
                Edit
              </button>
              {/* Delete – password protected (handled in parent) */}
              <button
                onClick={() => onDelete(id)}
                className="text-red-600 text-sm transition-transform hover:scale-105"
              >
                Delete
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}