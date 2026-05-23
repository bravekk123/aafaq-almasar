"use client";
import ServicePageTemplate from "@/components/ServicePageTemplate";
import { useLanguage } from "@/context/LanguageContext";

export default function VendorManagementPage() {
  const { t } = useLanguage();
  return (
    <ServicePageTemplate
      heroTitle={t("services.vendorManagement.heroTitle")}
      heroDescription={t("services.vendorManagement.heroDescription")}
      overviewTitle={t("services.vendorManagement.overviewTitle")}
      overviewText1={t("services.vendorManagement.overviewText1")}
      overviewText2={t("services.vendorManagement.overviewText2")}
      solutionsTitle={t("services.vendorManagement.solutionsTitle")}
      solutions={[
        t("services.vendorManagement.solution1"),
        t("services.vendorManagement.solution2"),
        t("services.vendorManagement.solution3"),
        t("services.vendorManagement.solution4"),
        t("services.vendorManagement.solution5"),
        t("services.vendorManagement.solution6"),
      ]}
      processTitle={t("services.vendorManagement.processTitle")}
      processSteps={[
        { number: "01", title: t("services.vendorManagement.step1Title"), description: t("services.vendorManagement.step1Desc") },
        { number: "02", title: t("services.vendorManagement.step2Title"), description: t("services.vendorManagement.step2Desc") },
        { number: "03", title: t("services.vendorManagement.step3Title"), description: t("services.vendorManagement.step3Desc") },
        { number: "04", title: t("services.vendorManagement.step4Title"), description: t("services.vendorManagement.step4Desc") },
      ]}
      ctaTitle={t("services.vendorManagement.ctaTitle")}
      ctaDescription={t("services.vendorManagement.ctaDescription")}
    />
  );
}