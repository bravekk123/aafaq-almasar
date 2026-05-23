"use client";

import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { LanguageProvider, useLanguage } from "@/context/LanguageContext";

// ----------------------------------------------------------------------
// Navbar Component (uses translations)
// ----------------------------------------------------------------------
function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  useEffect(() => {
    const auth = Cookies.get("aafaq-admin-auth");
    setIsLoggedIn(!!auth);
  }, []);

  const handleLogout = () => {
    document.cookie = "aafaq-admin-auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "/";
  };

  const toggleLanguage = () => {
    setLanguage(language === "EN" ? "AR" : "EN");
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="AAFAQ Logo"
              width={50}
              height={50}
              style={{
                width: "auto",
                height: "auto",
              }}
            />
            <div>
              <h1 className="font-black text-lg">AAFAQ ALMASAR</h1>
              <p className="text-xs text-gray-500">Project Management Services LLC</p>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-6 font-semibold">
            <button
              onClick={toggleLanguage}
              className="border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold"
            >
              {language === "EN" ? "EN | عربي" : "عربي | EN"}
            </button>
            <Link href="/">{t("common.home")}</Link>
            <Link href="/about">{t("common.about")}</Link>
            <Link href="/services">{t("common.services")}</Link>
            <Link href="/projects">{t("common.projects")}</Link>
            <Link href="/careers">{t("common.careers")}</Link>
            <Link href="/contact">{t("common.contact")}</Link>
            <a
              href="https://wa.me/971502039786"
              target="_blank"
              className="bg-green-600 text-white px-4 py-2 rounded-xl"
            >
              {t("common.whatsapp")}
            </a>
            <a
              href="https://www.google.com/maps?q=Dubai"
              target="_blank"
              className="bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              {t("common.maps")}
            </a>
            {!isLoggedIn && (
              <Link href="/admin-login" className="bg-black text-white px-4 py-2 rounded-xl">
                {t("common.login")}
              </Link>
            )}
            {isLoggedIn && (
              <>
                <Link href="/invoice" className="bg-yellow-400 text-black px-4 py-2 rounded-xl font-bold">
                  {t("common.invoice")}
                </Link>
                <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded-xl">
                  {t("common.logout")}
                </button>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <button className="lg:hidden text-3xl font-bold" onClick={() => setMobileMenu(!mobileMenu)}>
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
{mobileMenu && (
  <div className="lg:hidden bg-white shadow-xl flex flex-col items-center gap-5 py-6 font-semibold">
    <button
      onClick={toggleLanguage}
      className="border border-gray-300 px-3 py-2 rounded-xl text-sm font-bold"
    >
      {language === "EN" ? "EN | عربي" : "عربي | EN"}
    </button>
    <Link href="/" onClick={() => setMobileMenu(false)}>{t("common.home")}</Link>
    <Link href="/about" onClick={() => setMobileMenu(false)}>{t("common.about")}</Link>
    <Link href="/services" onClick={() => setMobileMenu(false)}>{t("common.services")}</Link>
    <Link href="/projects" onClick={() => setMobileMenu(false)}>{t("common.projects")}</Link>
    <Link href="/careers" onClick={() => setMobileMenu(false)}>{t("common.careers")}</Link>
    <Link href="/contact" onClick={() => setMobileMenu(false)}>{t("common.contact")}</Link>

    {/* WhatsApp button */}
    <a
      href="https://wa.me/971502039786"
      target="_blank"
      onClick={() => setMobileMenu(false)}
      className="bg-green-600 text-white px-4 py-2 rounded-xl w-40 text-center"
    >
      {t("common.whatsapp")}
    </a>

    {/* Maps button */}
    <a
      href="https://www.google.com/maps?q=Dubai"
      target="_blank"
      onClick={() => setMobileMenu(false)}
      className="bg-blue-600 text-white px-4 py-2 rounded-xl w-40 text-center"
    >
      {t("common.maps")}
    </a>

    {/* Auth buttons (conditional) */}
    {!isLoggedIn && (
      <Link
        href="/admin-login"
        onClick={() => setMobileMenu(false)}
        className="bg-black text-white px-4 py-2 rounded-xl w-40 text-center"
      >
        {t("common.login")}
      </Link>
    )}
    {isLoggedIn && (
      <>
        <Link
          href="/invoice"
          onClick={() => setMobileMenu(false)}
          className="bg-yellow-400 text-black px-4 py-2 rounded-xl w-40 text-center font-bold"
        >
          {t("common.invoice")}
        </Link>
        <button
          onClick={() => {
            setMobileMenu(false);
            handleLogout();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-xl w-40 text-center"
        >
          {t("common.logout")}
        </button>
      </>
    )}
  </div>
)}
      </header>
    </>
  );
}

// ----------------------------------------------------------------------
// Footer Component (uses translations) with Legal column added
// ----------------------------------------------------------------------
function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-black text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-5 gap-10">
        {/* Column 1: Company info */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <Image
              src="/logo.png"
              alt="AAFAQ Logo"
              width={50}
              height={50}
              style={{
                width: "auto",
                height: "auto",
              }}
            />
            <div>
              <h2 className="font-black text-lg">AAFAQ ALMASAR</h2>
              <p className="text-sm text-gray-400">{t("common.companyDesc")}</p>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links */}
        <div>
          <h3 className="font-bold mb-4">{t("common.quickLinks")}</h3>
          <div className="space-y-2 text-gray-300">
            <div><Link href="/">{t("common.home")}</Link></div>
            <div><Link href="/about">{t("common.about")}</Link></div>
            <div><Link href="/services">{t("common.services")}</Link></div>
            <div><Link href="/projects">{t("common.projects")}</Link></div>
            <div><Link href="/careers">{t("common.careers")}</Link></div>
            <div><Link href="/contact">{t("common.contact")}</Link></div>
          </div>
        </div>

        {/* Column 3: Legal (now translatable) */}
        <div>
          <h3 className="font-bold mb-4">{t("common.legal")}</h3>
          <div className="space-y-2 text-gray-300">
            <div><Link href="/privacy-policy">{t("privacy.title")}</Link></div>
            <div><Link href="/terms-and-conditions">{t("terms.title")}</Link></div>
          </div>
        </div>

        {/* Column 4: Services */}
        <div>
          <h3 className="font-bold mb-4">{t("common.servicesTitle")}</h3>
          <div className="space-y-2 text-gray-300">
            <div><Link href="/services/project-planning">{t("common.planning")}</Link></div>
            <div><Link href="/services/vendor-management">{t("common.vendor")}</Link></div>
            <div><Link href="/services/business-coordination">{t("common.coordination")}</Link></div>
            <div><Link href="/services/operational-support">{t("common.operational")}</Link></div>
            <div><Link href="/services/administrative-services">{t("common.admin")}</Link></div>
            <div><Link href="/services/consultancy-services">{t("common.consultancy")}</Link></div>
          </div>
        </div>

        {/* Column 5: Contact Info */}
        <div>
          <h3 className="font-bold mb-4">{t("common.contactInfo")}</h3>
          <div className="space-y-3 text-gray-300 text-sm">
            <div>+971502039786</div>
            <div>+971505020088</div>
            <div>dewalattock@gmail.com</div>
            <div>amran@tuta.io</div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-800 text-center text-sm text-gray-400 py-5">
        {t("common.footerRights")}
      </div>
    </footer>
  );
}

// ----------------------------------------------------------------------
// Inner Layout (uses context to set html dir/lang)
// ----------------------------------------------------------------------
function RootLayoutInner({ children }: { children: React.ReactNode }) {
  const { language } = useLanguage();

  useEffect(() => {
    // Update html direction and language attributes
    document.documentElement.dir = language === "AR" ? "rtl" : "ltr";
    document.documentElement.lang = language === "AR" ? "ar" : "en";
  }, [language]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </>
  );
}

// ----------------------------------------------------------------------
// Main Layout (wraps with LanguageProvider)
// ----------------------------------------------------------------------
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body className="bg-white text-black">
        <LanguageProvider>
          <RootLayoutInner>{children}</RootLayoutInner>
        </LanguageProvider>
      </body>
    </html>
  );
}