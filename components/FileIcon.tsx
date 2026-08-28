"use client";

import {
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileImage,
  FaFileArchive,
  FaFileAlt,
} from "react-icons/fa";

interface FileIconProps {
  filename: string;
}

export default function FileIcon({
  filename,
}: FileIconProps) {
  const ext =
    filename.split(".").pop()?.toLowerCase() || "";

  if (["pdf"].includes(ext))
    return <FaFilePdf className="text-red-600" size={22} />;

  if (["doc", "docx"].includes(ext))
    return <FaFileWord className="text-blue-600" size={22} />;

  if (["xls", "xlsx", "csv"].includes(ext))
    return <FaFileExcel className="text-green-600" size={22} />;

  if (
    ["jpg", "jpeg", "png", "gif", "webp"].includes(ext)
  )
    return <FaFileImage className="text-purple-600" size={22} />;

  if (
    ["zip", "rar", "7z"].includes(ext)
  )
    return <FaFileArchive className="text-orange-600" size={22} />;

  return <FaFileAlt className="text-gray-600" size={22} />;
}