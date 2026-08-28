"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function CookieConsent() {
  const { language } = useLanguage();
  const isArabic = language === "AR";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consented = localStorage.getItem("cookie-consent");
    if (!consented) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookie-consent", "true");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white p-4 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <p className="text-sm">
          {isArabic
            ? "نستخدم ملفات تعريف الارتباط لتحسين تجربتك. باستخدام موقعنا، فإنك توافق على سياسة ملفات تعريف الارتباط الخاصة بنا."
            : "We use cookies to improve your experience. By using our site, you agree to our cookie policy."}
        </p>
        <div className="flex gap-3">
          <button
            onClick={accept}
            className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm font-semibold"
          >
            {isArabic ? "موافق" : "Accept"}
          </button>
          <a
            href="/privacy-policy"
            className="border border-white hover:bg-white hover:text-black px-4 py-2 rounded text-sm font-semibold transition"
          >
            {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
          </a>
        </div>
      </div>
    </div>
  );
}