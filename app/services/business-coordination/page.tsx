"use client";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { useLanguage } from "@/context/LanguageContext";

export default function BusinessCoordinationPage() {
  const { t, language } = useLanguage();
  const isArabic = language === "AR";

  const sectors = [
    isArabic ? "الخدمات المالية" : "Financial Services",
    isArabic ? "التكنولوجيا" : "Technology",
    isArabic ? "الضيافة" : "Hospitality",
    isArabic ? "الصحة" : "Healthcare",
    isArabic ? "الحكومة" : "Government",
  ];

  return (
    <ServicePageTemplate
      heroTitle={t("services.businessCoordination.heroTitle")}
      heroDescription={t("services.businessCoordination.heroDescription")}
      overviewTitle={t("services.businessCoordination.overviewTitle")}
      overviewText1={t("services.businessCoordination.overviewText1")}
      overviewText2={t("services.businessCoordination.overviewText2")}
      solutionsTitle={t("services.businessCoordination.solutionsTitle")}
      solutions={[
        t("services.businessCoordination.solution1"),
        t("services.businessCoordination.solution2"),
        t("services.businessCoordination.solution3"),
        t("services.businessCoordination.solution4"),
        t("services.businessCoordination.solution5"),
        t("services.businessCoordination.solution6"),
      ]}
      processTitle={t("services.businessCoordination.processTitle")}
      processSteps={[
        { number: "01", title: t("services.businessCoordination.step1Title"), description: t("services.businessCoordination.step1Desc") },
        { number: "02", title: t("services.businessCoordination.step2Title"), description: t("services.businessCoordination.step2Desc") },
        { number: "03", title: t("services.businessCoordination.step3Title"), description: t("services.businessCoordination.step3Desc") },
        { number: "04", title: t("services.businessCoordination.step4Title"), description: t("services.businessCoordination.step4Desc") },
      ]}
      ctaTitle={t("services.businessCoordination.ctaTitle")}
      ctaDescription={t("services.businessCoordination.ctaDescription")}
      sectors={sectors}
    />
  );
}