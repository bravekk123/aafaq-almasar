"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ProjectsPage() {
  const { t, language } = useLanguage();
  const isArabic = language === "AR";

  // Full list of 14 sectors (from your DET license)
  const sectorsList = [
    { en: "Real Estate", ar: "العقارات" },
    { en: "Renting & Leasing", ar: "التأجير والاستئجار" },
    { en: "Bus Services", ar: "خدمات الحافلات" },
    { en: "IT & Technology", ar: "تكنولوجيا المعلومات" },
    { en: "Events & Entertainment", ar: "الفعاليات والترفيه" },
    { en: "Healthcare", ar: "الرعاية الصحية" },
    { en: "Energy", ar: "الطاقة" },
    { en: "Government", ar: "الحكومة" },
    { en: "Retail", ar: "التجزئة" },
    { en: "Oil & Gas", ar: "النفط والغاز" },
    { en: "Education", ar: "التعليم" },
    { en: "Facilities Management", ar: "إدارة المرافق" },
    { en: "Hospitality", ar: "الضيافة" },
    { en: "Renewable Energy", ar: "الطاقة المتجددة" },
  ];

  // Example projects that highlight real‑world applications
  const projects = [
    {
      id: 1,
      titleEn: "Dubai Creek Tower Infrastructure",
      titleAr: "برج خور دبي للبنية التحتية",
      descEn: "Project management and operational coordination for a major infrastructure landmark in Dubai.",
      descAr: "إدارة المشاريع والتنسيق التشغيلي لمعلم بنية تحتية رئيسي في دبي.",
      tags: ["Real Estate", "Infrastructure", "Construction"],
      tagsAr: ["العقارات", "البنية التحتية", "البناء"],
    },
    {
      id: 2,
      titleEn: "UAE National Bus Fleet Optimization",
      titleAr: "تحسين أسطول الحافلات الوطنية في الإمارات",
      descEn: "Strategic planning and vendor coordination for public bus transport efficiency across Emirates.",
      descAr: "تخطيط استراتيجي وتنسيق مع الموردين لتحسين كفاءة النقل بالحافلات العامة في جميع الإمارات.",
      tags: ["Bus Services", "Transportation", "Public Sector"],
      tagsAr: ["خدمات الحافلات", "النقل", "القطاع العام"],
    },
    {
      id: 3,
      titleEn: "Solar Farm Project Management",
      titleAr: "إدارة مشاريع مزرعة الطاقة الشمسية",
      descEn: "End‑to‑end project planning and execution for a 100MW solar energy initiative.",
      descAr: "تخطيط وتنفيذ مشاريع شاملة لمبادرة طاقة شمسية بقدرة 100 ميجاوات.",
      tags: ["Renewable Energy", "Energy", "Sustainability"],
      tagsAr: ["الطاقة المتجددة", "الطاقة", "الاستدامة"],
    },
  ];

  return (
    <main>
      {/* Hero Section (uses existing translation keys) */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-green-950 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-8">{t("projects.title")}</h1>
          <p className="text-xl text-gray-300 leading-loose max-w-5xl mx-auto">{t("projects.desc")}</p>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-100 rounded-3xl overflow-hidden shadow-xl flex flex-col">
                <div className="h-56 bg-gradient-to-r from-green-800 to-black"></div>
                <div className="p-10 flex-1">
                  <h2 className="text-3xl font-black mb-5">
                    {isArabic ? project.titleAr : project.titleEn}
                  </h2>
                  <p className="text-gray-700 leading-loose mb-6">
                    {isArabic ? project.descAr : project.descEn}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {(isArabic ? project.tagsAr : project.tags).map((tag, idx) => (
                      <span key={idx} className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Full Sectors List */}
      <section className="py-24 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-16">{t("projects.industriesTitle")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {sectorsList.map((sector, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mx-auto mb-6"></div>
                <h3 className="text-xl font-black">{isArabic ? sector.ar : sector.en}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}