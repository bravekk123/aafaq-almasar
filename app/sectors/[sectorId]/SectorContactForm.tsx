"use client";

import { useState } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function SectorContactForm({ sectorName }: { sectorName: string }) {
  const { language } = useLanguage();
  const isArabic = language === "AR";
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    // Use FormSubmit – you can change the email address below
    const response = await fetch("https://formsubmit.co/info@aafaqalmasar.ae", {
      method: "POST",
      body: formData,
    });
    if (response.ok) setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="bg-green-100 text-green-800 p-6 rounded-2xl text-center">
        {isArabic ? "شكراً لتواصلك! سنرد عليك قريباً." : "Thank you for reaching out! We'll get back to you soon."}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      <input type="hidden" name="_subject" value={`New inquiry from ${sectorName} page`} />
      <input type="hidden" name="_captcha" value="false" />
      <input type="hidden" name="_template" value="table" />
      <input type="hidden" name="_next" value={typeof window !== "undefined" ? window.location.href : ""} />
      <div>
        <label className="block font-semibold mb-2">{isArabic ? "الاسم الكامل" : "Full Name"}</label>
        <input type="text" name="name" required className="w-full border rounded-xl px-4 py-3" />
      </div>
      <div>
        <label className="block font-semibold mb-2">{isArabic ? "البريد الإلكتروني" : "Email"}</label>
        <input type="email" name="email" required className="w-full border rounded-xl px-4 py-3" />
      </div>
      <div>
        <label className="block font-semibold mb-2">{isArabic ? "رقم الهاتف" : "Phone Number"}</label>
        <input type="tel" name="phone" required className="w-full border rounded-xl px-4 py-3" />
      </div>
      <div>
        <label className="block font-semibold mb-2">{isArabic ? "رسالتك" : "Your Message"}</label>
        <textarea name="message" rows={4} required className="w-full border rounded-xl px-4 py-3"></textarea>
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-8 py-3 rounded-full font-bold hover:bg-green-700 transition"
      >
        {loading ? (isArabic ? "جاري الإرسال..." : "Sending...") : isArabic ? "إرسال الطلب" : "Send Inquiry"}
      </button>
    </form>
  );
}