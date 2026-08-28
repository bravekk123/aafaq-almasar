"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import {
  FaHome, FaWhatsapp, FaMapMarkedAlt, FaFileInvoice, FaEnvelope,
  FaSignOutAlt, FaSignInAlt, FaPhoneAlt, FaTimes,
  FaInfoCircle, FaCog, FaLayerGroup, FaProjectDiagram, FaBriefcase, FaAddressCard
} from "react-icons/fa";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showContactPopup, setShowContactPopup] = useState(false);
  const [isNavbarVisible, setIsNavbarVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const auth = Cookies.get("aafaq-admin-auth");
    setIsLoggedIn(!!auth);
  }, []);

  // Auto-hide navbar on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setIsNavbarVisible(false); // hide when scrolling down past 80px
      } else if (currentScrollY < lastScrollY) {
        setIsNavbarVisible(true); // show when scrolling up
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLogout = () => {
    document.cookie = "aafaq-admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
  };

  const toggleLanguage = () => setLanguage(language === "EN" ? "AR" : "EN");
  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("pro");
    else if (theme === "pro") setTheme("system");
    else setTheme("light");
  };
  const getThemeIcon = () => {
    if (theme === "light") return "🌞";
    if (theme === "dark") return "🌙";
    if (theme === "pro") return "✨";
    return "🖥️";
  };

  const isDark = resolvedTheme === "dark";
  const isPro = resolvedTheme === "pro";
  let headerBg, textColor, borderColor;
  if (isPro) {
    headerBg = "#f8f6f2";
    textColor = "#1e2a1f";
    borderColor = "#d6cfc2";
  } else if (isDark) {
    headerBg = "#111827";
    textColor = "#ffffff";
    borderColor = "#374151";
  } else {
    headerBg = "#ffffff";
    textColor = "#1f2937";
    borderColor = "#d1d5db";
  }

  const mapsUrl = "https://www.google.com/maps/search/?api=1&query=Rigga+Business+Centre,+Al+Murqabat,+Dubai,+UAE";
  const contactOptions = [
    { type: "call", label: "+971 50 203 9786", href: "tel:+971502039786" },
    { type: "whatsapp", label: "WhatsApp (Aftab)", href: "https://wa.me/971502039786" },
    { type: "call", label: "+971 50 502 0088", href: "tel:+971505020088" },
    { type: "whatsapp", label: "WhatsApp (Imran)", href: "https://wa.me/971505020088" },
    { type: "email", label: "info@aafaqalmasar.ae", href: "mailto:info@aafaqalmasar.ae" },
  ];

  return (
    <header
      style={{ backgroundColor: headerBg, color: textColor }}
      className={`sticky top-0 z-50 shadow-md transition-transform duration-300 ${
        isNavbarVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <FaHome size={24} className="text-green-600" />
          <span className="font-bold text-lg hidden sm:inline">AAFAQ ALMASAR</span>
        </Link>
        <div className="flex items-center gap-3">
          <button onClick={toggleTheme} className="border px-2 py-1 rounded-xl text-sm font-bold" style={{ borderColor, color: textColor }}>
            {getThemeIcon()}
          </button>
          <button onClick={toggleLanguage} className="border px-2 py-1 rounded-xl text-sm font-bold" style={{ borderColor, color: textColor }}>
            {language === "EN" ? "EN | عربي" : "عربي | EN"}
          </button>
          <button className="lg:hidden text-3xl font-bold" onClick={() => setMobileMenu(!mobileMenu)}>☰</button>
        </div>
      </div>

      {/* Mobile second row */}
      <div className="lg:hidden border-t py-2 px-4 flex flex-wrap justify-around gap-2 text-sm" style={{ borderColor }}>
        <Link href="/sectors" className="flex flex-col items-center text-green-600"><FaFileInvoice size={20} /><span className="text-[10px]">Sectors</span></Link>
        <a href={mapsUrl} target="_blank" className="flex flex-col items-center text-blue-600"><FaMapMarkedAlt size={20} /><span className="text-[10px]">{t("common.maps")}</span></a>
        <div className="relative">
          <button onClick={() => setShowContactPopup(!showContactPopup)} className="flex flex-col items-center text-purple-600 contact-button">
            <FaPhoneAlt size={20} /><span className="text-[10px]">Contact</span>
          </button>
          {showContactPopup && (
            <div className="contact-popup absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-3 w-64 z-50 border" style={{ overflow: "visible", maxHeight: "none" }}>
              <div className="flex justify-between items-center mb-2"><span className="font-bold">Contact Options</span><button onClick={() => setShowContactPopup(false)}><FaTimes size={14} /></button></div>
              <div className="space-y-2">
                {contactOptions.map((opt, i) => (
                  <a key={i} href={opt.href} target={opt.type === "email" ? "_blank" : undefined} className="flex items-center gap-2 text-sm hover:bg-gray-100 p-1 rounded">
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
        {isLoggedIn ? (
          <>
          <Link
  href="/document-vault"
  className="flex flex-col items-center text-indigo-600"
>
  <FaBriefcase size={20} />
  <span className="text-[10px]">
    {t("common.documentVault")}
  </span>
</Link>
            <Link href="/invoice" className="flex flex-col items-center text-yellow-600"><FaFileInvoice size={20} /><span className="text-[10px]">{t("common.invoice")}</span></Link>
            <Link href="/letter" className="flex flex-col items-center text-purple-600"><FaEnvelope size={20} /><span className="text-[10px]">Letter</span></Link>
            <Link href="/quotation" className="flex flex-col items-center text-indigo-600"><FaFileInvoice size={20} /><span className="text-[10px]">Quotation</span></Link>
          </>
        ) : (
          <Link href="/admin-login" className="flex flex-col items-center text-blue-600"><FaSignInAlt size={20} /><span className="text-[10px]">{t("common.login")}</span></Link>
        )}
        {isLoggedIn && <button onClick={handleLogout} className="flex flex-col items-center text-red-600"><FaSignOutAlt size={20} /><span className="text-[10px]">{t("common.logout")}</span></button>}
      </div>

      {/* DESKTOP NAVIGATION – auto-hide on scroll, popup only on click */}
      <nav className="hidden lg:flex items-center justify-center gap-4 py-2 border-t" style={{ borderColor, color: textColor }}>
        <Link href="/" className="flex flex-col items-center gap-1 text-sm hover:opacity-80"><FaHome size={20} className="text-green-600" /><span>{t("common.home")}</span></Link>
        <Link href="/about" className="flex flex-col items-center gap-1 text-sm hover:opacity-80"><FaInfoCircle size={20} className="text-blue-500" /><span>{t("common.about")}</span></Link>
        <Link href="/services" className="flex flex-col items-center gap-1 text-sm hover:opacity-80"><FaCog size={20} className="text-orange-500" /><span>{t("common.services")}</span></Link>
        <Link href="/sectors" className="flex flex-col items-center gap-1 text-sm hover:opacity-80"><FaLayerGroup size={20} className="text-purple-600" /><span>{t("common.sectors")}</span></Link>
        <Link href="/projects" className="flex flex-col items-center gap-1 text-sm hover:opacity-80"><FaProjectDiagram size={20} className="text-teal-600" /><span>{t("common.projects")}</span></Link>
        <Link href="/careers" className="flex flex-col items-center gap-1 text-sm hover:opacity-80"><FaBriefcase size={20} className="text-pink-600" /><span>{t("common.careers")}</span></Link>
        <Link href="/contact" className="flex flex-col items-center gap-1 text-sm hover:opacity-80"><FaAddressCard size={20} className="text-red-500" /><span>{t("common.contact")}</span></Link>

        {/* Desktop contact popup – no internal scroll */}
        <div className="relative">
          <button onClick={() => setShowContactPopup(!showContactPopup)} className="bg-purple-600 text-white px-3 py-1 rounded-xl text-sm font-bold flex items-center gap-2 contact-button">
            <FaPhoneAlt size={16} /><span>Contact</span>
          </button>
          {showContactPopup && (
            <div className="absolute top-full right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-xl border z-50" style={{ width: "280px", overflow: "visible", maxHeight: "none", height: "auto" }}>
              <div className="flex justify-between items-center p-3 pb-0"><span className="font-bold text-sm">Contact Options</span><button onClick={() => setShowContactPopup(false)} className="text-gray-500"><FaTimes size={14} /></button></div>
              <div className="p-3 pt-2 space-y-2">
                {contactOptions.map((opt, i) => (
                  <a key={i} href={opt.href} target={opt.type === "email" ? "_blank" : undefined} className="flex items-center gap-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded">
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

        <a href={mapsUrl} target="_blank" className="flex flex-col items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded-xl"><FaMapMarkedAlt size={18} /><span>{t("common.maps")}</span></a>

        {!isLoggedIn && (
          <Link href="/admin-login" className="flex flex-col items-center gap-1 text-sm bg-blue-600 text-white px-3 py-1 rounded-xl"><FaSignInAlt size={18} /><span>{t("common.login")}</span></Link>
        )}
        {isLoggedIn && (
          <>
          <Link
  href="/document-vault"
  className="flex flex-col items-center gap-1 text-sm bg-indigo-700 text-white px-3 py-1 rounded-xl"
>
  <FaBriefcase size={18} />
  <span>{t("common.documentVault")}</span>
</Link>
            <Link href="/invoice" className="flex flex-col items-center gap-1 text-sm bg-yellow-400 text-black px-3 py-1 rounded-xl"><FaFileInvoice size={18} /><span>{t("common.invoice")}</span></Link>
            <Link href="/letter" className="flex flex-col items-center gap-1 text-sm bg-purple-600 text-white px-3 py-1 rounded-xl"><FaEnvelope size={18} /><span>Letter</span></Link>
            <Link href="/quotation" className="flex flex-col items-center gap-1 text-sm bg-indigo-600 text-white px-3 py-1 rounded-xl"><FaFileInvoice size={18} /><span>Quotation</span></Link>
            <button onClick={handleLogout} className="flex flex-col items-center gap-1 text-sm bg-red-600 text-white px-3 py-1 rounded-xl"><FaSignOutAlt size={18} /><span>{t("common.logout")}</span></button>
          </>
        )}
      </nav>

      {/* Mobile menu panel */}
      {mobileMenu && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={() => setMobileMenu(false)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-900 shadow-xl z-50 lg:hidden overflow-y-auto" style={{ backgroundColor: headerBg, color: textColor }}>
            <div className="flex justify-end p-4"><button onClick={() => setMobileMenu(false)} className="text-2xl font-bold">✕</button></div>
            <div className="px-4 pb-6">
              <div className="grid grid-cols-2 gap-3">
                <Link href="/" onClick={() => setMobileMenu(false)} className="py-2 text-center">{t("common.home")}</Link>
                <Link href="/about" onClick={() => setMobileMenu(false)} className="py-2 text-center">{t("common.about")}</Link>
                <Link href="/services" onClick={() => setMobileMenu(false)} className="py-2 text-center">{t("common.services")}</Link>
                <Link href="/sectors" onClick={() => setMobileMenu(false)} className="py-2 text-center">{t("common.sectors")}</Link>
                <Link href="/projects" onClick={() => setMobileMenu(false)} className="py-2 text-center">{t("common.projects")}</Link>
                <Link href="/careers" onClick={() => setMobileMenu(false)} className="py-2 text-center">{t("common.careers")}</Link>
                <Link href="/contact" onClick={() => setMobileMenu(false)} className="py-2 text-center">{t("common.contact")}</Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}