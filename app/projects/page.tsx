"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ProjectsPage() {
  const { t } = useLanguage();

  // Define industry keys as an array (these will be translated individually)
  const industryKeys = [
    "projects.industries.0",
    "projects.industries.1",
    "projects.industries.2",
    "projects.industries.3",
    "projects.industries.4",
    "projects.industries.5",
    "projects.industries.6",
    "projects.industries.7",
  ];

  return (
    <main>
      {/* HERO */}
      <section className="bg-gradient-to-b from-black via-gray-900 to-green-950 text-white py-24 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-8">{t("projects.title")}</h1>
          <p className="text-xl text-gray-300 leading-loose max-w-5xl mx-auto">{t("projects.desc")}</p>
        </div>
      </section>

      {/* PROJECTS */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* PROJECT 1 */}
            <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-xl">
              <div className="h-56 bg-gradient-to-r from-black to-green-700"></div>
              <div className="p-10">
                <h2 className="text-3xl font-black mb-5">{t("projects.project1Title")}</h2>
                <p className="text-gray-700 leading-loose mb-6">{t("projects.project1Desc")}</p>
                <div className="text-sm font-bold text-green-700">{t("projects.project1Tag")}</div>
              </div>
            </div>

            {/* PROJECT 2 */}
            <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-xl">
              <div className="h-56 bg-gradient-to-r from-red-700 to-black"></div>
              <div className="p-10">
                <h2 className="text-3xl font-black mb-5">{t("projects.project2Title")}</h2>
                <p className="text-gray-700 leading-loose mb-6">{t("projects.project2Desc")}</p>
                <div className="text-sm font-bold text-green-700">{t("projects.project2Tag")}</div>
              </div>
            </div>

            {/* PROJECT 3 */}
            <div className="bg-gray-100 rounded-3xl overflow-hidden shadow-xl">
              <div className="h-56 bg-gradient-to-r from-green-800 to-black"></div>
              <div className="p-10">
                <h2 className="text-3xl font-black mb-5">{t("projects.project3Title")}</h2>
                <p className="text-gray-700 leading-loose mb-6">{t("projects.project3Desc")}</p>
                <div className="text-sm font-bold text-green-700">{t("projects.project3Tag")}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="py-24 px-6 bg-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-16">{t("projects.industriesTitle")}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {industryKeys.map((key, index) => (
              <div key={index} className="bg-white rounded-3xl p-8 shadow-xl">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mx-auto mb-6"></div>
                <h3 className="text-xl font-black">{t(key)}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}