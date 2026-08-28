"use client";

import { useState, useEffect } from "react";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { useDocuments } from "@/hooks/useDocuments";
import { useDocumentSelection } from "@/hooks/useDocumentSelection";
import DocumentSidebar from "@/components/documents/DocumentSidebar";
import { QuotationForm } from "@/components/documents/DocumentForm";
import QuotationPrintArea from "@/components/documents/QuotationPrintArea";
import BulkActionBar from "@/components/BulkActionBar";
import { getSearchFields, exportBackup } from "@/lib/documentHelpers";
import {
  trackQuotationCreated,
  trackQuotationUpdated,
  trackQuotationDeleted,
  trackQuotationBulkDeleted,
  trackQuotationPDFDownloaded,
  trackQuotationPrinted,
  trackInvoiceImported,
} from "@/lib/analytics";
import { Quotation, QuotationItem } from "@/types/documents";
import toast from "react-hot-toast";
import { generatePDF } from "@/lib/pdfGenerator";

export default function QuotationPage() {
  const [currentFolderPath, setCurrentFolderPath] = useState("");

  // Form state
  const [quoteNumber, setQuoteNumber] = useState("QT-2026-001");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [validUntil, setValidUntil] = useState(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [clientName, setClientName] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [reference, setReference] = useState("UAE-REF-001");
  const [applyVat, setApplyVat] = useState(false);
  const [signatory, setSignatory] = useState<"aftab" | "imran" | "none">("aftab");
  const [signatoryTitle, setSignatoryTitle] = useState("");
  const [notes, setNotes] = useState("This quotation is valid for 30 days.");
  const [includeStamp, setIncludeStamp] = useState(false);

  const [items, setItems] = useState<QuotationItem[]>([]);
  const [itemDesc, setItemDesc] = useState("");
  const [itemQty, setItemQty] = useState(1);
  const [itemUnit, setItemUnit] = useState("Service");
  const [itemRate, setItemRate] = useState(0);

  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [savedInvoices, setSavedInvoices] = useState<any[]>([]);

  // Document hooks
  const {
    items: savedQuotes,
    selectedId,
    isEditing,
    setIsEditing,
    setSelectedId,
    saveItem,
    updateItem,
    deleteItem,
    bulkDelete,
  } = useDocuments<Quotation>(
    "quotation",
    currentFolderPath,
    trackQuotationCreated,
    trackQuotationUpdated,
    trackQuotationDeleted,
    trackQuotationBulkDeleted
  );

  // Search
  const { searchTerm, setSearchTerm, filteredItems } = useSearchFilter<Quotation>(
    savedQuotes,
    getSearchFields("quotation")
  );

  // Selection
  const {
    selectedIds,
    toggleSelect,
    selectAll,
    clearSelection,
    isAllSelected,
  } = useDocumentSelection(savedQuotes, filteredItems);

  // Load invoices for import
  useEffect(() => {
    const stored = localStorage.getItem("aafaq_invoices");
    if (stored) {
      try {
        setSavedInvoices(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  // ----- Helpers -----
  const addItem = () => {
    if (!itemDesc || !itemRate) return;
    setItems([...items, { id: Date.now().toString() + Math.random(), description: itemDesc, quantity: itemQty, unit: itemUnit, rate: itemRate }]);
    setItemDesc("");
    setItemQty(1);
    setItemUnit("Service");
    setItemRate(0);
  };

  const removeItem = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
  };

  const clearForm = () => {
    setQuoteNumber("QT-2026-001");
    setDate(new Date().toISOString().split("T")[0]);
    setValidUntil(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setClientName("");
    setClientAddress("");
    setClientEmail("");
    setReference("UAE-REF-001");
    setApplyVat(false);
    setSignatory("aftab");
    setSignatoryTitle("");
    setNotes("This quotation is valid for 30 days.");
    setIncludeStamp(false);
    setItems([]);
    setIsEditing(false);
    setSelectedId(null);
  };

  const loadQuoteForEdit = async (quote: Quotation) => {
    const { confirmWithCode } = await import("@/lib/security");
    if (!await confirmWithCode()) return;
    setQuoteNumber(quote.quoteNumber);
    setDate(quote.date);
    setValidUntil(quote.validUntil);
    setClientName(quote.clientName);
    setClientAddress(quote.clientAddress);
    setClientEmail(quote.clientEmail);
    setReference(quote.reference);
    setItems(quote.items);
    setApplyVat(quote.applyVat);
    setSignatory(quote.signatory);
    setSignatoryTitle(quote.signatoryTitle || "");
    setNotes(quote.notes);
    setIncludeStamp(quote.includeStamp || false);
    setSelectedId(quote.id);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const newQuote: Quotation = {
      id: Date.now().toString(),
      quoteNumber,
      date,
      validUntil,
      clientName,
      clientAddress,
      clientEmail,
      reference,
      items,
      applyVat,
      signatory,
      signatoryTitle,
      notes,
      includeStamp,
    };
    await saveItem(newQuote);
    clearForm();
  };

  const handleUpdate = async () => {
    if (!selectedId) {
      toast.error("No quotation selected to update");
      return;
    }
    const updatedQuote: Quotation = {
      id: selectedId,
      quoteNumber,
      date,
      validUntil,
      clientName,
      clientAddress,
      clientEmail,
      reference,
      items,
      applyVat,
      signatory,
      signatoryTitle,
      notes,
      includeStamp,
    };
    await updateItem(updatedQuote);
    clearForm();
  };

  const handleBulkDelete = async () => {
    await bulkDelete(selectedIds);
    clearSelection();
  };

  const handlePrint = () => {
    trackQuotationPrinted();
    window.print();
  };

  // ----- NEW: View and Download handlers -----
  const handleView = (quote: Quotation) => {
    sessionStorage.setItem("previewDoc", JSON.stringify({ type: "quotation", data: quote }));
    window.open("/quotation/preview", "_blank");
  };

  const handleDownload = async (quote: Quotation) => {
    await generatePDF(
      <QuotationPrintArea
        quoteNumber={quote.quoteNumber}
        date={quote.date}
        validUntil={quote.validUntil}
        clientName={quote.clientName}
        clientAddress={quote.clientAddress}
        clientEmail={quote.clientEmail}
        reference={quote.reference}
        items={quote.items}
        applyVat={quote.applyVat}
        signatory={quote.signatory}
        signatoryTitle={quote.signatoryTitle || ""}
        notes={quote.notes}
        includeStamp={quote.includeStamp || false}
      />,
      `Quotation-${quote.quoteNumber}.pdf`
    );
    trackQuotationPDFDownloaded();
  };

  // (Existing downloadPDF for the form – keep as is)
  const downloadPDF = async () => {
    trackQuotationPDFDownloaded();
    toast.success("PDF download started");
  };

  const importFromInvoice = (invoice: any) => {
    setClientName(invoice.clientName);
    setClientAddress(invoice.clientAddress);
    setClientEmail(invoice.clientEmail);
    setReference(invoice.reference);
    setApplyVat(invoice.applyVat);
    setSignatory(invoice.signatory);
    setSignatoryTitle("");
    setItems(invoice.services.map((s: any, idx: number) => ({
      id: Date.now().toString() + idx,
      description: `${s.serviceName} - ${s.serviceDescription}`,
      quantity: s.quantity,
      unit: s.unit,
      rate: s.rate,
    })));
    setNotes(`Based on invoice ${invoice.invoiceNumber}. ${invoice.paymentTerms}`);
    setShowInvoiceModal(false);
    toast.success("Invoice data imported. Review and save your quotation.");
    trackInvoiceImported();
  };

  // ----- Render -----
  return (
    <div className="bg-gray-100 min-h-screen p-4 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 print:hidden">
        <DocumentSidebar
          type="quotation"
          currentFolderPath={currentFolderPath}
          setCurrentFolderPath={setCurrentFolderPath}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredItems={filteredItems}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
          onEdit={loadQuoteForEdit}
          onDelete={deleteItem}
          onView={handleView}
          onDownload={handleDownload}
          selectAll={selectAll}
          isAllSelected={isAllSelected}
          onNew={clearForm}
          onExportBackup={() => exportBackup("quotation")}
          searchPlaceholder="Search by client name, quotation number, or date..."
          newButtonLabel="+ New Quotation"
        />

        <QuotationForm
          quoteNumber={quoteNumber}
          setQuoteNumber={setQuoteNumber}
          date={date}
          setDate={setDate}
          validUntil={validUntil}
          setValidUntil={setValidUntil}
          clientName={clientName}
          setClientName={setClientName}
          clientAddress={clientAddress}
          setClientAddress={setClientAddress}
          clientEmail={clientEmail}
          setClientEmail={setClientEmail}
          reference={reference}
          setReference={setReference}
          applyVat={applyVat}
          setApplyVat={setApplyVat}
          signatory={signatory}
          setSignatory={setSignatory}
          signatoryTitle={signatoryTitle}
          setSignatoryTitle={setSignatoryTitle}
          notes={notes}
          setNotes={setNotes}
          includeStamp={includeStamp}
          setIncludeStamp={setIncludeStamp}
          items={items}
          itemDesc={itemDesc}
          setItemDesc={setItemDesc}
          itemQty={itemQty}
          setItemQty={setItemQty}
          itemUnit={itemUnit}
          setItemUnit={setItemUnit}
          itemRate={itemRate}
          setItemRate={setItemRate}
          addItem={addItem}
          removeItem={removeItem}
          isEditing={isEditing}
          onSave={handleSave}
          onUpdate={handleUpdate}
          onPrint={handlePrint}
          onDownloadPDF={downloadPDF}
          onImportFromInvoice={() => setShowInvoiceModal(true)}
          showImportButton={true}
        />
      </div>

      <QuotationPrintArea
        quoteNumber={quoteNumber}
        date={date}
        validUntil={validUntil}
        clientName={clientName}
        clientAddress={clientAddress}
        clientEmail={clientEmail}
        reference={reference}
        items={items}
        applyVat={applyVat}
        signatory={signatory}
        signatoryTitle={signatoryTitle}
        notes={notes}
        includeStamp={includeStamp}
      />

      {/* Invoice Import Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 print:hidden">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">Select an Invoice to Import</h3>
            {savedInvoices.length === 0 && <p className="text-gray-500">No saved invoices found. Create an invoice first.</p>}
            <div className="space-y-2">
              {savedInvoices.map((inv) => (
                <div key={inv.id} className="border rounded p-3 flex justify-between items-center">
                  <div>
                    <div className="font-bold">{inv.invoiceNumber}</div>
                    <div className="text-sm">{inv.clientName}</div>
                    <div className="text-xs text-gray-500">{inv.invoiceDate}</div>
                  </div>
                  <button
                    onClick={() => importFromInvoice(inv)}
                    className="bg-purple-600 text-white px-3 py-1 rounded transition-transform hover:scale-105"
                  >
                    Import
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowInvoiceModal(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded transition-transform hover:scale-105"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <BulkActionBar
        selectedCount={selectedIds.size}
        onDelete={handleBulkDelete}
        onCancel={clearSelection}
      />
    </div>
  );
}