"use client";

import { useEffect, useState } from "react";
import LetterPrintArea from "@/components/documents/LetterPrintArea";
import { Letter } from "@/types/documents";
import { generatePDF } from "@/lib/pdfGenerator";

export default function LetterPreviewPage() {
  const [letter, setLetter] = useState<Letter | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("previewDoc");
    if (stored) {
      const { type, data } = JSON.parse(stored);
      if (type === "letter") {
        setLetter(data);
      }
    }
  }, []);

  if (!letter) {
    return <div className="p-8 text-center">Loading letter...</div>;
  }

  const handleDownload = async () => {
    await generatePDF(
      <LetterPrintArea
        date={letter.date}
        letterNumber={letter.letterNumber || ""}
        recipient={letter.recipient}
        title={letter.title}
        content={letter.content}
        signatory={letter.signatory}
        signatoryTitle={letter.signatoryTitle || ""}
        includeStamp={letter.includeStamp || false}
      />,
      `Letter-${letter.letterNumber || "untitled"}.pdf`
    );
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
      <LetterPrintArea
        date={letter.date}
        letterNumber={letter.letterNumber || ""}
        recipient={letter.recipient}
        title={letter.title}
        content={letter.content}
        signatory={letter.signatory}
        signatoryTitle={letter.signatoryTitle || ""}
        includeStamp={letter.includeStamp || false}
      />
    </div>
  );
}