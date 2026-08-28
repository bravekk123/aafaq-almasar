"use client";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { useLanguage } from "@/context/LanguageContext";

export default function ProjectPlanningPage() {
  const { t, language } = useLanguage();
  const isArabic = language === "AR";

  const sectors = [
    isArabic ? "العقارات" : "Real Estate",
    isArabic ? "الطاقة" : "Energy",
    isArabic ? "البنية التحتية" : "Infrastructure",
    isArabic ? "الرعاية الصحية" : "Healthcare",
    isArabic ? "التعليم" : "Education",
  ];

  return (
    <ServicePageTemplate
      heroTitle={t("services.projectPlanning.heroTitle")}
      heroDescription={t("services.projectPlanning.heroDescription")}
      overviewTitle={t("services.projectPlanning.overviewTitle")}
      overviewText1={t("services.projectPlanning.overviewText1")}
      overviewText2={t("services.projectPlanning.overviewText2")}
      solutionsTitle={t("services.projectPlanning.solutionsTitle")}
      solutions={[
        t("services.projectPlanning.solution1"),
        t("services.projectPlanning.solution2"),
        t("services.projectPlanning.solution3"),
        t("services.projectPlanning.solution4"),
        t("services.projectPlanning.solution5"),
        t("services.projectPlanning.solution6"),
      ]}
      processTitle={t("services.projectPlanning.processTitle")}
      processSteps={[
        { number: "01", title: t("services.projectPlanning.step1Title"), description: t("services.projectPlanning.step1Desc") },
        { number: "02", title: t("services.projectPlanning.step2Title"), description: t("services.projectPlanning.step2Desc") },
        { number: "03", title: t("services.projectPlanning.step3Title"), description: t("services.projectPlanning.step3Desc") },
        { number: "04", title: t("services.projectPlanning.step4Title"), description: t("services.projectPlanning.step4Desc") },
      ]}
      ctaTitle={t("services.projectPlanning.ctaTitle")}
      ctaDescription={t("services.projectPlanning.ctaDescription")}
      sectors={sectors}
    />
  );
}