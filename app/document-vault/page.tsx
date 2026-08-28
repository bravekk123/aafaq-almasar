"use client";

import Link from "next/link";
import {
  FaFolder,
  FaFileContract,
  FaBuilding,
  FaArchive,
  FaUsers,
  FaTrash,
} from "react-icons/fa";

export default function DocumentVaultPage() {
  const folders = [
    {
      name: "Company Documents",
      icon: <FaBuilding size={32} />,
      description:
        "Trade License, TRN Certificate, Chamber Membership, MOA, Bank Letters",
      path: "/document-vault/company-documents",
    },
    {
      name: "Contracts",
      icon: <FaFileContract size={32} />,
      description:
        "Client Contracts, Supplier Contracts, NDA and Agreements",
      path: "/document-vault/contracts",
    },
    {
      name: "Government Documents",
      icon: <FaFolder size={32} />,
      description:
        "Vendor Registrations, Government Approvals and Certificates",
      path: "/document-vault/government-documents",
    },
    {
      name: "Client Files",
      icon: <FaUsers size={32} />,
      description:
        "Client-specific project documents and correspondence",
      path: "/document-vault/client-files",
    },
    {
      name: "Archive",
      icon: <FaArchive size={32} />,
      description:
        "Old quotations, completed projects and archived records",
      path: "/document-vault/archive",
    },
    {
      name: "Recycle Bin",
      icon: <FaTrash size={32} className="text-red-500" />,
      description:
        "Deleted files and folders – restore or permanently delete",
      path: "/document-vault/recycle-bin",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Document Vault
        </h1>

        <p className="text-gray-600 mt-2">
          Secure company document management system connected to Dropbox.
        </p>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {folders.map((folder) => (
          <Link
            key={folder.name}
            href={folder.path}
            className="border rounded-2xl p-6 bg-white shadow-sm hover:shadow-lg transition"
          >
            <div className="text-green-600 mb-4">
              {folder.icon}
            </div>

            <h2 className="font-bold text-lg mb-2">
              {folder.name}
            </h2>

            <p className="text-sm text-gray-600">
              {folder.description}
            </p>
          </Link>
        ))}
      </div>
    </main>
  );
}