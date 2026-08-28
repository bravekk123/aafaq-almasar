type ServiceHeroProps = {
  title: string;
  description: string;
};

export default function ServiceHero({
  title,
  description,
}: ServiceHeroProps) {
  return (
    <section className="bg-gradient-to-b from-black via-gray-900 to-green-950 text-white py-24 px-6">

      <div className="max-w-6xl mx-auto text-center">

        <h1 className="text-5xl md:text-7xl font-black mb-8">
          {title}
        </h1>

        <p className="text-xl text-gray-300 leading-loose max-w-5xl mx-auto">

          {description}

        </p>

      </div>

    </section>
  );
}