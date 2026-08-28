// components/documents/LetterForm.tsx

"use client";

import RichTextEditor from "@/components/RichTextEditor";

interface LetterFormProps {
  date: string;
  setDate: (val: string) => void;
  letterNumber: string;          // ✅ added
  setLetterNumber: (val: string) => void; // ✅ added
  recipient: string;
  setRecipient: (val: string) => void;
  title: string;
  setTitle: (val: string) => void;
  content: string;
  setContent: (val: string) => void;
  signatory: "aftab" | "imran" | "none";
  setSignatory: (val: "aftab" | "imran" | "none") => void;
  signatoryTitle: string;
  setSignatoryTitle: (val: string) => void;
  includeStamp: boolean;
  setIncludeStamp: (val: boolean) => void;
  isEditing: boolean;
  onSave: () => void;
  onUpdate: () => void;
  onPrint: () => void;
  maxChars: number;
}

export default function LetterForm({
  date, setDate,
  letterNumber, setLetterNumber, // ✅ destructure new props
  recipient, setRecipient,
  title, setTitle,
  content, setContent,
  signatory, setSignatory,
  signatoryTitle, setSignatoryTitle,
  includeStamp, setIncludeStamp,
  isEditing,
  onSave,
  onUpdate,
  onPrint,
  maxChars,
}: LetterFormProps) {
  const plainTextLength = content.replace(/<[^>]*>/g, "").length;

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow p-5">
      <h2 className="text-2xl font-bold mb-4">{isEditing ? "Edit Letter" : "Create Letter"}</h2>
      <div className="space-y-4">
        {/* Date */}
        <div>
          <label className="block font-bold mb-1">Date</label>
          <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-2 rounded w-full" />
        </div>

        {/* Letter Number – NEW */}
        <div>
          <label className="block font-bold mb-1">Letter No.</label>
          <input
            type="text"
            value={letterNumber}
            onChange={e => setLetterNumber(e.target.value)}
            placeholder="e.g., LTR-2026-001"
            className="border p-2 rounded w-full"
          />
        </div>

        {/* Recipient */}
        <div>
          <label className="block font-bold mb-1">To (Recipient Name & Address)</label>
          <textarea rows={2} value={recipient} onChange={e => setRecipient(e.target.value)} placeholder="e.g., Mr. Ahmed\nDubai, UAE" className="border p-2 rounded w-full" />
        </div>

        {/* Title */}
        <div>
          <label className="block font-bold mb-1">Subject / Title</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="NOC / Experience Certificate / Quotation etc." className="border p-2 rounded w-full" />
        </div>

        {/* Body */}
        <div>
          <label className="block font-bold mb-1">Body</label>
          <RichTextEditor
            value={content}
            onChange={setContent}
            placeholder="Write your letter content here..."
            height="300px"
          />
          <div className="text-right text-xs text-gray-500 mt-1">
            {plainTextLength}/{maxChars} characters
            {plainTextLength >= maxChars && <span className="text-red-600 ml-2">Max limit reached</span>}
          </div>
        </div>

        {/* Signatory */}
        <div>
          <label className="block font-bold mb-1">Signatory</label>
          <div className="flex gap-6">
            <label><input type="radio" value="aftab" checked={signatory === "aftab"} onChange={() => setSignatory("aftab")} className="mr-2" /> Muhammad Aftab</label>
            <label><input type="radio" value="imran" checked={signatory === "imran"} onChange={() => setSignatory("imran")} className="mr-2" /> Muhammad Imran</label>
            <label><input type="radio" value="none" checked={signatory === "none"} onChange={() => setSignatory("none")} className="mr-2" /> None / بدون</label>
          </div>
        </div>

        {/* Signatory Title */}
        <div>
          <label className="block font-bold mb-1">Signatory Title (Optional)</label>
          <input type="text" value={signatoryTitle} onChange={e => setSignatoryTitle(e.target.value)} placeholder="e.g., General Manager" className="border p-2 rounded w-full" />
        </div>

        {/* Stamp */}
        <div>
          <label className="block font-bold mb-1">Include Company Stamp</label>
          <div className="flex items-center gap-2">
            <input type="checkbox" checked={includeStamp} onChange={(e) => setIncludeStamp(e.target.checked)} className="w-5 h-5" />
            <span>Yes, show stamp on the right side of signature</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-3 mt-4">
          {isEditing ? (
            <button onClick={onUpdate} className="bg-yellow-600 text-white px-4 py-2 rounded transition-transform hover:scale-105">Update Letter</button>
          ) : (
            <button onClick={onSave} className="bg-blue-600 text-white px-4 py-2 rounded transition-transform hover:scale-105">Save Letter</button>
          )}
          <button onClick={onPrint} className="bg-black text-white px-4 py-2 rounded transition-transform hover:scale-105">Print / PDF</button>
        </div>
      </div>
    </div>
  );
}