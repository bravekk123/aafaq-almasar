"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function TermsConditionsPage() {
  const { t } = useLanguage();

  return (
    <main>
      <section className="bg-gradient-to-b from-black via-gray-900 to-green-950 text-white py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-8">{t("terms.title")}</h1>
          <p className="text-xl text-gray-300 leading-loose">{t("terms.subtitle")}</p>
        </div>
      </section>

      <section className="py-24 px-6 bg-white">
        <div className="max-w-5xl mx-auto space-y-16">
          <div>
            <h2 className="text-4xl font-black mb-6">{t("terms.section1Title")}</h2>
            <p className="text-lg text-gray-700 leading-loose">{t("terms.section1Text")}</p>
          </div>
          <div>
            <h2 className="text-4xl font-black mb-6">{t("terms.section2Title")}</h2>
            <p className="text-lg text-gray-700 leading-loose">{t("terms.section2Text")}</p>
          </div>
          <div>
            <h2 className="text-4xl font-black mb-6">{t("terms.section3Title")}</h2>
            <p className="text-lg text-gray-700 leading-loose">{t("terms.section3Text")}</p>
          </div>
          <div>
            <h2 className="text-4xl font-black mb-6">{t("terms.section4Title")}</h2>
            <p className="text-lg text-gray-700 leading-loose">{t("terms.section4Text")}</p>
          </div>
          <div>
            <h2 className="text-4xl font-black mb-6">{t("terms.section5Title")}</h2>
            <p className="text-lg text-gray-700 leading-loose">{t("terms.section5Text")}</p>
          </div>
          <div>
            <h2 className="text-4xl font-black mb-6">{t("terms.section6Title")}</h2>
            <p className="text-lg text-gray-700 leading-loose">{t("terms.section6Text")}</p>
          </div>
        </div>
      </section>
    </main>
  );
}