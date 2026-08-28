"use client";
import { useState, useEffect } from "react";
import { listFolderContents, createFolder, deleteFolder } from "@/lib/dropboxSync";
import { FaTrash } from "react-icons/fa";
import { confirmWithCode } from "@/lib/security";
import toast from "react-hot-toast";

interface FolderSelectorProps {
  type: "invoices" | "quotations" | "letters";
  onSelect: (folderPath: string) => void;
  currentPath: string;
}

const monthOrder: { [key: string]: number } = {
  "January": 1, "February": 2, "March": 3, "April": 4,
  "May": 5, "June": 6, "July": 7, "August": 8,
  "September": 9, "October": 10, "November": 11, "December": 12,
  "Jan": 1, "Feb": 2, "Mar": 3, "Apr": 4,
  "Jun": 6, "Jul": 7, "Aug": 8,
  "Sep": 9, "Oct": 10, "Nov": 11, "Dec": 12,
  "01": 1, "02": 2, "03": 3, "04": 4,
  "05": 5, "06": 6, "07": 7, "08": 8,
  "09": 9, "10": 10, "11": 11, "12": 12,
};

export default function FolderSelector({ type, onSelect, currentPath }: FolderSelectorProps) {
  const [years, setYears] = useState<string[]>([]);
  const [months, setMonths] = useState<string[]>([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadYears = async () => {
      const items = await listFolderContents(type, "");
      const folders = items.filter((i: any) => i.type === "folder").map((i: any) => i.name);
      const numericYears = folders.filter((f: string) => /^\d{4}$/.test(f)).sort().reverse();
      setYears(numericYears);
      if (numericYears.length > 0 && !selectedYear) setSelectedYear(numericYears[0]);
    };
    loadYears();
  }, [type]);

  useEffect(() => {
    if (!selectedYear) {
      setMonths([]);
      setSelectedMonth("");
      return;
    }
    const loadMonths = async () => {
      const items = await listFolderContents(type, selectedYear);
      const folders = items.filter((i: any) => i.type === "folder").map((i: any) => i.name);
      const sorted = [...folders].sort((a, b) => (monthOrder[a] ?? 999) - (monthOrder[b] ?? 999));
      setMonths(sorted);
      if (sorted.length > 0 && !selectedMonth) setSelectedMonth(sorted[0]);
    };
    loadMonths();
  }, [selectedYear, type]);

  useEffect(() => {
    if (selectedYear && selectedMonth) {
      onSelect(`${selectedYear}/${selectedMonth}`);
    } else if (selectedYear) {
      onSelect(selectedYear);
    } else {
      onSelect("");
    }
  }, [selectedYear, selectedMonth, onSelect]);

  const handleCreateYear = async () => {
    const year = prompt("Enter year (e.g., 2026):");
    if (!year || !/^\d{4}$/.test(year)) return;
    setLoading(true);
    await createFolder(type, year);
    setYears(prev => [...prev, year].sort().reverse());
    setSelectedYear(year);
    setLoading(false);
  };

  const handleCreateMonth = async () => {
    if (!selectedYear) {
      toast.error("Select a year first");
      return;
    }
    const month = prompt("Enter month name (e.g., January, February, or Jan):");
    if (!month) return;
    setLoading(true);
    await createFolder(type, `${selectedYear}/${month}`);
    const items = await listFolderContents(type, selectedYear);
    const folders = items.filter((i: any) => i.type === "folder").map((i: any) => i.name);
    const sorted = [...folders].sort((a, b) => (monthOrder[a] ?? 999) - (monthOrder[b] ?? 999));
    setMonths(sorted);
    setSelectedMonth(month);
    setLoading(false);
  };

  const handleDeleteYear = async (year: string) => {
    if (!await confirmWithCode()) return;
    if (!confirm(`Delete folder "${year}" and ALL its contents? This cannot be undone.`)) return;
    setLoading(true);
    await deleteFolder(type, year);
    setYears(prev => prev.filter(y => y !== year));
    if (selectedYear === year) {
      setSelectedYear("");
      setSelectedMonth("");
    }
    setLoading(false);
  };

  const handleDeleteMonth = async (month: string) => {
    if (!await confirmWithCode()) return;
    if (!selectedYear) return;
    const fullPath = `${selectedYear}/${month}`;
    if (!confirm(`Delete folder "${fullPath}" and ALL its contents? This cannot be undone.`)) return;
    setLoading(true);
    await deleteFolder(type, fullPath);
    setMonths(prev => prev.filter(m => m !== month));
    if (selectedMonth === month) setSelectedMonth("");
    setLoading(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold">Year / Month</h3>
        <button onClick={handleCreateYear} className="text-xs bg-blue-500 text-white px-2 py-1 rounded" aria-label="Create new year folder">
          + Year
        </button>
      </div>

      <div className="flex items-center gap-2">
        <select
          value={selectedYear}
          onChange={(e) => { setSelectedYear(e.target.value); setSelectedMonth(""); }}
          className="flex-1 border rounded p-2"
          aria-label="Select year"
        >
          <option value="">Select Year</option>
          {years.map(year => <option key={year}>{year}</option>)}
        </select>
        {selectedYear && (
          <button onClick={() => handleDeleteYear(selectedYear)} className="text-red-500 hover:text-red-700" title="Delete year folder" aria-label={`Delete year ${selectedYear}`}>
            <FaTrash />
          </button>
        )}
      </div>

      {selectedYear && (
        <div className="flex items-center gap-2 mt-3">
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex-1 border rounded p-2"
            aria-label="Select month"
          >
            <option value="">Select Month</option>
            {months.map(month => <option key={month}>{month}</option>)}
          </select>
          <button onClick={handleCreateMonth} className="bg-green-600 text-white px-2 py-2 rounded" aria-label="Create new month folder">+ Month</button>
          {selectedMonth && (
            <button onClick={() => handleDeleteMonth(selectedMonth)} className="text-red-500 hover:text-red-700" title="Delete month folder" aria-label={`Delete month ${selectedMonth}`}>
              <FaTrash />
            </button>
          )}
        </div>
      )}
      {loading && <p className="text-xs mt-2 text-gray-500">Updating folders...</p>}
      <div className="text-xs mt-2 text-gray-500">
        Current folder: <strong>{currentPath || "/"}</strong>
      </div>
    </div>
  );
}