"use client";

import { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";

interface SearchBarProps {
  onSearch: (term: string) => void;
  placeholder?: string;
}

export default function SearchBar({ onSearch, placeholder = "Search by client, number, or date..." }: SearchBarProps) {
  const [term, setTerm] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      onSearch(term);
    }, 300);
    return () => clearTimeout(timeout);
  }, [term, onSearch]);

  const clearSearch = () => {
    setTerm("");
    onSearch("");
  };

  return (
    <div className="relative mb-4">
      <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
      <input
        type="text"
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        placeholder={placeholder}
        className="w-full border rounded-lg py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
      />
      {term && (
        <button
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <FaTimes size={14} />
        </button>
      )}
    </div>
  );
}