"use client";

import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

const serviceLinks = [
  "/services/project-planning",
  "/services/vendor-management",
  "/services/business-coordination",
  "/services/operational-support",
  "/services/administrative-services",
  "/services/consultancy-services",
];

export default function ServicesPage() {
  const { t } = useLanguage();

  // Get translated service titles
  const serviceTitles = [
    t("common.planning"),
    t("common.vendor"),
    t("common.coordination"),
    t("common.operational"),
    t("common.admin"),
    t("common.consultancy"),
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-950 text-white py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h1 className="text-6xl font-black mb-8">{t("servicesPage.title")}</h1>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-loose">{t("servicesPage.desc")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {serviceTitles.map((title, index) => (
            <Link
              key={index}
              href={serviceLinks[index]}
              className="bg-white text-black rounded-3xl p-10 shadow-2xl hover:-translate-y-3 hover:shadow-green-500/20 transition duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6"></div>
              <h2 className="text-3xl font-black mb-5">{title}</h2>
              <p className="text-gray-600 leading-loose mb-6">
                Professional UAE business support and management solutions tailored for enterprise operations.
              </p>
              <div className="text-green-700 font-bold">{t("servicesPage.viewDetails")} →</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}