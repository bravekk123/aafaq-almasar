"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";
import { sectorsData } from "./sectorsData";

export default function SectorsPage() {
  const { language } = useLanguage();
  const isArabic = language === "AR";

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-900 to-green-800 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            {isArabic ? "القطاعات التي نخدمها" : "Sectors We Serve"}
          </h1>
          <p className="text-xl md:text-2xl max-w-4xl mx-auto opacity-90">
            {isArabic
              ? "نحن نقدم خدمات إدارة المشاريع والاستشارات عبر أكثر من 14 قطاعاً معتمداً من دائرة الاقتصاد والسياحة بدبي."
              : "We provide project management and consultancy services across 14+ Dubai Economic & Tourism Department (DET) licensed sectors."}
          </p>
          <div className="mt-6 text-sm bg-white/20 inline-block px-4 py-2 rounded-full">
            {isArabic ? "رمز النشاط: 8211015" : "Activity Code: 8211015"}
          </div>
        </div>
      </section>

      {/* Sectors Grid */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sectorsData.map((sector) => (
              <Link key={sector.id} href={`/sectors/${sector.id}`}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2 cursor-pointer">
                  <div className="h-2 bg-gradient-to-r from-blue-600 to-green-600"></div>
                  <div className="p-6">
                    <div className="text-4xl mb-4">{sector.icon}</div>
                    <h2 className="text-2xl font-bold mb-2 text-gray-800 dark:text-white">
                      {isArabic ? sector.nameAr : sector.nameEn}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {isArabic ? sector.descriptionAr.substring(0, 100) + "…" : sector.descriptionEn.substring(0, 100) + "…"}
                    </p>
                    <div className="mt-4 text-green-600 font-semibold">
                      {isArabic ? "اقرأ المزيد →" : "Learn more →"}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* License Note */}
      <section className="bg-gray-100 dark:bg-gray-800 py-12 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isArabic
              ? "مرخص من دائرة الاقتصاد والسياحة بدبي – رخصة تجارية رقم 1415606 – النشاط: خدمات إدارة المشاريع (رمز 8211015). نحن نعمل في القطاعات المذكورة أعلاه ضمن الإطار القانوني المسموح به."
              : "Licensed by Dubai Economic & Tourism Department – Commercial License No: 1415606 – Activity: Project Management Services (Code 8211015). We operate in the above sectors within the permitted legal framework."}
          </p>
        </div>
      </section>
    </main>
  );
}