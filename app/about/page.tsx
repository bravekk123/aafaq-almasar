"use client";

import { useLanguage } from "@/context/LanguageContext";

// Add this key to your en.json and ar.json inside the "about" object:
// "valueDesc": "..."

export default function AboutPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-950 text-white">
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-green-600 px-5 py-2 rounded-full text-sm mb-8">{t("about.badge")}</div>
            <h1 className="text-6xl font-black leading-tight mb-8">{t("about.title")}</h1>
            <p className="text-xl text-gray-300 leading-loose mb-10">{t("about.desc1")}</p>
            <a href="https://wa.me/971502039786" target="_blank" className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl font-bold transition">{t("about.contactBtn")}</a>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1600&auto=format&fit=crop" alt="About Company" className="rounded-[40px] shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6">{t("about.valuesTitle")}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">{t("about.valuesDesc")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[t("about.value1"), t("about.value2"), t("about.value3"), t("about.value4")].map((item, index) => (
              <div key={index} className="bg-gray-100 rounded-3xl p-10 shadow-xl text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-red-600 to-green-600 mb-6"></div>
                <h3 className="text-2xl font-black mb-4">{item}</h3>
                <p className="text-gray-600 leading-loose">{t("about.valueDesc")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[["10+", t("about.statsExp")], ["100+", t("about.statsOps")], ["24/7", t("about.statsSupport")], ["UAE", t("about.statsEnterprise")]].map(([number, label], index) => (
              <div key={index} className="bg-gray-900 rounded-3xl p-12 border border-gray-800">
                <div className="text-6xl font-black text-green-500 mb-4">{number}</div>
                <div className="text-xl text-gray-300">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}