"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { FaArrowLeft, FaFolderOpen, FaList, FaThLarge } from "react-icons/fa";

import FileList from "./FileList";
import RecycleBinActions from "./RecycleBinActions";
import { formatFileSize, formatDate } from "./vaultHelpers";

import {
  listDocumentVaultFiles,
  deleteDocumentVaultFile,
  createDocumentVaultFolder,
  uploadMultipleDocumentVaultFiles,
  getDocumentVaultFileLink,
  renameDocumentVaultFile,
  moveToRecycleBin,
  restoreFromRecycleBin,
  emptyRecycleBin,
} from "@/lib/dropboxSync";
import { confirmWithCode } from "@/lib/security";

// Sorting options
type SortField = "name" | "size" | "modified" | "type";
type SortOrder = "asc" | "desc";
type ViewMode = "list" | "grid";

export default function FolderPage() {
  const params = useParams();
  const folder = String(params.folder);

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [currentPath, setCurrentPath] = useState("");

  // View & sort state
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  const isRecycleBin = folder === "recycle-bin";

  const folderTitle =
    folder === "company-documents"
      ? "Company Documents"
      : folder === "contracts"
      ? "Contracts"
      : folder === "government-documents"
      ? "Government Documents"
      : folder === "client-files"
      ? "Client Files"
      : folder === "archive"
      ? "Archive"
      : folder === "recycle-bin"
      ? "Recycle Bin"
      : folder;

  async function loadFiles() {
    try {
      setLoading(true);
      const data = await listDocumentVaultFiles(folder, currentPath);
      setItems(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFiles();
  }, [folder, currentPath]);

  // ---- Filtering ----
  const filteredItems = useMemo(() => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [items, searchTerm]);

  // ---- Sorting ----
  const sortedItems = useMemo(() => {
    const sorted = [...filteredItems];
    // Folders first always
    sorted.sort((a, b) => {
      if (a.type === "folder" && b.type !== "folder") return -1;
      if (a.type !== "folder" && b.type === "folder") return 1;
      return 0;
    });
    // Then sort within groups
    sorted.sort((a, b) => {
      // If both are folders or both are files, sort by field
      if ((a.type === "folder" && b.type === "folder") || (a.type !== "folder" && b.type !== "folder")) {
        let aVal, bVal;
        switch (sortField) {
          case "name":
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
            break;
          case "size":
            aVal = a.size || 0;
            bVal = b.size || 0;
            break;
          case "modified":
            aVal = new Date(a.modified || 0).getTime();
            bVal = new Date(b.modified || 0).getTime();
            break;
          case "type":
            aVal = a.name.split(".").pop()?.toLowerCase() || "";
            bVal = b.name.split(".").pop()?.toLowerCase() || "";
            break;
          default:
            aVal = a.name.toLowerCase();
            bVal = b.name.toLowerCase();
        }
        if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
        if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
        return 0;
      }
      return 0;
    });
    return sorted;
  }, [filteredItems, sortField, sortOrder]);

  // ---- Selection ----
  const isAllSelected = sortedItems.length > 0 && selected.length === sortedItems.length;
  const isIndeterminate = selected.length > 0 && selected.length < sortedItems.length;

  const selectAll = () => {
    setSelected(sortedItems.map((item) => item.name));
  };

  const deselectAll = () => {
    setSelected([]);
  };

  const toggleSelection = (name: string) => {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((x) => x !== name) : [...prev, name]
    );
  };

  // ---- Navigation ----
  const navigateToFolder = (folderName: string) => {
    const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
    setCurrentPath(newPath);
  };

  const goBack = () => {
    const parts = currentPath.split("/");
    parts.pop();
    setCurrentPath(parts.join("/"));
  };

  // ---- Item Actions (unchanged) ----
  const handleDeleteItem = async (item: any) => {
    if (isRecycleBin) {
      const ok = await confirmWithCode();
      if (!ok) return;
    }
    if (!confirm(`Delete "${item.name}"?`)) return;

    const fullName = currentPath ? `${currentPath}/${item.name}` : item.name;
    if (isRecycleBin) {
      await deleteDocumentVaultFile(folder, fullName);
    } else {
      await moveToRecycleBin(folder, fullName);
    }
    loadFiles();
  };

  const handleRestoreItem = async (item: any) => {
    if (!confirm(`Restore "${item.name}"?`)) return;
    await restoreFromRecycleBin(item.name);
    loadFiles();
  };

  const handleRenameItem = async (item: any) => {
    const newName = prompt("Enter new file name", item.name);
    if (!newName || newName === item.name) return;
    await renameDocumentVaultFile(folder, item.name, newName);
    loadFiles();
  };

  const handlePreviewItem = async (item: any) => {
    const fullName = currentPath ? `${currentPath}/${item.name}` : item.name;
    const link = await getDocumentVaultFileLink(folder, fullName);
    if (link) window.open(link, "_blank");
  };

  const handleDownloadItem = async (item: any) => {
    const fullName = currentPath ? `${currentPath}/${item.name}` : item.name;
    const link = await getDocumentVaultFileLink(folder, fullName);
    if (link) {
      const a = document.createElement("a");
      a.href = link;
      a.download = item.name;
      a.click();
    }
  };

  // ---- Bulk Actions ----
  const handleRestoreSelected = async () => {
    if (selected.length === 0) return;
    if (!confirm(`Restore ${selected.length} selected item(s)?`)) return;
    for (const name of selected) {
      await restoreFromRecycleBin(name);
    }
    setSelected([]);
    loadFiles();
  };

  const handleEmptyRecycleBin = async () => {
    const ok = await confirmWithCode();
    if (!ok) return;
    if (!confirm("Empty Recycle Bin? This cannot be undone.")) return;
    const result = await emptyRecycleBin();
    alert(`${result.success} of ${result.total} files deleted.`);
    loadFiles();
  };

  const handleDeleteSelected = async () => {
    if (selected.length === 0) return;
    if (isRecycleBin) {
      const ok = await confirmWithCode();
      if (!ok) return;
    }
    if (!confirm(`Delete ${selected.length} selected item(s)?`)) return;

    for (const name of selected) {
      const fullName = currentPath ? `${currentPath}/${name}` : name;
      if (isRecycleBin) {
        await deleteDocumentVaultFile(folder, fullName);
      } else {
        await moveToRecycleBin(folder, fullName);
      }
    }
    setSelected([]);
    loadFiles();
  };

  // ---- Folder / Upload / Refresh ----
  const handleCreateFolder = async () => {
    const folderName = prompt("Enter folder name");
    if (!folderName) return;
    try {
      const createPath = currentPath ? `${currentPath}/${folderName}` : folderName;
      await createDocumentVaultFolder(folder, createPath);
      await loadFiles();
      alert("Folder created successfully");
    } catch (err) {
      console.error(err);
      alert("Failed to create folder");
    }
  };

  const handleUpload = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "*/*";
    input.style.position = "fixed";
    input.style.top = "-1000px";
    input.style.left = "-1000px";
    input.style.opacity = "0";
    input.style.pointerEvents = "none";
    document.body.appendChild(input);

    const cleanup = () => {
      if (input.parentNode) document.body.removeChild(input);
    };

    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = Array.from(target.files || []);
      cleanup();
      if (files.length === 0) return;
      setUploading(true);
      try {
        await uploadMultipleDocumentVaultFiles(folder, files, currentPath);
        await loadFiles();
        alert(`${files.length} file(s) uploaded successfully`);
      } catch (err) {
        console.error("Upload error:", err);
        alert("Upload failed.");
      } finally {
        setUploading(false);
      }
    };
    input.click();
    setTimeout(cleanup, 60000);
  };

  const handleDroppedFiles = async (files: File[]) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      await uploadMultipleDocumentVaultFiles(folder, files, currentPath);
      await loadFiles();
      alert(`${files.length} file(s) uploaded successfully`);
    } catch (err) {
      console.error("Drop upload error:", err);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleRefresh = async () => {
    await loadFiles();
  };

  // ---- Toggle sort order ----
  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-4">
      {/* Back + Title */}
      <div className="flex items-center gap-3 mb-3">
        <Link
          href="/document-vault"
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm"
        >
          <FaArrowLeft size={14} />
          Back
        </Link>
        <h1 className="text-xl font-bold">{folderTitle}</h1>
        {currentPath && (
          <button
            onClick={goBack}
            className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-sm"
          >
            ← Back Folder
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border shadow-sm p-4">
        {/* === COMPACT TOP BAR – SINGLE ROW === */}
        <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-gray-100">
          <FaFolderOpen className="text-indigo-600 w-5 h-5 flex-shrink-0" />
          <span className="font-semibold text-sm">Dropbox Folder</span>
          <span className="text-xs text-gray-500">({sortedItems.length})</span>

          {/* Breadcrumb */}
          <div className="flex items-center text-xs text-gray-500 gap-0.5 flex-nowrap overflow-x-auto max-w-xs">
            <button
              onClick={() => setCurrentPath("")}
              className="text-blue-600 hover:underline whitespace-nowrap"
            >
              {folder}
            </button>
            {currentPath &&
              currentPath.split("/").map((part, index, arr) => {
                const path = arr.slice(0, index + 1).join("/");
                return (
                  <span key={path} className="flex items-center whitespace-nowrap">
                    <span className="mx-0.5">/</span>
                    <button
                      onClick={() => setCurrentPath(path)}
                      className="text-blue-600 hover:underline"
                    >
                      {part}
                    </button>
                  </span>
                );
              })}
          </div>

          {/* Search */}
          <div className="flex-1 min-w-[100px] max-w-[200px]">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1 text-xs border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* View toggle & Sort */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded ${viewMode === "list" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title="List view"
            >
              <FaList size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "text-gray-500 hover:bg-gray-100"}`}
              title="Grid view"
            >
              <FaThLarge size={16} />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="text-xs border rounded px-2 py-1 bg-white"
            >
              <option value="name">Name</option>
              <option value="size">Size</option>
              <option value="modified">Date</option>
              <option value="type">Type</option>
            </select>
            <button
              onClick={toggleSortOrder}
              className="text-xs px-2 py-1 border rounded hover:bg-gray-50"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>

          {/* Upload/Folder/Refresh */}
          <div className="flex items-center gap-1 flex-shrink-0 ml-auto">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {uploading ? "..." : "Upload"}
            </button>
            <button
              onClick={handleCreateFolder}
              className="px-3 py-1 text-xs bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Folder
            </button>
            <button
              onClick={handleRefresh}
              className="px-3 py-1 text-xs bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Refresh
            </button>
            {/* Select All */}
            <div className="ml-2 flex items-center gap-1">
              <input
                type="checkbox"
                checked={isAllSelected}
                ref={(el) => {
                  if (el) {
                    el.indeterminate = isIndeterminate && !isAllSelected && selected.length > 0;
                  }
                }}
                onChange={(e) => {
                  if (e.target.checked) selectAll();
                  else deselectAll();
                }}
                className="w-3.5 h-3.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-xs text-gray-600">All</span>
            </div>
          </div>
        </div>

        {/* Recycle Bin actions (if applicable) */}
        <RecycleBinActions
          isRecycleBin={isRecycleBin}
          selectedCount={selected.length}
          onRestoreSelected={handleRestoreSelected}
          onEmptyRecycleBin={handleEmptyRecycleBin}
        />

        {/* File list with drag-drop */}
        {loading ? (
          <div className="py-4 text-gray-500">Loading files...</div>
        ) : sortedItems.length === 0 ? (
          <div className="border rounded-xl p-6 bg-gray-50 text-center text-gray-500">
            {isRecycleBin ? "Recycle Bin is empty." : "No files found."}
          </div>
        ) : (
          <div
            onDrop={(e) => {
              e.preventDefault();
              const files = Array.from(e.dataTransfer.files);
              if (files.length) handleDroppedFiles(files);
            }}
            onDragOver={(e) => e.preventDefault()}
          >
            <FileList
              items={sortedItems}
              folder={folder}
              selected={selected}
              toggleSelection={toggleSelection}
              handleDeleteItem={handleDeleteItem}
              handleRestoreItem={handleRestoreItem}
              handleRenameItem={handleRenameItem}
              handlePreviewItem={handlePreviewItem}
              handleDownloadItem={handleDownloadItem}
              formatFileSize={formatFileSize}
              formatDate={formatDate}
              onFolderClick={navigateToFolder}
              isRecycleBin={isRecycleBin}
              selectAll={selectAll}
              deselectAll={deselectAll}
              isAllSelected={isAllSelected}
              isIndeterminate={isIndeterminate}
              viewMode={viewMode}  // new prop
            />
          </div>
        )}
      </div>

      {/* Bulk action bar */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-3 flex flex-wrap items-center justify-between gap-3 z-50">
          <span className="text-sm font-medium">{selected.length} item(s) selected</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelected([])}
              className="text-gray-600 hover:text-gray-800 px-3 py-1.5 rounded border text-sm"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteSelected}
              className="bg-red-600 text-white px-4 py-1.5 rounded hover:bg-red-700 text-sm"
            >
              {isRecycleBin ? "Delete Permanently" : "Move to Recycle Bin"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}