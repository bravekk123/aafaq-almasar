// components/documents/LetterPrintArea.tsx

"use client";

interface LetterPrintAreaProps {
  date: string;
  letterNumber: string;
  recipient: string;
  title: string;
  content: string;
  signatory: "aftab" | "imran" | "none";
  signatoryTitle: string;
  includeStamp: boolean;
}

function decodeHtml(html: string): string {
  if (!html) return "";
  let decoded = html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#039;/g, "'")
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"')
    .replace(/&lsquo;/g, "'")
    .replace(/&rsquo;/g, "'");

  decoded = decoded
    .replace(/< \/p>/g, "</p>")
    .replace(/< p>/g, "<p>")
    .replace(/< \/strong>/g, "</strong>")
    .replace(/< strong>/g, "<strong>")
    .replace(/< \/li>/g, "</li>")
    .replace(/< li>/g, "<li>")
    .replace(/< \/ul>/g, "</ul>")
    .replace(/< ul>/g, "<ul>")
    .replace(/<Ii>/g, "<li>")
    .replace(/<\/Ii>/g, "</li>")
    .replace(/< \/h1>/g, "</h1>")
    .replace(/< h1>/g, "<h1>")
    .replace(/< \/h2>/g, "</h2>")
    .replace(/< h2>/g, "<h2>")
    .replace(/< \/h3>/g, "</h3>")
    .replace(/< h3>/g, "<h3>");

  decoded = decoded.replace(/<\s+(\w+)/g, "<$1");
  decoded = decoded.replace(/<\/(\w+)\s+>/g, "</$1>");
  return decoded;
}

export default function LetterPrintArea({
  date,
  letterNumber,
  recipient,
  title,
  content,
  signatory,
  signatoryTitle,
  includeStamp,
}: LetterPrintAreaProps) {
  const decodedContent = decodeHtml(content || "Type your letter content here...");

  return (
    <div
      id="print-area"
      className="bg-white w-[210mm] h-[297mm] mx-auto mt-8 shadow-lg print:shadow-none print:mt-0 print:mx-0"
      style={{
        color: "#000000",
        backgroundColor: "#ffffff",
        position: "relative",
        overflow: "hidden",
        pageBreakAfter: "avoid",
        pageBreakInside: "avoid",
      }}
    >
      {/* Full page background */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url('/letterhead.png')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          zIndex: 0,
          opacity: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          padding: "45mm 15mm 42mm 15mm",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {/* Date – bold */}
          <p style={{ textAlign: "right", fontSize: "11pt", marginBottom: "2mm", flexShrink: 0 }}>
            <strong>Date:</strong> {date}
          </p>

          {/* Letter Number – bold */}
          <p style={{ textAlign: "right", fontSize: "11pt", marginBottom: "4mm", flexShrink: 0 }}>
            <strong>Letter No.:</strong> {letterNumber || "N/A"}
          </p>

          {/* ✅ Recipient – "To:" bold + recipient text bold */}
          <div style={{ marginBottom: "3mm", flexShrink: 0 }}>
            <p style={{ fontWeight: "bold", fontSize: "11pt" }}>To,</p>
            <div style={{ whiteSpace: "pre-wrap", fontSize: "11pt", lineHeight: 1.4, fontWeight: "bold" }}>
              {recipient || "________________________"}
            </div>
          </div>

          {/* Subject – already bold */}
          <p style={{ fontWeight: "bold", fontSize: "11pt", marginBottom: "3mm", flexShrink: 0 }}>
            Subject: {title || "________________________"}
          </p>

          {/* Body */}
          <div
            style={{
              fontSize: "11pt",
              lineHeight: 1.6,
              flex: 1,
              overflow: "hidden",
              maxHeight: "130mm",
            }}
            className="letter-body"
            dangerouslySetInnerHTML={{ __html: decodedContent }}
          />
        </div>

        {/* Signature & Stamp */}
        <div
          style={{
            marginTop: "4mm",
            display: "flex",
            alignItems: "flex-end",
            gap: "4mm",
            flexShrink: 0,
            height: "40mm",
            paddingBottom: "5mm",
          }}
        >
          {signatory !== "none" && (
            <div style={{ flexShrink: 0 }}>
              <p style={{ fontWeight: "bold", marginBottom: "1mm", fontSize: "10pt" }}>
                Authorised Signatory / المُوقِّع المعتمد
              </p>
              <img
                src={signatory === "aftab" ? "/signature-aftab.png" : "/signature-imran.png"}
                alt="Signature"
                style={{ height: "16mm", width: "auto", display: "block" }}
              />
              <p style={{ fontWeight: "bold", marginTop: "1mm", fontSize: "10pt" }}>
                {signatory === "aftab" ? "Muhammad Aftab" : "Muhammad Imran"}
              </p>
              {signatoryTitle && <p style={{ marginTop: "0.5mm", fontSize: "9pt" }}>{signatoryTitle}</p>}
            </div>
          )}
          {includeStamp && (
            <div style={{ flexShrink: 0, marginLeft: "2mm" }}>
              <img src="/stamp.png" alt="Company Stamp" style={{ height: "28mm", width: "auto", display: "block" }} />
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        @media print {
          #print-area {
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
            width: 100% !important;
            height: 100vh !important;
            page-break-after: avoid !important;
            page-break-inside: avoid !important;
          }
          #print-area * {
            color: black !important;
            background-color: transparent !important;
          }
          #print-area img {
            filter: none !important;
          }
          #print-area div:first-child {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body {
            margin: 0 !important;
            padding: 0 !important;
          }
          .letter-body strong { font-weight: bold !important; }
          .letter-body em { font-style: italic !important; }
          .letter-body u { text-decoration: underline !important; }
          .letter-body ul { list-style-type: disc !important; padding-left: 20px !important; margin: 8px 0 !important; }
          .letter-body ol { list-style-type: decimal !important; padding-left: 20px !important; margin: 8px 0 !important; }
          .letter-body li { margin-bottom: 4px !important; }
          .letter-body p { margin: 6px 0 !important; }
          .letter-body h1 { font-size: 18pt !important; font-weight: bold !important; margin: 10px 0 !important; }
          .letter-body h2 { font-size: 16pt !important; font-weight: bold !important; margin: 8px 0 !important; }
          .letter-body h3 { font-size: 14pt !important; font-weight: bold !important; margin: 6px 0 !important; }
        }
      `}</style>
    </div>
  );
}