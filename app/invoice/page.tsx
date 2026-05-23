"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

type Service = {
  serviceName: string;
  serviceDescription: string;
  quantity: number;
  unit: string;
  rate: number;
};

type Invoice = {
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
};

export default function InvoicePage() {
  const { t, language } = useLanguage();

  // All state variables (same as before)
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

  const [serviceName, setServiceName] = useState("");
  const [serviceDescription, setServiceDescription] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [unit, setUnit] = useState("Service");
  const [rate, setRate] = useState(0);

  const [savedInvoices, setSavedInvoices] = useState<Invoice[]>([]);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Load and persist invoices (unchanged)
  useEffect(() => {
    const stored = localStorage.getItem("aafaq_invoices");
    if (stored) {
      try {
        setSavedInvoices(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const persistInvoices = (invoices: Invoice[]) => {
    localStorage.setItem("aafaq_invoices", JSON.stringify(invoices));
    setSavedInvoices(invoices);
  };

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
    setSelectedInvoiceId(null);
    setIsEditing(false);
  };

  const saveNewInvoice = () => {
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
    };
    persistInvoices([...savedInvoices, newInvoice]);
    clearForm();
    alert("Invoice saved!");
  };

  const updateInvoice = () => {
    if (!selectedInvoiceId) return;
    const updated = savedInvoices.map((inv) =>
      inv.id === selectedInvoiceId
        ? {
            ...inv,
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
          }
        : inv
    );
    persistInvoices(updated);
    clearForm();
    alert("Invoice updated!");
  };

  const deleteInvoice = (id: string) => {
    if (confirm("Delete this invoice?")) {
      const filtered = savedInvoices.filter((inv) => inv.id !== id);
      persistInvoices(filtered);
      if (selectedInvoiceId === id) clearForm();
    }
  };

  const loadInvoiceForEdit = (invoice: Invoice) => {
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
    setSelectedInvoiceId(invoice.id);
    setIsEditing(true);
  };

  const exportBackup = () => {
    const data = localStorage.getItem("aafaq_invoices");
    const blob = new Blob([data || "[]"], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "invoices_backup.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPDF = async () => {
    const element = document.getElementById("print-area");
    if (!element) {
      alert("Invoice preview area not found.");
      return;
    }

    const originalError = console.error;
    console.error = (...args) => {
      const msg = args[0]?.toString() || "";
      if (msg.includes("unsupported color function")) return;
      originalError(...args);
    };

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      const opt = {
        margin: [0.5, 0.5, 0.5, 0.5] as [number, number, number, number],
        filename: `${invoiceNumber}.pdf`,
        image: { type: "jpeg" as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true, logging: false },
        jsPDF: { unit: "in" as const, format: "a4" as const, orientation: "portrait" as const },
      };
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.warn("Direct PDF generation failed, falling back to print dialog.", err);
      window.print();
      alert("Direct PDF download encountered an issue.\nPlease use 'Save as PDF' from the print dialog.");
    } finally {
      console.error = originalError;
    }
  };

  const subtotal = services.reduce((acc, item) => acc + item.quantity * item.rate, 0);
  const vat = applyVat ? subtotal * 0.05 : 0;
  const total = subtotal + vat;

  // Helper to format bilingual label (English / Arabic)
  const bil = (enKey: string, arKey?: string) => {
    const enText = t(enKey);
    const arText = arKey ? t(arKey) : (language === "AR" ? t(enKey) : "");
    if (language === "AR" && arText && arText !== enKey) {
      return `${arText} / ${enText}`;
    }
    return enText;
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 print:bg-white print:p-0">
      {/* Form area (unchanged) */}
      <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-6 print:hidden">
        <div className="bg-white rounded-xl shadow p-5 h-fit">
          <h2 className="text-2xl font-bold mb-4">Saved Invoices</h2>
          <button onClick={clearForm} className="bg-green-600 text-white px-4 py-2 rounded-lg w-full mb-4">
            + New Invoice
          </button>
          {savedInvoices.length === 0 && <p className="text-gray-500">No invoices saved yet.</p>}
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {savedInvoices.map((inv) => (
              <div key={inv.id} className="border rounded-lg p-3 flex justify-between items-center">
                <div>
                  <div className="font-bold">{inv.invoiceNumber}</div>
                  <div className="text-sm text-gray-600">{inv.clientName || "No client"}</div>
                </div>
                <div className="space-x-2">
                  <button onClick={() => loadInvoiceForEdit(inv)} className="text-blue-600 text-sm">
                    Edit
                  </button>
                  <button onClick={() => deleteInvoice(inv.id)} className="text-red-600 text-sm">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button onClick={exportBackup} className="mt-4 bg-gray-600 text-white px-4 py-2 rounded-lg w-full">
            Export Backup
          </button>
        </div>

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
          </div>
          <hr className="my-4" />
          <div className="grid grid-cols-2 gap-3">
            <input className="border p-2 rounded" placeholder="Service Name" value={serviceName} onChange={(e) => setServiceName(e.target.value)} />
            <input className="border p-2 rounded" placeholder="Description" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} />
            <input type="number" className="border p-2 rounded" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            <input className="border p-2 rounded" placeholder="Unit" value={unit} onChange={(e) => setUnit(e.target.value)} />
            <input type="number" className="border p-2 rounded col-span-2" placeholder="Rate (AED)" value={rate} onChange={(e) => setRate(Number(e.target.value))} />
          </div>
          <button onClick={addService} className="bg-green-600 text-white px-4 py-2 rounded mt-3">Add Service</button>

          <div className="mt-5 flex gap-3">
            {isEditing ? (
              <button onClick={updateInvoice} className="bg-yellow-600 text-white px-4 py-2 rounded">Update Invoice</button>
            ) : (
              <button onClick={saveNewInvoice} className="bg-blue-600 text-white px-4 py-2 rounded">Save Invoice</button>
            )}
            <button onClick={() => window.print()} className="bg-black text-white px-4 py-2 rounded">Print Invoice</button>
            <button onClick={downloadPDF} className="bg-red-600 text-white px-4 py-2 rounded">Download PDF</button>
          </div>
        </div>
      </div>

      {/* PRINTABLE INVOICE AREA – BILINGUAL (EN/AR) */}
      <div id="print-area" className="bg-white max-w-[210mm] min-h-[297mm] mx-auto mt-8 p-8 text-black print:p-5 shadow-lg">
        {/* HEADER */}
        <div className="invoice-header flex justify-between items-start border-b pb-4">
          <div className="flex gap-3">
            <img src="/icon.png" alt="Logo" className="w-16 h-16 object-contain" />
            <div>
              <h1 className="font-bold text-xl">AAFAQ ALMASAR</h1>
              <p className="text-sm">PROJECT MANAGEMENT SERVICES L.L.C</p>
              <p className="text-xs mt-2">Office 3001-331, Rigga Business Centre, Al Murqabat, Dubai, UAE</p>
              <p className="text-xs">+971 50 203 9786 | +971 50 502 0088</p>
              <p className="text-xs">dewalattock@gmail.com</p>
              <p className="text-xs font-semibold mt-1">TRN: 105131493600001</p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-3xl font-bold">{bil("invoice.title")}</h2>
            <div className="text-sm mt-3 space-y-1">
              <p><strong>{bil("invoice.number")}:</strong> {invoiceNumber}</p>
              <p><strong>{bil("invoice.date")}:</strong> {invoiceDate}</p>
              <p><strong>{bil("invoice.due")}:</strong> {dueDate}</p>
              <p><strong>{bil("invoice.ref")}:</strong> {reference}</p>
            </div>
          </div>
        </div>

        {/* CLIENT & STATUS */}
        <div className="invoice-client mt-5 grid grid-cols-2 gap-5 text-sm">
          <div>
            <h3 className="font-bold mb-2">{bil("invoice.billTo")}</h3>
            <p>{clientName}</p>
            <p>{clientAddress}</p>
            <p>{clientEmail}</p>
          </div>
          <div className="text-right">
            <p><strong>{bil("invoice.status")}:</strong> {paymentStatus}</p>
            <p><strong>{bil("invoice.terms")}:</strong> {paymentTerms}</p>
            <p>
              <strong>{bil("invoice.vatLabel")}:</strong>{" "}
              {applyVat ? bil("invoice.applicable") : bil("invoice.notApplicable")}
            </p>
          </div>
        </div>

        {/* TABLE */}
        <div className="invoice-table mt-6 overflow-hidden">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">{bil("invoice.tableHeader.hash")}</th>
                <th className="border p-2 text-left">{bil("invoice.tableHeader.description")}</th>
                <th className="border p-2">{bil("invoice.tableHeader.qty")}</th>
                <th className="border p-2">{bil("invoice.tableHeader.unit")}</th>
                <th className="border p-2">{bil("invoice.tableHeader.rate")}</th>
                <th className="border p-2">{bil("invoice.tableHeader.amount")}</th>
                <th className="border p-2 print:hidden">Action</th>
              </tr>
            </thead>
            <tbody>
              {services.map((item, index) => (
                <tr key={index}>
                  <td className="border p-2 text-center">{index + 1}</td>
                  <td className="border p-2">
                    <div className="font-semibold">{item.serviceName}</div>
                    <div className="text-xs text-gray-600">{item.serviceDescription}</div>
                  </td>
                  <td className="border p-2 text-center">{item.quantity}</td>
                  <td className="border p-2 text-center">{item.unit}</td>
                  <td className="border p-2 text-right">AED {item.rate.toLocaleString()}</td>
                  <td className="border p-2 text-right font-semibold">AED {(item.quantity * item.rate).toLocaleString()}</td>
                  <td className="border p-2 text-center print:hidden">
                    <button onClick={() => removeService(index)} className="text-red-600 font-bold">X</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* TOTALS */}
        <div className="mt-6 flex justify-end invoice-total-box">
          <div className="w-72 space-y-2 text-sm">
            <div className="flex justify-between border-b pb-1">
              <span>{bil("invoice.subtotal")}</span>
              <span>AED {subtotal.toLocaleString()}</span>
            </div>
            {applyVat && (
              <div className="flex justify-between border-b pb-1">
                <span>{bil("invoice.vatLabel")} 5%</span>
                <span>AED {vat.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold border rounded-lg p-3">
              <span>{bil("invoice.total")}</span>
              <span>AED {total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* NOTES */}
        <div className="invoice-notes mt-8 text-xs text-gray-700">
          <p>{bil("invoice.notes")}</p>
          <p className="mt-2">{bil("invoice.paymentNote")}</p>
        </div>
      </div>
    </div>
  );
}