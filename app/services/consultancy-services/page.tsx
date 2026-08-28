"use client";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { useLanguage } from "@/context/LanguageContext";

export default function ConsultancyServicesPage() {
  const { t, language } = useLanguage();
  const isArabic = language === "AR";

  const sectors = [
    isArabic ? "الطاقة المتجددة" : "Renewable Energy",
    isArabic ? "التكنولوجيا المالية" : "FinTech",
    isArabic ? "التوسع الدولي" : "International Expansion",
    isArabic ? "التحول الرقمي" : "Digital Transformation",
    isArabic ? "الاستدامة" : "Sustainability",
  ];

  return (
    <ServicePageTemplate
      heroTitle={t("services.consultancyServices.heroTitle")}
      heroDescription={t("services.consultancyServices.heroDescription")}
      overviewTitle={t("services.consultancyServices.overviewTitle")}
      overviewText1={t("services.consultancyServices.overviewText1")}
      overviewText2={t("services.consultancyServices.overviewText2")}
      solutionsTitle={t("services.consultancyServices.solutionsTitle")}
      solutions={[
        t("services.consultancyServices.solution1"),
        t("services.consultancyServices.solution2"),
        t("services.consultancyServices.solution3"),
        t("services.consultancyServices.solution4"),
        t("services.consultancyServices.solution5"),
        t("services.consultancyServices.solution6"),
      ]}
      processTitle={t("services.consultancyServices.processTitle")}
      processSteps={[
        { number: "01", title: t("services.consultancyServices.step1Title"), description: t("services.consultancyServices.step1Desc") },
        { number: "02", title: t("services.consultancyServices.step2Title"), description: t("services.consultancyServices.step2Desc") },
        { number: "03", title: t("services.consultancyServices.step3Title"), description: t("services.consultancyServices.step3Desc") },
        { number: "04", title: t("services.consultancyServices.step4Title"), description: t("services.consultancyServices.step4Desc") },
      ]}
      ctaTitle={t("services.consultancyServices.ctaTitle")}
      ctaDescription={t("services.consultancyServices.ctaDescription")}
      sectors={sectors}
    />
  );
}