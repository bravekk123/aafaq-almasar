"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { FaWhatsapp, FaFacebook, FaGoogle, FaPhoneAlt, FaEnvelope, FaTimes } from "react-icons/fa";
import { useState, useEffect } from "react";

export default function Footer() {
  const { t } = useLanguage();
  const [showContactPopup, setShowContactPopup] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (showContactPopup && !target.closest(".contact-popup") && !target.closest(".contact-button")) {
        setShowContactPopup(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showContactPopup]);

  const contactOptions = [
    { type: "call", label: "+971 50 203 9786", href: "tel:+971502039786" },
    { type: "whatsapp", label: "WhatsApp (Aftab)", href: "https://wa.me/971502039786" },
    { type: "call", label: "+971 50 502 0088", href: "tel:+971505020088" },
    { type: "whatsapp", label: "WhatsApp (Imran)", href: "https://wa.me/971505020088" },
    { type: "email", label: "info@aafaqalmasar.ae", href: "mailto:info@aafaqalmasar.ae" },
  ];

  return (
    <footer className="bg-black dark:bg-gray-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1: Brand + Social Icons */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Image src="/logo.png" alt="AAFAQ Logo" width={50} height={50} className="rounded-2xl shadow-md" style={{ width: "auto", height: "auto" }} />
              <div>
                <h2 className="font-black text-lg">AAFAQ ALMASAR</h2>
                <p className="text-sm text-gray-400">{t("common.companyDesc")}</p>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div className="relative">
                <button
                  onClick={() => setShowContactPopup(!showContactPopup)}
                  className="text-purple-600 hover:text-purple-500 transition contact-button"
                  aria-label="Contact options"
                >
                  <FaPhoneAlt size={22} aria-hidden="true" />
                </button>
                {showContactPopup && (
                  <div className="contact-popup absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 w-56 z-50 border border-gray-200 dark:border-gray-700">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-sm">Contact Options</span>
                      <button onClick={() => setShowContactPopup(false)} className="text-gray-500" aria-label="Close">
                        <FaTimes size={14} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      {contactOptions.map((opt, idx) => (
                        <a
                          key={idx}
                          href={opt.href}
                          target={opt.type === "email" ? "_blank" : undefined}
                          rel={opt.type === "email" ? "noopener noreferrer" : undefined}
                          className="flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded"
                        >
                          {opt.type === "call" && <FaPhoneAlt size={12} className="text-green-600" />}
                          {opt.type === "whatsapp" && <FaWhatsapp size={12} className="text-green-600" />}
                          {opt.type === "email" && <FaEnvelope size={12} className="text-blue-500" />}
                          <span>{opt.label}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <a
                href="https://www.facebook.com/aafaqalmasar"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1877f2] hover:opacity-80 transition"
                aria-label="Facebook"
              >
                <FaFacebook size={22} aria-hidden="true" />
              </a>

              <a
                href="https://maps.google.com/?q=Rigga+Business+Centre+Dubai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#db4437] hover:opacity-80 transition"
                aria-label="Google Maps"
              >
                <FaGoogle size={22} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("common.quickLinks")}</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/" className="hover:text-white transition">{t("common.home")}</Link></li>
              <li><Link href="/about" className="hover:text-white transition">{t("common.about")}</Link></li>
              <li><Link href="/services" className="hover:text-white transition">{t("common.services")}</Link></li>
              <li><Link href="/sectors" className="hover:text-white transition">{t("common.sectors")}</Link></li>
              <li><Link href="/projects" className="hover:text-white transition">{t("common.projects")}</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">{t("common.careers")}</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">{t("common.contact")}</Link></li>
            </ul>
          </div>

          {/* Column 3: Services + Legal */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("common.servicesTitle")}</h3>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li><Link href="/services/project-planning" className="hover:text-white transition">{t("common.planning")}</Link></li>
              <li><Link href="/services/vendor-management" className="hover:text-white transition">{t("common.vendor")}</Link></li>
              <li><Link href="/services/business-coordination" className="hover:text-white transition">{t("common.coordination")}</Link></li>
              <li><Link href="/services/operational-support" className="hover:text-white transition">{t("common.operational")}</Link></li>
              <li><Link href="/services/administrative-services" className="hover:text-white transition">{t("common.admin")}</Link></li>
              <li><Link href="/services/consultancy-services" className="hover:text-white transition">{t("common.consultancy")}</Link></li>
            </ul>
            <div className="mt-6">
              <h3 className="font-bold text-lg mb-4">{t("common.legal")}</h3>
              <ul className="space-y-2 text-gray-300 text-sm">
                <li><Link href="/privacy-policy" className="hover:text-white transition">{t("privacy.title")}</Link></li>
                <li><Link href="/terms-and-conditions" className="hover:text-white transition">{t("terms.title")}</Link></li>
              </ul>
            </div>
          </div>

          {/* Column 4: Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">{t("common.contactInfo")}</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              <li><a href="tel:+971502039786" className="hover:text-white transition" aria-label="Call +971 50 203 9786">+971 50 203 9786</a></li>
              <li><a href="tel:+971505020088" className="hover:text-white transition" aria-label="Call +971 50 502 0088">+971 50 502 0088</a></li>
              <li><a href="mailto:info@aafaqalmasar.ae" className="hover:text-white transition" aria-label="Email info@aafaqalmasar.ae">info@aafaqalmasar.ae</a></li>


<p className="text-sm mt-2">
  {t("common.licenseLabel")}: 1415606
</p>

<p className="text-sm">
  {t("common.trnLabel")}: 105131493600001
</p>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center text-sm text-gray-400 py-5">
        © {new Date().getFullYear()} AAFAQ ALMASAR PROJECT MANAGEMENT SERVICES L.L.C. 
        <p>
  {t("common.footerRights")}
</p>
      </div>
    </footer>
  );
}