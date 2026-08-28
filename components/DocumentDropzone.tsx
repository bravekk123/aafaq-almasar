"use client";

import { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

type DocumentDropzoneProps = {
  onFiles: (files: File[]) => void;
};

export default function DocumentDropzone({ onFiles }: DocumentDropzoneProps) {
  const [dragging, setDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);

    const files = Array.from(e.dataTransfer.files);
    console.log("📥 Dropped files:", files.map((f) => f.name));

    if (files.length > 0) {
      onFiles(files);
    }
  };

  const handleClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "*/*"; // Allow ALL file types
    input.style.display = "none";
    document.body.appendChild(input);

    input.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      const files = Array.from(target.files || []);
      if (files.length > 0) {
        console.log("📁 Selected files via click:", files.map((f) => f.name));
        onFiles(files);
      }
      if (input.parentNode) {
        document.body.removeChild(input);
      }
    };

    input.click();
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      className={`border-2 border-dashed rounded-xl p-10 text-center transition cursor-pointer ${
        dragging ? "border-green-500 bg-green-50" : "border-gray-300 hover:border-blue-400"
      }`}
    >
      <FaCloudUploadAlt className="mx-auto text-5xl text-green-600 mb-3" />
      <h3 className="font-bold text-lg">Drag & Drop Files Here</h3>
      <p className="text-gray-500 mt-2">All file types supported</p>
      <p className="text-xs text-gray-400 mt-1">Click to browse</p>
    </div>
  );
}