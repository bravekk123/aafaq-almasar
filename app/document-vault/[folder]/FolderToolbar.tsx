"use client";

import SearchBar from "@/components/SearchBar";
import DocumentDropzone from "@/components/DocumentDropzone";
import { FaUpload, FaPlus, FaSync } from "react-icons/fa";

interface FolderToolbarProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  handleUpload: () => void;
  handleCreateFolder: () => void;
  handleRefresh: () => void;
  uploading: boolean;
  currentFolder: string;
  isRecycleBin: boolean;
  onDropFiles: (files: File[]) => void; // <-- NEW prop
}

export default function FolderToolbar({
  searchTerm,
  setSearchTerm,
  handleUpload,
  handleCreateFolder,
  handleRefresh,
  uploading,
  currentFolder,
  isRecycleBin,
  onDropFiles, // <-- receive it
}: FolderToolbarProps) {
  // In Recycle Bin, hide upload & create folder
  if (isRecycleBin) {
    return (
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1">
          <SearchBar placeholder="Search files..." onSearch={setSearchTerm} />
        </div>
        <button
          onClick={handleRefresh}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaSync />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="flex-1">
          <SearchBar placeholder="Search files..." onSearch={setSearchTerm} />
        </div>

        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          disabled={uploading}
        >
          <FaUpload />
          {uploading ? "Uploading..." : "Upload"}
        </button>

        <button
          onClick={handleCreateFolder}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Folder
        </button>

        <button
          onClick={handleRefresh}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaSync />
          Refresh
        </button>
      </div>

      <DocumentDropzone onFiles={onDropFiles} /> {/* <-- Pass onDropFiles here */}
    </>
  );
}