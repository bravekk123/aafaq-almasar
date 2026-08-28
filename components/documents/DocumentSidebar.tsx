// components/documents/DocumentSidebar.tsx

"use client";

import { DocumentType, Invoice, Letter, Quotation } from "@/types/documents";
import FolderSelector from "@/components/FolderSelector";
import SearchBar from "@/components/SearchBar";
import EmptyState from "@/components/EmptyState";
import DocumentList from "./DocumentList";

type DocumentItem = Invoice | Letter | Quotation;

interface DocumentSidebarProps<T extends DocumentItem> {
  type: DocumentType;
  currentFolderPath: string;
  setCurrentFolderPath: (path: string) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filteredItems: T[];
  selectedIds: Set<string>;
  toggleSelect: (id: string) => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  onView: (item: T) => void;        // new
  onDownload: (item: T) => void;    // new
  selectAll: () => void;
  isAllSelected: boolean;
  onNew: () => void;
  onExportBackup: () => void;
  searchPlaceholder: string;
  newButtonLabel: string;
}

export default function DocumentSidebar<T extends DocumentItem>({
  type,
  currentFolderPath,
  setCurrentFolderPath,
  searchTerm,
  setSearchTerm,
  filteredItems,
  selectedIds,
  toggleSelect,
  onEdit,
  onDelete,
  onView,
  onDownload,
  selectAll,
  isAllSelected,
  onNew,
  onExportBackup,
  searchPlaceholder,
  newButtonLabel,
}: DocumentSidebarProps<T>) {
  const folderType = type === "invoice" ? "invoices" : type === "letter" ? "letters" : "quotations";

  return (
    <div className="bg-white rounded-xl shadow p-5 h-fit">
      <FolderSelector
        type={folderType}
        onSelect={(folderPath) => setCurrentFolderPath(folderPath)}
        currentPath={currentFolderPath}
      />
      <hr className="my-4" />
      <SearchBar onSearch={setSearchTerm} placeholder={searchPlaceholder} />
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Files in this folder</h3>
        {filteredItems.length > 0 && (
          <button
            onClick={selectAll}
            className="text-xs text-blue-600 hover:underline transition-transform hover:scale-105"
          >
            {isAllSelected ? "Deselect All" : "Select All"}
          </button>
        )}
      </div>
      {filteredItems.length === 0 ? (
        <EmptyState type={folderType} searchTerm={searchTerm} />
      ) : (
        <DocumentList
          type={type}
          items={filteredItems}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
          onDownload={onDownload}
        />
      )}
      <button
        onClick={onNew}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg w-full transition-transform hover:scale-105"
      >
        {newButtonLabel}
      </button>
      <button
        onClick={onExportBackup}
        className="mt-2 bg-gray-600 text-white px-4 py-2 rounded-lg w-full transition-transform hover:scale-105"
      >
        Export Backup
      </button>
    </div>
  );
}