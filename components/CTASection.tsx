"use client";

import { useLanguage } from "@/context/LanguageContext";

type CTASectionProps = {
  title: string;
  description: string;
};

export default function CTASection({ title, description }: CTASectionProps) {
  const { t } = useLanguage();

  return (
    <section className="bg-black text-white py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <h2 className="text-5xl font-black mb-8">{title}</h2>
        <p className="text-xl text-gray-300 leading-loose mb-12">{description}</p>
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <a
            href="https://wa.me/971502039786"
            target="_blank"
            className="bg-green-600 px-8 py-4 rounded-2xl text-lg font-black"
          >
            {t("common.whatsapp")}
          </a>
          <a
            href="https://maps.google.com/?q=Rigga+Business+Centre+Dubai"
            target="_blank"
            className="flex items-center gap-3 bg-white text-black px-8 py-4 rounded-2xl text-lg font-black"
          >
            <img src="/map.png" alt="Maps" className="w-7 h-7" />
            {t("common.maps")}
          </a>
        </div>
      </div>
    </section>
  );
}