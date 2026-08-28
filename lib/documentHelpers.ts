// lib/documentHelpers.ts

import { Invoice, Letter, Quotation, QuotationItem, Service, DocumentType } from "@/types/documents";

export function calculateSubtotal(services: Service[] | QuotationItem[]): number {
  return services.reduce((acc, item) => {
    const qty = "quantity" in item ? item.quantity : (item as any).quantity || 0;
    const rate = "rate" in item ? item.rate : (item as any).rate || 0;
    return acc + qty * rate;
  }, 0);
}

export function calculateVat(subtotal: number, applyVat: boolean): number {
  return applyVat ? subtotal * 0.05 : 0;
}

export function calculateTotal(subtotal: number, vat: number): number {
  return subtotal + vat;
}

export function getDisplayName(item: Invoice | Letter | Quotation): string {
  if ("invoiceNumber" in item) return item.invoiceNumber;
  if ("quoteNumber" in item) return item.quoteNumber;
  if ("title" in item) return item.title || "Untitled";
  return "Untitled";
}

export function getClientName(item: Invoice | Letter | Quotation): string {
  if ("clientName" in item) return item.clientName || "No client";
  if ("recipient" in item) return item.recipient || "No recipient";
  return "No client";
}

export function getDate(item: Invoice | Letter | Quotation): string {
  if ("invoiceDate" in item) return item.invoiceDate;
  if ("date" in item) return item.date;
  return "";
}

export function getSearchFields(type: DocumentType): string[] {
  switch (type) {
    case "invoice": return ["clientName", "invoiceNumber", "invoiceDate"];
    case "letter": return ["title", "recipient", "date"];
    case "quotation": return ["clientName", "quoteNumber", "date"];
    default: return [];
  }
}

export function exportBackup(type: DocumentType) {
  const key = `aafaq_${type}s`;
  const data = localStorage.getItem(key);
  const blob = new Blob([data || "[]"], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${type}s_backup.json`;
  a.click();
  URL.revokeObjectURL(url);
}