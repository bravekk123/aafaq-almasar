"use client";

import Link from "next/link";
import PremiumButton from "@/components/PremiumButton";
import { useLanguage } from "@/context/LanguageContext";

export default function HomePage() {
  const { t } = useLanguage();

  return (
    <main>
      {/* HERO SECTION */}
      <section className="bg-gradient-to-b from-slate-900 to-slate-950 text-white py-24 px-6 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          {/* LOGO */}
          <img
            src="/logo.png"
            alt="Logo"
            className="mx-auto w-full max-w-5xl rounded-[40px] mb-12"
          />

          {/* TITLE */}
          <h1 className="text-5xl md:text-7xl font-black leading-tight mb-8">
            {t("home.heroTitle")}
          </h1>

          {/* DESCRIPTION */}
          <p className="text-lg md:text-2xl text-gray-300 leading-loose max-w-5xl mx-auto mb-12">
            {t("home.heroDesc")}
          </p>

          {/* BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            {/* WHATSAPP */}
            <PremiumButton
              text={t("home.whatsappBtn")}
              href="https://wa.me/971502039786"
            />

            {/* GOOGLE MAPS */}
            <a
              href="https://maps.google.com/?q=Rigga+Business+Centre+Dubai"
              target="_blank"
              className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-xl hover:scale-105 transition"
            >
              <img
                src="/map.png"
                alt="Google Maps"
                className="w-8 h-8"
              />
              <span className="font-black text-lg">
                {t("common.maps")}
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-24 px-6 bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl font-black mb-8 text-white">
            {t("home.ourServices")}
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-loose mb-16">
            {t("home.servicesDesc")}
          </p>

          {/* SERVICES GRID */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project Planning */}
            <Link href="/services/project-planning">
              <div className="bg-gray-800 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6 mx-auto"></div>
                <h3 className="text-2xl font-black mb-5">
                  {t("common.planning")}
                </h3>
                <p className="text-gray-300 leading-loose">
                  Professional UAE business coordination and enterprise operational support services.
                </p>
              </div>
            </Link>

            {/* Vendor Management */}
            <Link href="/services/vendor-management">
              <div className="bg-gray-800 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6 mx-auto"></div>
                <h3 className="text-2xl font-black mb-5">
                  {t("common.vendor")}
                </h3>
                <p className="text-gray-300 leading-loose">
                  Strategic supplier coordination and procurement support solutions.
                </p>
              </div>
            </Link>

            {/* Business Coordination */}
            <Link href="/services/business-coordination">
              <div className="bg-gray-800 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6 mx-auto"></div>
                <h3 className="text-2xl font-black mb-5">
                  {t("common.coordination")}
                </h3>
                <p className="text-gray-300 leading-loose">
                  Enterprise workflow and stakeholder communication management solutions.
                </p>
              </div>
            </Link>

            {/* Operational Support */}
            <Link href="/services/operational-support">
              <div className="bg-gray-800 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6 mx-auto"></div>
                <h3 className="text-2xl font-black mb-5">
                  {t("common.operational")}
                </h3>
                <p className="text-gray-300 leading-loose">
                  Professional UAE operational assistance and workflow optimization services.
                </p>
              </div>
            </Link>

            {/* Administrative Services */}
            <Link href="/services/administrative-services">
              <div className="bg-gray-800 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6 mx-auto"></div>
                <h3 className="text-2xl font-black mb-5">
                  {t("common.admin")}
                </h3>
                <p className="text-gray-300 leading-loose">
                  Documentation, reporting, scheduling, and office coordination solutions.
                </p>
              </div>
            </Link>

            {/* Consultancy Services */}
            <Link href="/services/consultancy-services">
              <div className="bg-gray-800 text-white rounded-3xl p-10 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition cursor-pointer h-full">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-red-600 to-green-600 mb-6 mx-auto"></div>
                <h3 className="text-2xl font-black mb-5">
                  {t("common.consultancy")}
                </h3>
                <p className="text-gray-300 leading-loose">
                  Strategic business consultancy and operational management support.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}