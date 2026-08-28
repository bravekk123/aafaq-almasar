"use client";

import { useLanguage } from "@/context/LanguageContext";

// Add these keys to your en.json and ar.json inside the "careers" object:
// "roleDesc": "...",
// "cultureDescCard": "..."

export default function CareersPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-950 text-white">
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-block bg-green-600 px-5 py-2 rounded-full text-sm mb-8">{t("careers.badge")}</div>
            <h1 className="text-6xl font-black leading-tight mb-8">{t("careers.title")}</h1>
            <p className="text-xl text-gray-300 leading-loose mb-10">{t("careers.desc")}</p>
            <a href="mailto:info@aafaqalmasar.ae" className="bg-green-600 hover:bg-green-700 px-8 py-4 rounded-2xl font-bold transition">{t("careers.submitCv")}</a>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1600&auto=format&fit=crop" alt="Careers" className="rounded-[40px] shadow-2xl" />
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-white text-black">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-8">{t("careers.futureTitle")}</h2>
          <p className="text-xl text-gray-600 leading-loose mb-10">{t("careers.futureText")}</p>
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            {[t("careers.role1"), t("careers.role2"), t("careers.role3")].map((item, index) => (
              <div key={index} className="bg-gray-100 rounded-3xl p-10 shadow-xl">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-red-600 to-green-600 mb-6"></div>
                <h3 className="text-2xl font-black mb-4">{item}</h3>
                <p className="text-gray-600 leading-loose">{t("careers.roleDesc")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-6 bg-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black mb-6">{t("careers.cultureTitle")}</h2>
            <p className="text-xl text-gray-300 max-w-4xl mx-auto">{t("careers.cultureDesc")}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[t("careers.culture1"), t("careers.culture2"), t("careers.culture3"), t("careers.culture4")].map((item, index) => (
              <div key={index} className="bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-r from-red-600 to-green-600 mb-6"></div>
                <h3 className="text-2xl font-black mb-4">{item}</h3>
                <p className="text-gray-400 leading-loose">{t("careers.cultureDescCard")}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}