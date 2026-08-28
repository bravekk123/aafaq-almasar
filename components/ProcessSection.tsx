type ProcessStep = {
  number: string;
  title: string;
  description: string;
};

type ProcessSectionProps = {
  title: string;
  steps: ProcessStep[];
};

export default function ProcessSection({
  title,
  steps,
}: ProcessSectionProps) {
  return (
    <section className="py-24 px-6 bg-gray-100">

      <div className="max-w-7xl mx-auto text-center">

        <h2 className="text-5xl font-black mb-16">
          {title}
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {steps.map((step, index) => (

            <div
              key={index}
              className="bg-white rounded-3xl p-10 shadow-xl"
            >

              <div className="text-6xl font-black text-green-700 mb-6">
                {step.number}
              </div>

              <h3 className="text-2xl font-black mb-5">
                {step.title}
              </h3>

              <p className="text-gray-600 leading-loose">
                {step.description}
              </p>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}