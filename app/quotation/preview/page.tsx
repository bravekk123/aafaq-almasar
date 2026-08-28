"use client";

import { useEffect, useState } from "react";
import QuotationPrintArea from "@/components/documents/QuotationPrintArea";
import { Quotation } from "@/types/documents";
import { generatePDF } from "@/lib/pdfGenerator";
import { trackQuotationPDFDownloaded } from "@/lib/analytics";

export default function QuotationPreviewPage() {
  const [quotation, setQuotation] = useState<Quotation | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("previewDoc");
    if (stored) {
      const { type, data } = JSON.parse(stored);
      if (type === "quotation") {
        setQuotation(data);
      }
    }
  }, []);

  if (!quotation) {
    return <div className="p-8 text-center">Loading quotation...</div>;
  }

  const handleDownload = async () => {
    await generatePDF(
      <QuotationPrintArea
        quoteNumber={quotation.quoteNumber}
        date={quotation.date}
        validUntil={quotation.validUntil}
        clientName={quotation.clientName}
        clientAddress={quotation.clientAddress}
        clientEmail={quotation.clientEmail}
        reference={quotation.reference}
        items={quotation.items}
        applyVat={quotation.applyVat}
        signatory={quotation.signatory}
        signatoryTitle={quotation.signatoryTitle || ""}
        notes={quotation.notes}
        includeStamp={quotation.includeStamp || false}
      />,
      `Quotation-${quotation.quoteNumber}.pdf`
    );
    trackQuotationPDFDownloaded();
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
      <QuotationPrintArea
        quoteNumber={quotation.quoteNumber}
        date={quotation.date}
        validUntil={quotation.validUntil}
        clientName={quotation.clientName}
        clientAddress={quotation.clientAddress}
        clientEmail={quotation.clientEmail}
        reference={quotation.reference}
        items={quotation.items}
        applyVat={quotation.applyVat}
        signatory={quotation.signatory}
        signatoryTitle={quotation.signatoryTitle || ""}
        notes={quotation.notes}
        includeStamp={quotation.includeStamp || false}
      />
    </div>
  );
}