"use client";

import {
  FaFolder,
  FaTrash,
  FaEdit,
  FaUndo,
  FaEye,
  FaDownload,
  FaFile,
  FaSync,
} from "react-icons/fa";
import { getDocumentVaultThumbnail } from "@/lib/dropboxSync";
import { useState, useEffect, useRef, useCallback } from "react";

interface FileListProps {
  items: any[];
  folder: string;
  selected: string[];
  toggleSelection: (name: string) => void;
  handleDeleteItem: (item: any) => void;
  handleRestoreItem: (item: any) => void;
  handleRenameItem: (item: any) => void;
  handlePreviewItem: (item: any) => void;
  handleDownloadItem: (item: any) => void;
  formatFileSize: (size: number) => string;
  formatDate: (date: string) => string;
  onFolderClick: (folderName: string) => void;
  isRecycleBin: boolean;
  selectAll: () => void;
  deselectAll: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  viewMode: "list" | "grid";
}

const getFileExtension = (filename: string) => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

const getFileColor = (filename: string) => {
  const ext = getFileExtension(filename);
  if (["pdf"].includes(ext)) return "text-red-500";
  if (["doc", "docx"].includes(ext)) return "text-blue-500";
  if (["xls", "xlsx", "csv"].includes(ext)) return "text-green-500";
  if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "text-purple-500";
  if (["zip", "rar", "7z"].includes(ext)) return "text-orange-500";
  return "text-gray-500";
};

// ----- Cache helpers (localStorage with 1-hour TTL) -----
const CACHE_KEY_PREFIX = "thumb_cache_";
const CACHE_EXPIRY_MS = 60 * 60 * 1000;

function getCacheKey(fullPath: string): string {
  return CACHE_KEY_PREFIX + fullPath.replace(/\//g, "_");
}

function getCachedThumbnail(fullPath: string): string | null {
  try {
    const key = getCacheKey(fullPath);
    const item = localStorage.getItem(key);
    if (!item) return null;
    const { data, timestamp } = JSON.parse(item);
    if (Date.now() - timestamp > CACHE_EXPIRY_MS) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function setCachedThumbnail(fullPath: string, data: string) {
  try {
    const key = getCacheKey(fullPath);
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // localStorage unavailable or quota exceeded – silently ignore
  }
}

function clearThumbnailCache() {
  try {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(CACHE_KEY_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch {
    // ignore
  }
}

export default function FileList({
  items,
  folder,
  selected,
  toggleSelection,
  handleDeleteItem,
  handleRestoreItem,
  handleRenameItem,
  handlePreviewItem,
  handleDownloadItem,
  formatFileSize,
  formatDate,
  onFolderClick,
  isRecycleBin,
  viewMode,
}: FileListProps) {
  const [thumbUrls, setThumbUrls] = useState<Record<string, string>>({});
  const [loadingThumbs, setLoadingThumbs] = useState<Record<string, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadedRef = useRef<Set<string>>(new Set());

  // ----- Fetch a single thumbnail (with cache) -----
  const fetchThumbForItem = useCallback(
    async (item: any) => {
      const fullPath = item.path_lower || `/${folder}/${item.name}`;
      const name = item.name;

      // Check cache first
      const cached = getCachedThumbnail(fullPath);
      if (cached) {
        setThumbUrls((prev) => ({ ...prev, [name]: cached }));
        loadedRef.current.add(name);
        return;
      }

      // Avoid duplicate fetches
      if (loadingThumbs[name]) return;
      setLoadingThumbs((prev) => ({ ...prev, [name]: true }));

      try {
        const thumb = await getDocumentVaultThumbnail(fullPath, "w128h128");
        if (thumb) {
          setThumbUrls((prev) => ({ ...prev, [name]: thumb }));
          setCachedThumbnail(fullPath, thumb);
        }
      } catch {
        // silently fail – the user will see the file icon
      } finally {
        setLoadingThumbs((prev) => ({ ...prev, [name]: false }));
        loadedRef.current.add(name);
      }
    },
    [folder, loadingThumbs]
  );

  // ----- Refresh all thumbnails (clear cache + reload all) -----
  const refreshThumbnails = useCallback(async () => {
    setIsRefreshing(true);
    clearThumbnailCache();
    setThumbUrls({});
    loadedRef.current.clear();

    const fileItems = items.filter((item) => item.type === "file");
    // Set loading state for all files
    const loadingState: Record<string, boolean> = {};
    fileItems.forEach((item) => (loadingState[item.name] = true));
    setLoadingThumbs(loadingState);

    // Fetch with concurrency limit (3)
    const concurrency = 3;
    for (let i = 0; i < fileItems.length; i += concurrency) {
      const chunk = fileItems.slice(i, i + concurrency);
      await Promise.all(chunk.map((item) => fetchThumbForItem(item)));
    }
    setIsRefreshing(false);
  }, [items, fetchThumbForItem]);

  // ----- Intersection Observer setup -----
  useEffect(() => {
    if (viewMode !== "grid") return;

    const fileItems = items.filter((item) => item.type === "file");
    if (fileItems.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const itemName = entry.target.getAttribute("data-name");
            if (itemName) {
              const item = items.find((i) => i.name === itemName);
              if (item && !loadedRef.current.has(itemName)) {
                fetchThumbForItem(item);
              }
            }
          }
        });
      },
      { rootMargin: "50px" }
    );

    const container = containerRef.current;
    if (!container) return;

    const fileCards = container.querySelectorAll<HTMLDivElement>(
      '[data-type="file"]'
    );
    fileCards.forEach((card) => {
      observerRef.current!.observe(card);
    });

    return () => {
      observerRef.current?.disconnect();
    };
  }, [viewMode, items, fetchThumbForItem]);

  // ----- Initial load: restore from cache -----
  useEffect(() => {
    if (viewMode === "grid") {
      const fileItems = items.filter((item) => item.type === "file");
      const cachedUrls: Record<string, string> = {};
      fileItems.forEach((item) => {
        const fullPath = item.path_lower || `/${folder}/${item.name}`;
        const cached = getCachedThumbnail(fullPath);
        if (cached) {
          cachedUrls[item.name] = cached;
          loadedRef.current.add(item.name);
        }
      });
      setThumbUrls(cachedUrls);
    } else {
      setThumbUrls({});
      loadedRef.current.clear();
    }
  }, [viewMode, items, folder]);

  if (items.length === 0) {
    return (
      <div className="border rounded-xl p-12 bg-gray-50 text-gray-500 text-center">
        {isRecycleBin ? "Recycle Bin is empty." : "No files found."}
      </div>
    );
  }

  // ---- GRID VIEW ----
  if (viewMode === "grid") {
    return (
      <div ref={containerRef}>
        {/* Refresh Button */}
        <div className="flex justify-end mb-2">
          <button
            onClick={refreshThumbnails}
            disabled={isRefreshing}
            className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            <FaSync className={`${isRefreshing ? "animate-spin" : ""}`} size={14} />
            {isRefreshing ? "Refreshing..." : "Refresh Thumbnails"}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mt-2">
          {items.map((item) => {
            const isSelected = selected.includes(item.name);
            const isFolder = item.type === "folder";
            const thumbUrl = thumbUrls[item.name];
            const isLoading = loadingThumbs[item.name];

            return (
              <div
                key={item.name}
                data-type={isFolder ? "folder" : "file"}
                data-name={item.name}
                className={`relative border rounded-lg p-3 transition-all hover:shadow-lg cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 border-blue-400 ring-2 ring-blue-400"
                    : "bg-white border-gray-200 hover:border-blue-300"
                } group`}
                onClick={() => {
                  if (isFolder) {
                    onFolderClick(item.name);
                  } else {
                    handlePreviewItem(item);
                  }
                }}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => toggleSelection(item.name)}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute top-2 left-2 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 z-10 cursor-pointer"
                />

                <div className="flex justify-center items-center h-24 mt-4">
                  {isFolder ? (
                    <FaFolder className="text-yellow-500 w-16 h-16" />
                  ) : thumbUrl ? (
                    <div className="w-20 h-20 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={thumbUrl}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  ) : isLoading ? (
                    <div className="w-16 h-16 rounded-md bg-gray-100 animate-pulse flex items-center justify-center">
                      <div className="w-8 h-8 bg-gray-300 rounded"></div>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-md bg-gray-50 flex items-center justify-center border border-gray-200">
                      <FaFile className={`${getFileColor(item.name)} w-10 h-10`} />
                    </div>
                  )}
                </div>

                <div className="mt-2 text-center">
                  <span className="font-medium text-gray-800 text-xs break-all line-clamp-2">
                    {item.name}
                  </span>
                </div>

                {!isFolder && (
                  <div className="mt-1 text-[10px] text-gray-500 text-center">
                    <div>{formatFileSize(item.size || 0)}</div>
                    {item.modified && <div>{formatDate(item.modified)}</div>}
                  </div>
                )}

                <div
                  className="mt-2 flex justify-center gap-1 flex-wrap opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  {isRecycleBin ? (
                    <>
                      <button
                        onClick={() => handleRestoreItem(item)}
                        className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                        title="Restore"
                      >
                        <FaUndo size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Permanently"
                      >
                        <FaTrash size={12} />
                      </button>
                    </>
                  ) : (
                    <>
                      {!isFolder && (
                        <>
                          <button
                            onClick={() => handlePreviewItem(item)}
                            className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                            title="Preview"
                          >
                            <FaEye size={12} />
                          </button>
                          <button
                            onClick={() => handleDownloadItem(item)}
                            className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-md transition-colors"
                            title="Download"
                          >
                            <FaDownload size={12} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => handleRenameItem(item)}
                        className="p-1.5 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded-md transition-colors"
                        title="Rename"
                      >
                        <FaEdit size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item)}
                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                        title="Move to Recycle Bin"
                      >
                        <FaTrash size={12} />
                      </button>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---- LIST VIEW ----
  return (
    <div className="border rounded-lg overflow-hidden mt-2">
      {items.map((item) => {
        const isSelected = selected.includes(item.name);
        const isFolder = item.type === "folder";

        return (
          <div
            key={item.name}
            className={`flex items-center gap-3 px-3 py-2 border-b border-gray-100 last:border-0 transition-colors ${
              isSelected ? "bg-blue-50" : "hover:bg-gray-50"
            } group`}
          >
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => toggleSelection(item.name)}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer flex-shrink-0"
            />

            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
              {isFolder ? (
                <FaFolder className="text-yellow-500 w-6 h-6" />
              ) : (
                <FaFile className={`${getFileColor(item.name)} w-5 h-5`} />
              )}
            </div>

            <div className="flex-1 min-w-0">
              {isFolder ? (
                <button
                  onClick={() => onFolderClick(item.name)}
                  className="text-sm font-medium text-blue-600 hover:underline truncate w-full text-left"
                >
                  {item.name}
                </button>
              ) : (
                <span className="text-sm text-gray-800 truncate block">
                  {item.name}
                </span>
              )}
            </div>

            {!isFolder && (
              <div className="text-xs text-gray-500 flex-shrink-0 w-20 text-right">
                {formatFileSize(item.size || 0)}
              </div>
            )}

            {item.modified && (
              <div className="text-xs text-gray-500 flex-shrink-0 w-28 text-right hidden sm:block">
                {formatDate(item.modified)}
              </div>
            )}

            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              {isRecycleBin ? (
                <>
                  <button
                    onClick={() => handleRestoreItem(item)}
                    className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                    title="Restore"
                  >
                    <FaUndo size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    title="Delete Permanently"
                  >
                    <FaTrash size={14} />
                  </button>
                </>
              ) : (
                <>
                  {!isFolder && (
                    <>
                      <button
                        onClick={() => handlePreviewItem(item)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                        title="Preview"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => handleDownloadItem(item)}
                        className="p-1.5 text-green-600 hover:text-green-800 hover:bg-green-50 rounded"
                        title="Download"
                      >
                        <FaDownload size={14} />
                      </button>
                    </>
                  )}
                  <button
                    onClick={() => handleRenameItem(item)}
                    className="p-1.5 text-orange-600 hover:text-orange-800 hover:bg-orange-50 rounded"
                    title="Rename"
                  >
                    <FaEdit size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item)}
                    className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    title="Move to Recycle Bin"
                  >
                    <FaTrash size={14} />
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}