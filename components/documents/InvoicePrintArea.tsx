// components/documents/InvoicePrintArea.tsx

"use client";

import { Service } from "@/types/documents";
import { calculateSubtotal, calculateVat, calculateTotal } from "@/lib/documentHelpers";

interface InvoicePrintAreaProps {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  reference: string;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  paymentStatus: string;
  paymentTerms: string;
  applyVat: boolean;
  services: Service[];
  signatory: "aftab" | "imran" | "none";
  signatoryTitle: string;
  includeStamp: boolean;
}

export default function InvoicePrintArea({
  invoiceNumber,
  invoiceDate,
  dueDate,
  reference,
  clientName,
  clientAddress,
  clientEmail,
  paymentStatus,
  paymentTerms,
  applyVat,
  services,
  signatory,
  signatoryTitle,
  includeStamp,
}: InvoicePrintAreaProps) {
  const subtotal = calculateSubtotal(services);
  const vat = calculateVat(subtotal, applyVat);
  const total = calculateTotal(subtotal, vat);

  return (
    <div id="print-area" className="bg-white max-w-[210mm] min-h-[297mm] mx-auto mt-8 p-8 shadow-lg print:p-5" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
      <div className="invoice-header flex justify-between items-start border-b pb-4">
        <div className="flex gap-3">
          <img src="/icon.png" alt="Logo" className="w-16 h-16 object-contain" />
          <div>
            <h1 className="font-bold text-xl">AAFAQ ALMASAR / آفاق المسار</h1>
            <p className="text-sm">PROJECT MANAGEMENT SERVICES L.L.C</p>
            <p className="text-sm">. لخدمات إدارة المشاريع ش.ذ.م.م</p>
            <p className="text-[11px] whitespace-nowrap">Office 3001-331, Rigga Business Centre, Al Murqabat, Dubai, UAE</p>
            <p className="text-xs">مكتب 3001-331, مركز ريجا للأعمال, المرقبات, دبي, الإمارات</p>
            <p className="text-xs">+971 50 203 9786 | +971 50 502 0088</p>
            <p className="text-xs"><a href="mailto:info@aafaqalmasar.ae" className="hover:underline">info@aafaqalmasar.ae</a></p>
            <p className="text-xs mt-1">Commercial License No: 1415606 / الرخصة التجارية</p>
            <p className="text-xs mt-1">TRN: 105131493600001 / الرقم الضريبي</p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-3xl font-bold">INVOICE / فاتورة</h2>
          <div className="text-sm mt-3 space-y-1">
            <p><strong>Invoice No:</strong> {invoiceNumber} / <span lang="ar">رقم الفاتورة</span></p>
            <p><strong>Invoice Date:</strong> {invoiceDate} / <span lang="ar">تاريخ الفاتورة</span></p>
            <p><strong>Due Date:</strong> {dueDate} / <span lang="ar">تاريخ الاستحقاق</span></p>
            <p><strong>Reference:</strong> {reference} / <span lang="ar">المرجع</span></p>
          </div>
        </div>
      </div>

      <div className="invoice-client mt-5 grid grid-cols-2 gap-5 text-sm">
        <div>
          <h3 className="font-bold mb-2">Bill To / فاتورة إلى</h3>
          <p>{clientName}</p>
          <p>{clientAddress}</p>
          <p>{clientEmail}</p>
        </div>
        <div className="text-right">
          <p><strong>Status:</strong> {paymentStatus} / <span lang="ar">الحالة</span></p>
          <p><strong>Payment Terms:</strong> {paymentTerms} / <span lang="ar">شروط الدفع</span></p>
          <p><strong>VAT:</strong> {applyVat ? "Applicable / مطبقة" : "Not Applicable / غير مطبقة"} / <span lang="ar">ضريبة القيمة المضافة</span></p>
        </div>
      </div>

      <div className="invoice-table mt-6 overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2"># / #</th>
              <th className="border p-2 text-left">Description / الوصف</th>
              <th className="border p-2">Qty / الكمية</th>
              <th className="border p-2">Unit / الوحدة</th>
              <th className="border p-2">Rate (AED) / السعر</th>
              <th className="border p-2">Amount (AED) / المبلغ</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end invoice-total-box">
        <div className="w-72 space-y-2 text-sm">
          <div className="flex justify-between border-b pb-1">
            <span>Subtotal / المجموع الفرعي</span>
            <span>AED {subtotal.toLocaleString()}</span>
          </div>
          {applyVat && (
            <div className="flex justify-between border-b pb-1">
              <span>VAT 5% / ضريبة القيمة المضافة ٥٪</span>
              <span>AED {vat.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between text-lg font-bold border rounded-lg p-3">
            <span>Total / الإجمالي</span>
            <span>AED {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="invoice-notes mt-8 text-xs text-gray-700 flex justify-between items-end">
        <div>
          <p>Thank you for choosing AAFAQ ALMASAR PROJECT MANAGEMENT SERVICES L.L.C.</p>
          <p>شكرًا لاختياركم الفاق المسار لخدمات إدارة المشاريع ش.ذ.م.م.</p>
          <p className="mt-2">Payment is due according to agreed contractual terms.</p>
          <p>يجب الدفع وفقًا للشروط التعاقدية المتفق عليها.</p>
        </div>
        <div className="text-right">
          {includeStamp && (
            <img src="/stamp.png" alt="Company Stamp" style={{ height: "38mm", width: "auto", marginBottom: "5mm" }} />
          )}
          {signatory !== "none" && (
            <>
              <div className="font-bold text-sm mb-1">Authorised Signatory / المُوقِّع المعتمد</div>
              <div>
                <img
                  src={signatory === "aftab" ? "/signature-aftab.png" : "/signature-imran.png"}
                  alt="Signature"
                  style={{ height: "22mm", width: "auto", marginTop: "2mm" }}
                />
                <div className="font-bold mt-1">{signatory === "aftab" ? "Muhammad Aftab" : "Muhammad Imran"}</div>
                {signatoryTitle && <div className="text-sm mt-0.5">{signatoryTitle}</div>}
              </div>
            </>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          #print-area,
          #print-area * {
            color: #000000 !important;
            background-color: #ffffff !important;
            border-color: #000000 !important;
          }
          #print-area {
            background: white !important;
            color: black !important;
          }
          #print-area img,
          #print-area svg {
            filter: none !important;
          }
        }
      `}</style>
    </div>
  );
}