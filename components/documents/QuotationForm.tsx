// components/documents/QuotationForm.tsx

"use client";

import { QuotationItem } from "@/types/documents";

interface QuotationFormProps {
  quoteNumber: string;
  setQuoteNumber: (val: string) => void;
  date: string;
  setDate: (val: string) => void;
  validUntil: string;
  setValidUntil: (val: string) => void;
  clientName: string;
  setClientName: (val: string) => void;
  clientAddress: string;
  setClientAddress: (val: string) => void;
  clientEmail: string;
  setClientEmail: (val: string) => void;
  reference: string;
  setReference: (val: string) => void;
  applyVat: boolean;
  setApplyVat: (val: boolean) => void;
  signatory: "aftab" | "imran" | "none";
  setSignatory: (val: "aftab" | "imran" | "none") => void;
  signatoryTitle: string;
  setSignatoryTitle: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
  includeStamp: boolean;
  setIncludeStamp: (val: boolean) => void;
  items: QuotationItem[];
  itemDesc: string;
  setItemDesc: (val: string) => void;
  itemQty: number;
  setItemQty: (val: number) => void;
  itemUnit: string;
  setItemUnit: (val: string) => void;
  itemRate: number;
  setItemRate: (val: number) => void;
  addItem: () => void;
  removeItem: (id: string) => void;
  isEditing: boolean;
  onSave: () => void;
  onUpdate: () => void;
  onPrint: () => void;
  onDownloadPDF: () => void;
  onImportFromInvoice: () => void;
  showImportButton?: boolean;
}

export default function QuotationForm({
  quoteNumber, setQuoteNumber,
  date, setDate,
  validUntil, setValidUntil,
  clientName, setClientName,
  clientAddress, setClientAddress,
  clientEmail, setClientEmail,
  reference, setReference,
  applyVat, setApplyVat,
  signatory, setSignatory,
  signatoryTitle, setSignatoryTitle,
  notes, setNotes,
  includeStamp, setIncludeStamp,
  items,
  itemDesc, setItemDesc,
  itemQty, setItemQty,
  itemUnit, setItemUnit,
  itemRate, setItemRate,
  addItem,
  removeItem,
  isEditing,
  onSave,
  onUpdate,
  onPrint,
  onDownloadPDF,
  onImportFromInvoice,
  showImportButton = false,
}: QuotationFormProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Quotation" : "Create Quotation"}</h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <input className="border p-2 rounded" placeholder="Quotation No" value={quoteNumber} onChange={(e) => setQuoteNumber(e.target.value)} />
        <input type="date" className="border p-2 rounded" value={date} onChange={(e) => setDate(e.target.value)} />
        <input type="date" className="border p-2 rounded" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Reference" value={reference} onChange={(e) => setReference(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Client Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
        <textarea className="border p-2 rounded col-span-2" placeholder="Client Address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
        <div className="col-span-2 flex items-center gap-3 mt-2">
          <input type="checkbox" checked={applyVat} onChange={(e) => setApplyVat(e.target.checked)} />
          <label className="text-sm font-medium">Apply UAE VAT (5%)</label>
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Signatory</label>
          <div className="flex gap-6">
            <label><input type="radio" value="aftab" checked={signatory === "aftab"} onChange={() => setSignatory("aftab")} className="mr-2" /> Muhammad Aftab</label>
            <label><input type="radio" value="imran" checked={signatory === "imran"} onChange={() => setSignatory("imran")} className="mr-2" /> Muhammad Imran</label>
            <label><input type="radio" value="none" checked={signatory === "none"} onChange={() => setSignatory("none")} className="mr-2" /> None / بدون</label>
          </div>
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Signatory Title (Optional)</label>
          <input type="text" className="border p-2 rounded w-full" value={signatoryTitle} onChange={(e) => setSignatoryTitle(e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Include Company Stamp</label>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={includeStamp} onChange={(e) => setIncludeStamp(e.target.checked)} className="w-5 h-5" />
            <span>Yes, show stamp above signature</span>
          </div>
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Notes / Terms</label>
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="border p-2 rounded w-full" />
        </div>
      </div>
      <hr className="my-4" />
      <h3 className="font-bold mb-2">Items</h3>
      <div className="grid grid-cols-5 gap-2 mb-2">
        <input className="border p-2 rounded col-span-2" placeholder="Description" value={itemDesc} onChange={(e) => setItemDesc(e.target.value)} />
        <input type="number" className="border p-2 rounded" placeholder="Qty" value={itemQty} onChange={(e) => setItemQty(Number(e.target.value))} />
        <input className="border p-2 rounded" placeholder="Unit" value={itemUnit} onChange={(e) => setItemUnit(e.target.value)} />
        <input type="number" className="border p-2 rounded" placeholder="Rate (AED)" value={itemRate} onChange={(e) => setItemRate(Number(e.target.value))} />
      </div>
      <button onClick={addItem} className="bg-green-600 text-white px-4 py-2 rounded mt-3 transition-transform hover:scale-105">Add Item</button>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Description</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Rate (AED)</th>
              <th className="border p-2">Amount (AED)</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className="border p-2">{item.description}</td>
                <td className="border p-2 text-center">{item.quantity}</td>
                <td className="border p-2 text-center">{item.unit}</td>
                <td className="border p-2 text-right">{item.rate.toLocaleString()}</td>
                <td className="border p-2 text-right">{(item.quantity * item.rate).toLocaleString()}</td>
                <td className="border p-2 text-center"><button onClick={() => removeItem(item.id)} className="text-red-600 font-bold">X</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-5 flex gap-3">
        {isEditing ? (
          <button onClick={onUpdate} className="bg-yellow-600 text-white px-4 py-2 rounded transition-transform hover:scale-105">Update Quotation</button>
        ) : (
          <button onClick={onSave} className="bg-blue-600 text-white px-4 py-2 rounded transition-transform hover:scale-105">Save Quotation</button>
        )}
        <button onClick={onPrint} className="bg-black text-white px-4 py-2 rounded transition-transform hover:scale-105">Print / PDF</button>
        <button onClick={onDownloadPDF} className="bg-red-600 text-white px-4 py-2 rounded transition-transform hover:scale-105">Download PDF</button>
        {showImportButton && (
          <button onClick={onImportFromInvoice} className="bg-purple-600 text-white px-4 py-2 rounded transition-transform hover:scale-105">📄 Import from Invoice</button>
        )}
      </div>
    </div>
  );
}