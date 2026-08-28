"use client";

import { useState } from "react";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { useDocuments } from "@/hooks/useDocuments";
import { useDocumentSelection } from "@/hooks/useDocumentSelection";
import DocumentSidebar from "@/components/documents/DocumentSidebar";
import { LetterForm } from "@/components/documents/DocumentForm";
import LetterPrintArea from "@/components/documents/LetterPrintArea";
import BulkActionBar from "@/components/BulkActionBar";
import { getSearchFields, exportBackup } from "@/lib/documentHelpers";
import {
  trackLetterCreated,
  trackLetterUpdated,
  trackLetterDeleted,
  trackLetterBulkDeleted,
  trackLetterPrinted,
} from "@/lib/analytics";
import { Letter } from "@/types/documents";
import toast from "react-hot-toast";
import { generatePDF } from "@/lib/pdfGenerator";

export default function LetterPage() {
  const [currentFolderPath, setCurrentFolderPath] = useState("");
  const MAX_CHARS = 2000;

  // Form state
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [letterNumber, setLetterNumber] = useState("");
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [signatory, setSignatory] = useState<"aftab" | "imran" | "none">("aftab");
  const [signatoryTitle, setSignatoryTitle] = useState("");
  const [includeStamp, setIncludeStamp] = useState(false);

  // Document hooks
  const {
    items,
    selectedId,
    isEditing,
    setIsEditing,
    setSelectedId,
    saveItem,
    updateItem,
    deleteItem,
    bulkDelete,
  } = useDocuments<Letter>(
    "letter",
    currentFolderPath,
    trackLetterCreated,
    trackLetterUpdated,
    trackLetterDeleted,
    trackLetterBulkDeleted
  );

  // Search
  const { searchTerm, setSearchTerm, filteredItems } = useSearchFilter<Letter>(
    items,
    getSearchFields("letter")
  );

  // Selection
  const {
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    isAllSelected,
  } = useDocumentSelection(items, filteredItems);

  // ----- Helpers -----
  const clearForm = () => {
    setDate(new Date().toISOString().split("T")[0]);
    setLetterNumber("");
    setRecipient("");
    setTitle("");
    setContent("");
    setSignatory("aftab");
    setSignatoryTitle("");
    setIncludeStamp(false);
    setIsEditing(false);
    setSelectedId(null);
  };

  const loadLetterForEdit = async (letter: Letter) => {
    const { confirmWithCode } = await import("@/lib/security");
    if (!await confirmWithCode()) return;
    setDate(letter.date);
    setLetterNumber((letter as any).letterNumber || "");
    setRecipient(letter.recipient);
    setTitle(letter.title);
    setContent(letter.content);
    setSignatory(letter.signatory);
    setSignatoryTitle(letter.signatoryTitle || "");
    setIncludeStamp(letter.includeStamp || false);
    setSelectedId(letter.id);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const newLetter: Letter = {
      id: Date.now().toString(),
      date,
      recipient,
      title,
      content,
      signatory,
      signatoryTitle,
      includeStamp,
    };
    await saveItem(newLetter);
    clearForm();
  };

  const handleUpdate = async () => {
    if (!selectedId) {
      toast.error("No letter selected to update");
      return;
    }
    const updatedLetter: Letter = {
      id: selectedId,
      date,
      recipient,
      title,
      content,
      signatory,
      signatoryTitle,
      includeStamp,
    };
    await updateItem(updatedLetter);
    clearForm();
  };

  const handleBulkDelete = async () => {
    await bulkDelete(selectedIds);
    clearSelection();
  };

  const handlePrint = () => {
    trackLetterPrinted();
    window.print();
  };

  // ----- NEW: View and Download handlers -----
  const handleView = (letter: Letter) => {
    sessionStorage.setItem("previewDoc", JSON.stringify({ type: "letter", data: letter }));
    window.open("/letter/preview", "_blank");
  };

  const handleDownload = async (letter: Letter) => {
    await generatePDF(
      <LetterPrintArea
        date={letter.date}
        letterNumber={letter.letterNumber || ""}
        recipient={letter.recipient}
        title={letter.title}
        content={letter.content}
        signatory={letter.signatory}
        signatoryTitle={letter.signatoryTitle || ""}
        includeStamp={letter.includeStamp || false}
      />,
      `Letter-${letter.letterNumber || "untitled"}.pdf`
    );
    // Optionally track download if you have a tracker
  };

  // ----- Render -----
  return (
    <div className="bg-gray-100 min-h-screen p-4 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 print:hidden">
        <DocumentSidebar
          type="letter"
          currentFolderPath={currentFolderPath}
          setCurrentFolderPath={setCurrentFolderPath}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredItems={filteredItems}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
          onEdit={loadLetterForEdit}
          onDelete={deleteItem}
          onView={handleView}
          onDownload={handleDownload}
          selectAll={selectAll}
          isAllSelected={isAllSelected}
          onNew={clearForm}
          onExportBackup={() => exportBackup("letter")}
          searchPlaceholder="Search by title, recipient, or date..."
          newButtonLabel="+ New Letter"
        />

        <LetterForm
          date={date}
          setDate={setDate}
          letterNumber={letterNumber}
          setLetterNumber={setLetterNumber}
          recipient={recipient}
          setRecipient={setRecipient}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          signatory={signatory}
          setSignatory={setSignatory}
          signatoryTitle={signatoryTitle}
          setSignatoryTitle={setSignatoryTitle}
          includeStamp={includeStamp}
          setIncludeStamp={setIncludeStamp}
          isEditing={isEditing}
          onSave={handleSave}
          onUpdate={handleUpdate}
          onPrint={handlePrint}
          maxChars={MAX_CHARS}
        />
      </div>

      <LetterPrintArea
        date={date}
        letterNumber={letterNumber}
        recipient={recipient}
        title={title}
        content={content}
        signatory={signatory}
        signatoryTitle={signatoryTitle}
        includeStamp={includeStamp}
      />

      <BulkActionBar
        selectedCount={selectedIds.size}
        onDelete={handleBulkDelete}
        onCancel={clearSelection}
      />
    </div>
  );
}