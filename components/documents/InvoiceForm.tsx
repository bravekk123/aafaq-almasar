// components/documents/InvoiceForm.tsx

"use client";

import { Service } from "@/types/documents";

interface InvoiceFormProps {
  invoiceNumber: string;
  setInvoiceNumber: (val: string) => void;
  invoiceDate: string;
  setInvoiceDate: (val: string) => void;
  dueDate: string;
  setDueDate: (val: string) => void;
  reference: string;
  setReference: (val: string) => void;
  clientName: string;
  setClientName: (val: string) => void;
  clientEmail: string;
  setClientEmail: (val: string) => void;
  clientAddress: string;
  setClientAddress: (val: string) => void;
  paymentStatus: string;
  setPaymentStatus: (val: string) => void;
  paymentTerms: string;
  setPaymentTerms: (val: string) => void;
  applyVat: boolean;
  setApplyVat: (val: boolean) => void;
  services: Service[];
  setServices: (val: Service[]) => void;
  signatory: "aftab" | "imran" | "none";
  setSignatory: (val: "aftab" | "imran" | "none") => void;
  signatoryTitle: string;
  setSignatoryTitle: (val: string) => void;
  includeStamp: boolean;
  setIncludeStamp: (val: boolean) => void;
  serviceName: string;
  setServiceName: (val: string) => void;
  serviceDescription: string;
  setServiceDescription: (val: string) => void;
  quantity: number;
  setQuantity: (val: number) => void;
  unit: string;
  setUnit: (val: string) => void;
  rate: number;
  setRate: (val: number) => void;
  addService: () => void;
  removeService: (index: number) => void;
  isEditing: boolean;
  onSave: () => void;
  onUpdate: () => void;
  onPrint: () => void;
  onDownloadPDF: () => void;
}

export default function InvoiceForm({
  invoiceNumber, setInvoiceNumber,
  invoiceDate, setInvoiceDate,
  dueDate, setDueDate,
  reference, setReference,
  clientName, setClientName,
  clientEmail, setClientEmail,
  clientAddress, setClientAddress,
  paymentStatus, setPaymentStatus,
  paymentTerms, setPaymentTerms,
  applyVat, setApplyVat,
  services,
  signatory, setSignatory,
  signatoryTitle, setSignatoryTitle,
  includeStamp, setIncludeStamp,
  serviceName, setServiceName,
  serviceDescription, setServiceDescription,
  quantity, setQuantity,
  unit, setUnit,
  rate, setRate,
  addService,
  removeService,
  isEditing,
  onSave,
  onUpdate,
  onPrint,
  onDownloadPDF,
}: InvoiceFormProps) {
  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Invoice" : "Create Invoice"}</h2>
      <div className="grid grid-cols-2 gap-3 mb-4">
        <input className="border p-2 rounded" placeholder="Invoice Number" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
        <input type="date" className="border p-2 rounded" value={invoiceDate} onChange={(e) => setInvoiceDate(e.target.value)} />
        <input type="date" className="border p-2 rounded" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Reference" value={reference} onChange={(e) => setReference(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Client Name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Client Email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
        <textarea className="border p-2 rounded col-span-2" placeholder="Client Address" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
        <select className="border p-2 rounded" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
          <option>Pending</option><option>Paid</option><option>Partial</option>
        </select>
        <input className="border p-2 rounded" placeholder="Payment Terms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
        <div className="col-span-2 flex items-center gap-3 mt-2">
          <input type="checkbox" checked={applyVat} onChange={(e) => setApplyVat(e.target.checked)} />
          <label className="text-sm font-medium">Apply UAE VAT (5%)</label>
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Authorized Signatory</label>
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
      </div>
      <hr className="my-4" />
      <div className="grid grid-cols-2 gap-3">
        <input className="border p-2 rounded" placeholder="Service Name" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
        <input className="border p-2 rounded" placeholder="Description" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} />
        <input type="number" className="border p-2 rounded" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <input className="border p-2 rounded" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
        <input type="number" className="border p-2 rounded col-span-2" placeholder="Rate (AED)" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
      </div>
      <button onClick={addService} className="bg-green-600 text-white px-4 py-2 rounded mt-3 transition-transform hover:scale-105">Add Service</button>

      <div className="mt-5 flex gap-3">
        {isEditing ? (
          <button onClick={onUpdate} className="bg-yellow-600 text-white px-4 py-2 rounded transition-transform hover:scale-105">Update Invoice</button>
        ) : (
          <button onClick={onSave} className="bg-blue-600 text-white px-4 py-2 rounded transition-transform hover:scale-105">Save Invoice</button>
        )}
        <button onClick={onPrint} className="bg-black text-white px-4 py-2 rounded transition-transform hover:scale-105">Print Invoice</button>
        <button onClick={onDownloadPDF} className="bg-red-600 text-white px-4 py-2 rounded transition-transform hover:scale-105">Download PDF</button>
      </div>

      {/* Service list for removal */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm border">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Service</th>
              <th className="border p-2">Qty</th>
              <th className="border p-2">Unit</th>
              <th className="border p-2">Rate</th>
              <th className="border p-2">Amount</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s, i) => (
              <tr key={i}>
                <td className="border p-2">{s.serviceName}</td>
                <td className="border p-2 text-center">{s.quantity}</td>
                <td className="border p-2 text-center">{s.unit}</td>
                <td className="border p-2 text-right">{s.rate.toLocaleString()}</td>
                <td className="border p-2 text-right">{(s.quantity * s.rate).toLocaleString()}</td>
                <td className="border p-2 text-center">
                  <button onClick={() => removeService(i)} className="text-red-600 font-bold">X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}