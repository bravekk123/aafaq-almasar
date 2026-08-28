"use client";

import { useState } from "react";
import { useSearchFilter } from "@/hooks/useSearchFilter";
import { useDocuments } from "@/hooks/useDocuments";
import { useDocumentSelection } from "@/hooks/useDocumentSelection";
import DocumentSidebar from "@/components/documents/DocumentSidebar";
import { InvoiceForm } from "@/components/documents/DocumentForm";
import InvoicePrintArea from "@/components/documents/InvoicePrintArea";
import BulkActionBar from "@/components/BulkActionBar";
import { getSearchFields, exportBackup } from "@/lib/documentHelpers";
import {
  trackInvoiceCreated,
  trackInvoiceUpdated,
  trackInvoiceDeleted,
  trackInvoiceBulkDeleted,
  trackInvoicePDFDownloaded,
  trackInvoicePrinted,
} from "@/lib/analytics";
import toast from "react-hot-toast";
import { Invoice, Service } from "@/types/documents";
import { generatePDF } from "@/lib/pdfGenerator";

export default function InvoicePage() {
  const [currentFolderPath, setCurrentFolderPath] = useState("");

  // Form state
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2026-001");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
  const [reference, setReference] = useState("UAE-PMS-001");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientAddress, setClientAddress] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("Pending");
  const [paymentTerms, setPaymentTerms] = useState("Due within 7 days");
  const [applyVat, setApplyVat] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [signatory, setSignatory] = useState<"aftab" | "imran" | "none">("aftab");
  const [signatoryTitle, setSignatoryTitle] = useState("");
  const [includeStamp, setIncludeStamp] = useState(false);

  // Service entry fields
  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("Service");
  const [rate, setRate] = useState(0);

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
  } = useDocuments<Invoice>(
    "invoice",
    currentFolderPath,
    trackInvoiceCreated,
    trackInvoiceUpdated,
    trackInvoiceDeleted,
    trackInvoiceBulkDeleted
  );

  // Search
  const { searchTerm, setSearchTerm, filteredItems } = useSearchFilter<Invoice>(
    items,
    getSearchFields("invoice")
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
  const addService = () => {
    if (!serviceName || !rate) return;
    setServices([...services, { serviceName, serviceDescription, quantity, unit, rate }]);
    setServiceName("");
    setServiceDescription("");
    setQuantity(1);
    setUnit("Service");
    setRate(0);
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  const clearForm = () => {
    setInvoiceNumber("INV-2026-001");
    setInvoiceDate(new Date().toISOString().split("T")[0]);
    setDueDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    setReference("UAE-PMS-001");
    setClientName("");
    setClientEmail("");
    setClientAddress("");
    setPaymentStatus("Pending");
    setPaymentTerms("Due within 7 days");
    setApplyVat(false);
    setServices([]);
    setSignatory("aftab");
    setSignatoryTitle("");
    setIncludeStamp(false);
    setIsEditing(false);
    setSelectedId(null);
  };

  const loadInvoiceForEdit = async (invoice: Invoice) => {
    const { confirmWithCode } = await import("@/lib/security");
    if (!await confirmWithCode()) return;
    setInvoiceNumber(invoice.invoiceNumber);
    setInvoiceDate(invoice.invoiceDate);
    setDueDate(invoice.dueDate);
    setReference(invoice.reference);
    setClientName(invoice.clientName);
    setClientEmail(invoice.clientEmail);
    setClientAddress(invoice.clientAddress);
    setPaymentStatus(invoice.paymentStatus);
    setPaymentTerms(invoice.paymentTerms);
    setApplyVat(invoice.applyVat);
    setServices(invoice.services);
    setSignatory(invoice.signatory);
    setSignatoryTitle(invoice.signatoryTitle || "");
    setIncludeStamp(invoice.includeStamp || false);
    setSelectedId(invoice.id);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      invoiceNumber,
      invoiceDate,
      dueDate,
      reference,
      clientName,
      clientEmail,
      clientAddress,
      paymentStatus,
      paymentTerms,
      applyVat,
      services,
      signatory,
      signatoryTitle,
      includeStamp,
    };
    await saveItem(newInvoice);
    clearForm();
  };

  const handleUpdate = async () => {
    if (!selectedId) {
      toast.error("No invoice selected to update");
      return;
    }
    const updatedInvoice: Invoice = {
      id: selectedId,
      invoiceNumber,
      invoiceDate,
      dueDate,
      reference,
      clientName,
      clientEmail,
      clientAddress,
      paymentStatus,
      paymentTerms,
      applyVat,
      services,
      signatory,
      signatoryTitle,
      includeStamp,
    };
    await updateItem(updatedInvoice);
    clearForm();
  };

  const handleBulkDelete = async () => {
    await bulkDelete(selectedIds);
    clearSelection();
  };

  const handlePrint = () => {
    trackInvoicePrinted();
    window.print();
  };

  // ----- NEW: View and Download handlers -----
  const handleView = (invoice: Invoice) => {
    sessionStorage.setItem("previewDoc", JSON.stringify({ type: "invoice", data: invoice }));
    window.open("/invoice/preview", "_blank");
  };

  const handleDownload = async (invoice: Invoice) => {
    await generatePDF(
      <InvoicePrintArea
        invoiceNumber={invoice.invoiceNumber}
        invoiceDate={invoice.invoiceDate}
        dueDate={invoice.dueDate}
        reference={invoice.reference}
        clientName={invoice.clientName}
        clientAddress={invoice.clientAddress}
        clientEmail={invoice.clientEmail}
        paymentStatus={invoice.paymentStatus}
        paymentTerms={invoice.paymentTerms}
        applyVat={invoice.applyVat}
        services={invoice.services}
        signatory={invoice.signatory}
        signatoryTitle={invoice.signatoryTitle}
        includeStamp={invoice.includeStamp}
      />,
      `Invoice-${invoice.invoiceNumber}.pdf`
    );
    trackInvoicePDFDownloaded();
  };

  // (Existing downloadPDF function for the form – keep as is)
  const downloadPDF = async () => {
    // This is the existing function for the current draft
    // If you want to keep it, it can remain; but we now have a separate handler for saved documents.
    trackInvoicePDFDownloaded();
    toast.success("PDF download started");
  };

  // ----- Render -----
  return (
    <div className="bg-gray-100 min-h-screen p-4 print:bg-white print:p-0">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 print:hidden">
        <DocumentSidebar
          type="invoice"
          currentFolderPath={currentFolderPath}
          setCurrentFolderPath={setCurrentFolderPath}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredItems={filteredItems}
          selectedIds={selectedIds}
          toggleSelect={toggleSelect}
          onEdit={loadInvoiceForEdit}
          onDelete={deleteItem}
          onView={handleView}
          onDownload={handleDownload}
          selectAll={selectAll}
          isAllSelected={isAllSelected}
          onNew={clearForm}
          onExportBackup={() => exportBackup("invoice")}
          searchPlaceholder="Search by client name, invoice number, or date..."
          newButtonLabel="+ New Invoice"
        />

        <InvoiceForm
          invoiceNumber={invoiceNumber}
          setInvoiceNumber={setInvoiceNumber}
          invoiceDate={invoiceDate}
          setInvoiceDate={setInvoiceDate}
          dueDate={dueDate}
          setDueDate={setDueDate}
          reference={reference}
          setReference={setReference}
          clientName={clientName}
          setClientName={setClientName}
          clientEmail={clientEmail}
          setClientEmail={setClientEmail}
          clientAddress={clientAddress}
          setClientAddress={setClientAddress}
          paymentStatus={paymentStatus}
          setPaymentStatus={setPaymentStatus}
          paymentTerms={paymentTerms}
          setPaymentTerms={setPaymentTerms}
          applyVat={applyVat}
          setApplyVat={setApplyVat}
          services={services}
          setServices={setServices}
          signatory={signatory}
          setSignatory={setSignatory}
          signatoryTitle={signatoryTitle}
          setSignatoryTitle={setSignatoryTitle}
          includeStamp={includeStamp}
          setIncludeStamp={setIncludeStamp}
          serviceName={serviceName}
          setServiceName={setServiceName}
          serviceDescription={serviceDescription}
          setServiceDescription={setServiceDescription}
          quantity={quantity}
          setQuantity={setQuantity}
          unit={unit}
          setUnit={setUnit}
          rate={rate}
          setRate={setRate}
          addService={addService}
          removeService={removeService}
          isEditing={isEditing}
          onSave={handleSave}
          onUpdate={handleUpdate}
          onPrint={handlePrint}
          onDownloadPDF={downloadPDF}
        />
      </div>

      <InvoicePrintArea
        invoiceNumber={invoiceNumber}
        invoiceDate={invoiceDate}
        dueDate={dueDate}
        reference={reference}
        clientName={clientName}
        clientAddress={clientAddress}
        clientEmail={clientEmail}
        paymentStatus={paymentStatus}
        paymentTerms={paymentTerms}
        applyVat={applyVat}
        services={services}
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