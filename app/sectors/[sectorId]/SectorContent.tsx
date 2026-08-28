"use client";

import { useLanguage } from "@/context/LanguageContext";
import { realEstateContent } from "@/app/sectors/content/realEstate";
import { rentingContent } from "@/app/sectors/content/renting";
import { busServicesContent } from "@/app/sectors/content/busServices";
import { itTechnologyContent } from "@/app/sectors/content/itTechnology";
import { eventsEntertainmentContent } from "@/app/sectors/content/eventsEntertainment";
import { healthcareContent } from "@/app/sectors/content/healthcare";
import { energyUtilitiesContent } from "@/app/sectors/content/energyUtilities";
import { governmentContent } from "@/app/sectors/content/government";
import { retailCommercialContent } from "@/app/sectors/content/retailCommercial";
import { oilGasContent } from "@/app/sectors/content/oilGas";
import { educationContent } from "@/app/sectors/content/education";
import { facilitiesManagementContent } from "@/app/sectors/content/facilitiesManagement";
import { hospitalityTourismContent } from "@/app/sectors/content/hospitalityTourism";
import { renewableEnergyContent } from "@/app/sectors/content/renewableEnergy";

const sectorContentMap: Record<string, any> = {
  "real-estate": realEstateContent,
  renting: rentingContent,
  "bus-services": busServicesContent,
  it: itTechnologyContent,
  events: eventsEntertainmentContent,
  healthcare: healthcareContent,
  energy: energyUtilitiesContent,
  government: governmentContent,
  retail: retailCommercialContent,
  "oil-gas": oilGasContent,
  education: educationContent,
  facilities: facilitiesManagementContent,
  hospitality: hospitalityTourismContent,
  renewable: renewableEnergyContent,
};

interface SectorContentProps {
  sector: {
    id: string;
    nameEn: string;
    nameAr: string;
    icon: string;
  };
}

export default function SectorContent({ sector }: SectorContentProps) {
  const { language } = useLanguage();
  const isArabic = language === "AR";

  const content = sectorContentMap[sector.id];

  if (!content) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-6">
        Content not found for: {sector.id}
      </div>
    );
  }

  return (
    <main>
      <section className="bg-gradient-to-r from-blue-900 to-green-800 text-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-7xl mb-6">{sector.icon}</div>

          <h1 className="text-5xl md:text-6xl font-black mb-6">
            {isArabic ? content.titleAr : content.titleEn}
          </h1>

          <p className="text-xl max-w-4xl mx-auto leading-relaxed">
            {isArabic ? content.overviewAr : content.overviewEn}
          </p>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-10">
            {isArabic ? "التحديات الرئيسية" : "Key Challenges"}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {(isArabic ? content.challengesAr : content.challengesEn).map(
              (item: string, index: number) => (
                <div key={index} className="bg-gray-100 rounded-xl p-5">
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-10">
            {isArabic ? "حلولنا" : "Our Solutions"}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {(isArabic ? content.solutionsAr : content.solutionsEn).map(
              (item: string, index: number) => (
                <div key={index} className="bg-white shadow rounded-xl p-5">
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-10">
            {isArabic ? "الفوائد" : "Benefits"}
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {(isArabic ? content.benefitsAr : content.benefitsEn).map(
              (item: string, index: number) => (
                <div key={index} className="bg-green-50 rounded-xl p-5">
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-black mb-10">
            {isArabic ? "أمثلة المشاريع" : "Project Examples"}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {(isArabic
              ? content.projectExamplesAr
              : content.projectExamplesEn
            ).map((item: string, index: number) => (
              <div key={index} className="bg-white shadow rounded-xl p-6">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}