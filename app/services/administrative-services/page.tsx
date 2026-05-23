"use client";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { useLanguage } from "@/context/LanguageContext";

export default function AdministrativeServicesPage() {
  const { t } = useLanguage();
  return (
    <ServicePageTemplate
      heroTitle={t("services.administrativeServices.heroTitle")}
      heroDescription={t("services.administrativeServices.heroDescription")}
      overviewTitle={t("services.administrativeServices.overviewTitle")}
      overviewText1={t("services.administrativeServices.overviewText1")}
      overviewText2={t("services.administrativeServices.overviewText2")}
      solutionsTitle={t("services.administrativeServices.solutionsTitle")}
      solutions={[
        t("services.administrativeServices.solution1"),
        t("services.administrativeServices.solution2"),
        t("services.administrativeServices.solution3"),
        t("services.administrativeServices.solution4"),
        t("services.administrativeServices.solution5"),
        t("services.administrativeServices.solution6"),
      ]}
      processTitle={t("services.administrativeServices.processTitle")}
      processSteps={[
        { number: "01", title: t("services.administrativeServices.step1Title"), description: t("services.administrativeServices.step1Desc") },
        { number: "02", title: t("services.administrativeServices.step2Title"), description: t("services.administrativeServices.step2Desc") },
        { number: "03", title: t("services.administrativeServices.step3Title"), description: t("services.administrativeServices.step3Desc") },
        { number: "04", title: t("services.administrativeServices.step4Title"), description: t("services.administrativeServices.step4Desc") },
      ]}
      ctaTitle={t("services.administrativeServices.ctaTitle")}
      ctaDescription={t("services.administrativeServices.ctaDescription")}
    />
  );
}