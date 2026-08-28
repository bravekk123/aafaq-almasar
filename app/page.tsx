"use client";

import Link from "next/link";
import Image from "next/image";
import PremiumButton from "@/components/PremiumButton";
import SEO from "@/components/SEO";
import { useLanguage } from "@/context/LanguageContext";

// Map frontend keys to actual sector IDs (from sectorsData)
const sectorKeyToId: Record<string, string> = {
  realEstate: "real-estate",
  renting: "renting",
  busServices: "bus-services",
  it: "it",
  healthcare: "healthcare",
  energy: "energy",
  government: "government",
  retail: "retail",
};

export default function HomePage() {
  const { t, language } = useLanguage();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "AAFAQ ALMASAR PROJECT MANAGEMENT SERVICES L.L.C",
    url: "https://www.aafaqalmasar.ae",
    logo: "https://www.aafaqalmasar.ae/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+971502039786",
      contactType: "customer service",
      availableLanguage: ["English", "Arabic"],
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: "Office 3001-331, Rigga Business Centre, Al Murqabat",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
  };

  const sectors = [
    { key: "realEstate", icon: "🏗️", en: "Real Estate", ar: "العقارات" },
    { key: "renting", icon: "🚗", en: "Renting & Leasing", ar: "التأجير" },
    { key: "busServices", icon: "🚌", en: "Bus Services", ar: "خدمات الحافلات" },
    { key: "it", icon: "💻", en: "IT & Technology", ar: "تكنولوجيا المعلومات" },
    { key: "healthcare", icon: "🏥", en: "Healthcare", ar: "الرعاية الصحية" },
    { key: "energy", icon: "⚡", en: "Energy", ar: "الطاقة" },
    { key: "government", icon: "🏛️", en: "Government", ar: "الحكومة" },
    { key: "retail", icon: "🛍️", en: "Retail", ar: "التجزئة" },
  ];

  return (
    <>
      <SEO
        title="AAFAQ ALMASAR | Professional UAE Project Management & Consultancy"
        description="AAFAQ ALMASAR provides expert project management, operational coordination, vendor management, consultancy, and administrative support services across Dubai and the UAE."
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-24 px-6">
          <div className="max-w-7xl mx-auto text-center">
            <Image
              src="/logo.png"
              alt="AAFAQ ALMASAR Logo"
              width={1200}
              height={400}
              className="mx-auto w-full max-w-5xl rounded-[40px] mb-12"
              priority
            />
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">{t("home.heroTitle")}</h1>
            <p className="text-lg md:text-2xl text-gray-300 leading-loose max-w-5xl mx-auto mb-12">{t("home.heroDesc")}</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <PremiumButton text={t("home.whatsappBtn")} href="https://wa.me/971502039786" />
              <a href="https://maps.google.com/?q=Rigga+Business+Centre+Dubai" target="_blank" className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition">
                <Image src="/map.png" alt="Google Maps" width={32} height={32} />
                <span className="font-black text-lg">{t("common.maps")}</span>
              </a>
            </div>
          </div>
        </section>

        {/* Sectors Section */}
        <section className="py-24 px-6 bg-gray-50 dark:bg-gray-800">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl font-black mb-8 text-gray-800 dark:text-white">
              {t("home.sectorsTitle") || "Sectors We Serve"}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-loose mb-16">
              {t("home.sectorsDesc") || "We provide project management and consultancy services across 14+ licensed sectors in Dubai and the UAE."}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sectors.map((sector) => {
                const sectorId = sectorKeyToId[sector.key];
                return (
                  <Link key={sector.key} href={`/sectors/${sectorId}`}>
                    <div className="bg-white dark:bg-gray-700 rounded-2xl p-6 shadow-lg text-center hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 cursor-pointer">
                      <div className="text-5xl mb-4">{sector.icon}</div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {t(`home.sectors.${sector.key}`) || (language === "EN" ? sector.en : sector.ar)}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="mt-12">
              <Link
                href="/sectors"
                className="inline-block bg-green-600 text-white font-bold px-8 py-3 rounded-full shadow-lg hover:bg-green-700 transition"
              >
                {t("home.viewAllSectors") || "View All 14+ Sectors →"}
              </Link>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-24 px-6 bg-slate-900">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl font-black mb-8 text-white">{t("home.ourServices")}</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-loose mb-16">{t("home.servicesDesc")}</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Link href="/services/project-planning">
                <div className="bg-gray-800 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6 mx-auto"></div>
                  <h3 className="text-2xl font-black mb-5">{t("common.planning")}</h3>
                  <p className="text-gray-300 leading-loose">{t("home.cardDescPlanning")}</p>
                </div>
              </Link>
              <Link href="/services/vendor-management">
                <div className="bg-gray-800 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6 mx-auto"></div>
                  <h3 className="text-2xl font-black mb-5">{t("common.vendor")}</h3>
                  <p className="text-gray-300 leading-loose">{t("home.cardDescVendor")}</p>
                </div>
              </Link>
              <Link href="/services/business-coordination">
                <div className="bg-gray-800 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6 mx-auto"></div>
                  <h3 className="text-2xl font-black mb-5">{t("common.coordination")}</h3>
                  <p className="text-gray-300 leading-loose">{t("home.cardDescCoordination")}</p>
                </div>
              </Link>
              <Link href="/services/operational-support">
                <div className="bg-gray-800 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6 mx-auto"></div>
                  <h3 className="text-2xl font-black mb-5">{t("common.operational")}</h3>
                  <p className="text-gray-300 leading-loose">{t("home.cardDescOperational")}</p>
                </div>
              </Link>
              <Link href="/services/administrative-services">
                <div className="bg-gray-800 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6 mx-auto"></div>
                  <h3 className="text-2xl font-black mb-5">{t("common.admin")}</h3>
                  <p className="text-gray-300 leading-loose">{t("home.cardDescAdmin")}</p>
                </div>
              </Link>
              <Link href="/services/consultancy-services">
                <div className="bg-gray-800 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer h-full">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6 mx-auto"></div>
                  <h3 className="text-2xl font-black mb-5">{t("common.consultancy")}</h3>
                  <p className="text-gray-300 leading-loose">{t("home.cardDescConsultancy")}</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}