"use client";

import { useLanguage } from "@/context/LanguageContext";

export default function ContactPage() {
  const { t } = useLanguage();

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-green-950 text-white">
      {/* HERO */}
      <section className="py-28 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-block bg-green-600 px-5 py-2 rounded-full text-sm mb-8">
            {t("contact.badge")}
          </div>
          <h1 className="text-6xl font-black leading-tight mb-8">
            {t("contact.title")}
          </h1>
          <p className="text-xl text-gray-300 leading-loose max-w-4xl mx-auto">
            {t("contact.desc")}
          </p>
        </div>
      </section>

      {/* CONTACT DETAILS */}
      <section className="py-24 px-6 bg-white text-black">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* PHONE 1 */}
            <div className="bg-gray-100 rounded-3xl p-10 shadow-xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-green-600 mb-6"></div>
              <h2 className="text-3xl font-black mb-4">{t("contact.phone1Title")}</h2>
              <p className="text-gray-700 text-lg leading-loose mb-6">{t("contact.phone1Sub")}</p>
              <div className="space-y-4">
                <a href="tel:+971502039786" className="block bg-black text-white px-5 py-3 rounded-2xl text-center font-bold">
                  {t("contact.callBtn")}
                </a>
                <a href="https://wa.me/971502039786" target="_blank" className="block bg-green-600 text-white px-5 py-3 rounded-2xl text-center font-bold">
                  WhatsApp
                </a>
              </div>
            </div>

            {/* PHONE 2 */}
            <div className="bg-gray-100 rounded-3xl p-10 shadow-xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-green-600 mb-6"></div>
              <h2 className="text-3xl font-black mb-4">{t("contact.phone2Title")}</h2>
              <p className="text-gray-700 text-lg leading-loose mb-6">{t("contact.phone1Sub")}</p>
              <div className="space-y-4">
                <a href="tel:+971505020088" className="block bg-black text-white px-5 py-3 rounded-2xl text-center font-bold">
                  {t("contact.callBtn")}
                </a>
                <a href="https://wa.me/971505020088" target="_blank" className="block bg-green-600 text-white px-5 py-3 rounded-2xl text-center font-bold">
                  WhatsApp
                </a>
              </div>
            </div>

            {/* EMAILS */}
            <div className="bg-gray-100 rounded-3xl p-10 shadow-xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-green-600 mb-6"></div>
              <h2 className="text-3xl font-black mb-4">{t("contact.emailsTitle")}</h2>
              <div className="space-y-4 mt-6">
                <a href="mailto:dewalattock@gmail.com" className="block text-green-700 font-bold break-words">
                  dewalattock@gmail.com
                </a>
                <a href="mailto:amran@tuta.io" className="block text-green-700 font-bold break-words">
                  amran@tuta.io
                </a>
              </div>
            </div>

            {/* OFFICE */}
            <div className="bg-gray-100 rounded-3xl p-10 shadow-xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-green-600 mb-6"></div>
              <h2 className="text-3xl font-black mb-4">{t("contact.officeTitle")}</h2>
              <p className="text-gray-700 leading-loose mb-6">{t("contact.officeAddress")}</p>
              <a href="https://maps.google.com/?q=Rigga+Business+Centre+Dubai" target="_blank" className="block bg-black text-white px-5 py-3 rounded-2xl text-center font-bold">
                {t("contact.openMaps")}
              </a>
            </div>

            {/* MAKANI */}
            <div className="bg-gray-100 rounded-3xl p-10 shadow-xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-green-600 mb-6"></div>
              <h2 className="text-3xl font-black mb-4">{t("contact.makaniTitle")}</h2>
              <p className="text-green-700 font-bold text-2xl">3095695348</p>
            </div>

            {/* COMPANY INFO */}
            <div className="bg-gray-100 rounded-3xl p-10 shadow-xl">
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-green-600 mb-6"></div>
              <h2 className="text-3xl font-black mb-4">{t("contact.companyTitle")}</h2>
              <p className="text-gray-700 leading-loose">
                {t("contact.tradeLicense")}
                <br /><br />
                {t("contact.mainland")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="py-24 px-6 bg-black">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-6">{t("contact.formTitle")}</h2>
            <p className="text-xl text-gray-300">{t("contact.formDesc")}</p>
          </div>
          <div className="bg-white rounded-[40px] p-12 text-black shadow-2xl">
            <form action="https://formsubmit.co/dewalattock@gmail.com" method="POST" className="space-y-8">
              <input type="hidden" name="_subject" value="New AAFAQ Consultation Request" />
              <input type="hidden" name="_captcha" value="false" />
              <input type="hidden" name="_template" value="table" />
              <input type="hidden" name="_next" value="https://www.aafaqalmasar.ae" />
              <input type="text" name="company" placeholder={t("contact.companyPlaceholder")} className="w-full border border-gray-300 rounded-2xl px-6 py-5" />
              <input type="text" name="person" placeholder={t("contact.personPlaceholder")} className="w-full border border-gray-300 rounded-2xl px-6 py-5" />
              <input type="email" name="email" placeholder={t("contact.emailPlaceholder")} className="w-full border border-gray-300 rounded-2xl px-6 py-5" />
              <textarea rows={6} name="message" placeholder={t("contact.messagePlaceholder")} className="w-full border border-gray-300 rounded-2xl px-6 py-5"></textarea>
              <button type="submit" className="w-full bg-gradient-to-r from-red-600 to-green-600 text-white py-5 rounded-2xl text-lg font-black hover:opacity-90 transition">
                {t("contact.submitBtn")}
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}