"use client";

import { useEffect, useState } from "react";
import InvoicePrintArea from "@/components/documents/InvoicePrintArea";
import { Invoice } from "@/types/documents";
import { generatePDF } from "@/lib/pdfGenerator";
import { trackInvoicePDFDownloaded } from "@/lib/analytics";

export default function InvoicePreviewPage() {
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("previewDoc");
    if (stored) {
      const { type, data } = JSON.parse(stored);
      if (type === "invoice") {
        setInvoice(data);
      }
    }
  }, []);

  if (!invoice) {
    return <div className="p-8 text-center">Loading invoice...</div>;
  }

  const handleDownload = async () => {
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

  return (
    <div className="min-h-screen bg-gray-100 p-4 print:p-0">
      <div className="max-w-4xl mx-auto mb-4 flex justify-end print:hidden">
        <button
          onClick={handleDownload}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
        >
          Download PDF
        </button>
      </div>
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
      />
    </div>
  );
}