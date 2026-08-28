import ServiceHero from "@/components/ServiceHero";
import CTASection from "@/components/CTASection";
import ProcessSection from "@/components/ProcessSection";
import { useLanguage } from "@/context/LanguageContext";

type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

type ServicePageTemplateProps = {
  heroTitle: string;
  heroDescription: string;
  overviewTitle: string;
  overviewText1: string;
  overviewText2: string;
  solutionsTitle: string;
  solutions: string[];
  processTitle: string;
  processSteps: ProcessStep[];
  ctaTitle: string;
  ctaDescription: string;
  sectors: string[]; // NEW: array of sector names (already translated)
};

export default function ServicePageTemplate({
  heroTitle,
  heroDescription,
  overviewTitle,
  overviewText1,
  overviewText2,
  solutionsTitle,
  solutions,
  processTitle,
  processSteps,
  ctaTitle,
  ctaDescription,
  sectors,
}: ServicePageTemplateProps) {
  const { t, language } = useLanguage();
  const isArabic = language === "AR";

  return (
    <main>
      <ServiceHero title={heroTitle} description={heroDescription} />

      {/* Overview + Solutions */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-black mb-8">{overviewTitle}</h2>
            <p className="text-lg text-gray-700 leading-loose mb-8">{overviewText1}</p>
            <p className="text-lg text-gray-700 leading-loose">{overviewText2}</p>
          </div>
          <div className="bg-gray-100 rounded-3xl p-12 shadow-xl">
            <h3 className="text-4xl font-black mb-10">{solutionsTitle}</h3>
            <div className="space-y-6 text-lg text-gray-700">
              {solutions.map((solution, index) => (
                <div key={index}>• {solution}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Sectors We Serve Section */}
      {sectors && sectors.length > 0 && (
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-5xl font-black mb-8 text-gray-800">
              {isArabic ? "القطاعات التي نخدمها" : "Sectors We Serve"}
            </h2>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              {sectors.map((sector, idx) => (
                <span
                  key={idx}
                  className="bg-white border border-green-600 text-green-700 px-5 py-2 rounded-full font-semibold shadow-sm"
                >
                  {sector}
                </span>
              ))}
            </div>
            <div className="mt-8">
              <a
                href="/sectors"
                className="inline-block text-green-700 font-bold underline"
              >
                {isArabic ? "عرض جميع القطاعات →" : "View all sectors →"}
              </a>
            </div>
          </div>
        </section>
      )}

      <ProcessSection title={processTitle} steps={processSteps} />
      <CTASection title={ctaTitle} description={ctaDescription} />
    </main>
  );
}