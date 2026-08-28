// components/documents/QuotationPrintArea.tsx

"use client";

import { QuotationItem } from "@/types/documents";
import { calculateSubtotal, calculateVat, calculateTotal } from "@/lib/documentHelpers";

interface QuotationPrintAreaProps {
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
}

export default function QuotationPrintArea({
  quoteNumber,
  date,
  validUntil,
  clientName,
  clientAddress,
  clientEmail,
  reference,
  items,
  applyVat,
  signatory,
  signatoryTitle,
  notes,
  includeStamp,
}: QuotationPrintAreaProps) {
  const subtotal = calculateSubtotal(items);
  const vat = calculateVat(subtotal, applyVat);
  const total = calculateTotal(subtotal, vat);

  return (
    <div id="print-area" className="bg-white max-w-[210mm] min-h-[297mm] mx-auto mt-8 p-8 shadow-lg print:p-5" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
      <div className="flex justify-between items-start border-b pb-4 mb-6">
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
          <h2 className="text-3xl font-bold">QUOTATION / عرض سعر</h2>
          <div className="text-sm mt-3 space-y-1">
            <p><strong>No:</strong> {quoteNumber} / <span lang="ar">رقم</span></p>
            <p><strong>Date:</strong> {date} / <span lang="ar">التاريخ</span></p>
            <p><strong>Valid Until:</strong> {validUntil} / <span lang="ar">صالح حتى</span></p>
            <p><strong>Reference:</strong> {reference} / <span lang="ar">المرجع</span></p>
          </div>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <h3 className="font-bold mb-2">Client / العميل</h3>
          <p>{clientName || "________________________"}</p>
          <p>{clientAddress}</p>
          <p>{clientEmail}</p>
        </div>
        <div className="text-right">
          <p><strong>VAT:</strong> {applyVat ? "Applicable / مطبقة" : "Not Applicable / غير مطبقة"} / <span lang="ar">ضريبة القيمة المضافة</span></p>
        </div>
      </div>

      <table className="w-full border-collapse mb-6 text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2 text-left"># / #</th>
            <th className="border p-2 text-left">Description / الوصف</th>
            <th className="border p-2 text-center">Qty / الكمية</th>
            <th className="border p-2 text-center">Unit / الوحدة</th>
            <th className="border p-2 text-right">Rate (AED) / السعر</th>
            <th className="border p-2 text-right">Amount (AED) / المبلغ</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr key={item.id}>
              <td className="border p-2 text-center">{idx + 1}</td>
              <td className="border p-2">{item.description}</td>
              <td className="border p-2 text-center">{item.quantity}</td>
              <td className="border p-2 text-center">{item.unit}</td>
              <td className="border p-2 text-right">{item.rate.toLocaleString()}</td>
              <td className="border p-2 text-right">{(item.quantity * item.rate).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mb-6">
        <div className="w-80 space-y-2 text-sm">
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
          <div className="flex justify-between text-lg font-bold pt-2">
            <span>Total / الإجمالي</span>
            <span>AED {total.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mb-8 text-sm">
        <p className="font-semibold">Notes / ملاحظات</p>
        <p>{notes}</p>
      </div>

      {signatory !== "none" && (
        <div className="mt-12">
          {includeStamp && (
            <img src="/stamp.png" alt="Company Stamp" style={{ height: "38mm", width: "auto", marginBottom: "5mm" }} />
          )}
          <div className="font-semibold mb-2">Authorised Signatory / المُوقِّع المعتمد</div>
          <div className="flex flex-col items-start gap-1">
            <img
              src={signatory === "aftab" ? "/signature-aftab.png" : "/signature-imran.png"}
              alt="Signature"
              style={{ height: "22mm", width: "auto", marginTop: "2mm" }}
            />
            <div className="font-semibold mt-1">{signatory === "aftab" ? "Muhammad Aftab" : "Muhammad Imran"}</div>
            {signatoryTitle && <div className="text-sm">{signatoryTitle}</div>}
          </div>
        </div>
      )}

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