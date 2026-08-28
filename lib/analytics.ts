// Google Analytics event tracking
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}

export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number
) => {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Invoices
export const trackInvoiceCreated = () => trackEvent("Invoice", "created");
export const trackInvoiceUpdated = () => trackEvent("Invoice", "updated");
export const trackInvoiceDeleted = () => trackEvent("Invoice", "deleted");
export const trackInvoiceBulkDeleted = (count: number) =>
  trackEvent("Invoice", "bulk_deleted", undefined, count);
export const trackInvoicePDFDownloaded = () => trackEvent("Invoice", "pdf_downloaded");
export const trackInvoicePrinted = () => trackEvent("Invoice", "printed");

// Quotations
export const trackQuotationCreated = () => trackEvent("Quotation", "created");
export const trackQuotationUpdated = () => trackEvent("Quotation", "updated");
export const trackQuotationDeleted = () => trackEvent("Quotation", "deleted");
export const trackQuotationBulkDeleted = (count: number) =>
  trackEvent("Quotation", "bulk_deleted", undefined, count);
export const trackQuotationPDFDownloaded = () => trackEvent("Quotation", "pdf_downloaded");
export const trackQuotationPrinted = () => trackEvent("Quotation", "printed");
export const trackInvoiceImported = () => trackEvent("Quotation", "imported_from_invoice");

// Letters
export const trackLetterCreated = () => trackEvent("Letter", "created");
export const trackLetterUpdated = () => trackEvent("Letter", "updated");
export const trackLetterDeleted = () => trackEvent("Letter", "deleted");
export const trackLetterBulkDeleted = (count: number) =>
  trackEvent("Letter", "bulk_deleted", undefined, count);
export const trackLetterPrinted = () => trackEvent("Letter", "printed");