// types/documents.ts

export type Service = {
  serviceName: string;
  serviceDescription: string;
  quantity: number;
  unit: string;
  rate: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  reference: string;
  clientName: string;
  clientEmail: string;
  clientAddress: string;
  paymentStatus: string;
  paymentTerms: string;
  applyVat: boolean;
  services: Service[];
  signatory: "aftab" | "imran" | "none";
  signatoryTitle: string;
  includeStamp: boolean;
};

export type Letter = {
  id: string;
  date: string;
  letterNumber?: string;   // ✅ added for Letter No. field
  recipient: string;
  title: string;
  content: string;
  signatory: "aftab" | "imran" | "none";
  signatoryTitle: string;
  includeStamp: boolean;
};

export type QuotationItem = {
  id: string;
  description: string;
  quantity: number;
  unit: string;
  rate: number;
};

export type Quotation = {
  id: string;
  quoteNumber: string;
  date: string;
  validUntil: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  reference: string;
  items: QuotationItem[];
  applyVat: boolean;
  signatory: "aftab" | "imran" | "none";
  signatoryTitle: string;
  notes: string;
  includeStamp: boolean;
};

export type DocumentType = "invoice" | "letter" | "quotation";