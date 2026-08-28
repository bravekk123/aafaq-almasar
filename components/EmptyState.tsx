"use client";

import { FaFileInvoice } from "react-icons/fa";

interface EmptyStateProps {
  type: "invoices" | "quotations" | "letters";
  searchTerm?: string;
}

export default function EmptyState({ type, searchTerm }: EmptyStateProps) {
  const messages = {
    invoices: searchTerm ? "No invoices match your search." : "No invoices in this folder. Click + New Invoice to create one.",
    quotations: searchTerm ? "No quotations match your search." : "No quotations in this folder. Click + New Quotation to create one.",
    letters: searchTerm ? "No letters match your search." : "No letters in this folder. Click + New Letter to create one.",
  };

  const iconMap = {
    invoices: <FaFileInvoice className="text-gray-400 text-6xl mb-4" />,
    quotations: <FaFileInvoice className="text-gray-400 text-6xl mb-4" />,
    letters: <FaFileInvoice className="text-gray-400 text-6xl mb-4" />,
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {iconMap[type]}
      <p className="text-gray-500 text-sm">{messages[type]}</p>
    </div>
  );
}