import ServiceHero from "@/components/ServiceHero";
import CTASection from "@/components/CTASection";
import ProcessSection from "@/components/ProcessSection";

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
}: ServicePageTemplateProps) {
  return (
    <main>

      {/* HERO */}
      <ServiceHero
        title={heroTitle}
        description={heroDescription}
      />

      {/* OVERVIEW */}
      <section className="py-24 px-6 bg-white">

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>

            <h2 className="text-5xl font-black mb-8">
              {overviewTitle}
            </h2>

            <p className="text-lg text-gray-700 leading-loose mb-8">
              {overviewText1}
            </p>

            <p className="text-lg text-gray-700 leading-loose">
              {overviewText2}
            </p>

          </div>

          {/* RIGHT */}
          <div className="bg-gray-100 rounded-3xl p-12 shadow-xl">

            <h3 className="text-4xl font-black mb-10">
              {solutionsTitle}
            </h3>

            <div className="space-y-6 text-lg text-gray-700">

              {solutions.map((solution, index) => (

                <div key={index}>
                  • {solution}
                </div>

              ))}

            </div>

          </div>

        </div>

      </section>

      {/* PROCESS */}
      <ProcessSection
        title={processTitle}
        steps={processSteps}
      />

      {/* CTA */}
      <CTASection
        title={ctaTitle}
        description={ctaDescription}
      />

    </main>
  );
}