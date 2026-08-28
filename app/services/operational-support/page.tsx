"use client";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { useLanguage } from "@/context/LanguageContext";

export default function OperationalSupportPage() {
  const { t, language } = useLanguage();
  const isArabic = language === "AR";

  const sectors = [
    isArabic ? "الخدمات اللوجستية" : "Logistics",
    isArabic ? "النقل" : "Transportation",
    isArabic ? "الطاقة" : "Energy",
    isArabic ? "البناء" : "Construction",
    isArabic ? "التصنيع" : "Manufacturing",
  ];

  return (
    <ServicePageTemplate
      heroTitle={t("services.operationalSupport.heroTitle")}
      heroDescription={t("services.operationalSupport.heroDescription")}
      overviewTitle={t("services.operationalSupport.overviewTitle")}
      overviewText1={t("services.operationalSupport.overviewText1")}
      overviewText2={t("services.operationalSupport.overviewText2")}
      solutionsTitle={t("services.operationalSupport.solutionsTitle")}
      solutions={[
        t("services.operationalSupport.solution1"),
        t("services.operationalSupport.solution2"),
        t("services.operationalSupport.solution3"),
        t("services.operationalSupport.solution4"),
        t("services.operationalSupport.solution5"),
        t("services.operationalSupport.solution6"),
      ]}
      processTitle={t("services.operationalSupport.processTitle")}
      processSteps={[
        { number: "01", title: t("services.operationalSupport.step1Title"), description: t("services.operationalSupport.step1Desc") },
        { number: "02", title: t("services.operationalSupport.step2Title"), description: t("services.operationalSupport.step2Desc") },
        { number: "03", title: t("services.operationalSupport.step3Title"), description: t("services.operationalSupport.step3Desc") },
        { number: "04", title: t("services.operationalSupport.step4Title"), description: t("services.operationalSupport.step4Desc") },
      ]}
      ctaTitle={t("services.operationalSupport.ctaTitle")}
      ctaDescription={t("services.operationalSupport.ctaDescription")}
      sectors={sectors}
    />
  );
}