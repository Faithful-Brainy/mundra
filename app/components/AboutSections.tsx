const aboutCards = [
  {
    title: "Our Vision",
    icon: "EV",
    body: "To be the leading educational institution in Adamawa State, producing well-rounded students who are academically excellent and morally upright.",
  },
  {
    title: "Our Mission",
    icon: "MS",
    body: "To provide quality education that develops the intellectual, social, and moral potential of every student in a nurturing and inclusive environment.",
  },
  {
    title: "Our Values",
    icon: "VL",
    body: "Excellence, Integrity, Respect, Innovation, and Community - the pillars that guide our educational approach and school culture.",
  },
];

const academicLevels = [
  {
    id: "crecheApplication",
    title: "Creche / DayCare",
    body: "Early childhood care and learning for children aged 6 months to 2 years, focusing on basic development and social skills. (Click To Apply Now!)",
  },
  {
    id: "nurseryApplication",
    title: "Nursery",
    body: "Foundation learning for ages 3-5, introducing basic literacy, numeracy, and social interaction through play-based learning.",
  },
  {
    id: "primaryApplication",
    title: "Primary",
    body: "Comprehensive primary education following the Nigerian curriculum, building strong foundations in core subjects and critical thinking.",
  },
  {
    id: "secondaryApplication",
    title: "Secondary (JSS/SSS)",
    body: "Senior education platform with focused preparation for advanced studies and life skills.",
  },
];

const curriculumFeatures = [
  {
    title: "Core Subjects",
    icon: "CS",
    body: "Mathematics, English, Science, Social Studies, and Nigerian Languages",
  },
  {
    title: "E-Learning",
    icon: "EL",
    body: "Modern technology integration with digital learning platforms and resources",
  },
  {
    title: "Creative Arts",
    icon: "CA",
    body: "Music, Arts, Drama, and Creative Writing to nurture artistic talents",
  },
];

function Badge({ text }: { text: string }) {
  return (
    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
      {text}
    </span>
  );
}

export default function AboutSections() {
  return (
    <>
      <section id="about" className="scroll-mt-28 bg-slate-50 px-4 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
              About Mundra Model Schools
            </h2>
            <p className="mt-3 text-slate-600">
              Committed to providing quality education and nurturing young minds in a supportive environment.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {aboutCards.map((card) => (
              <article key={card.title} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <Badge text={card.icon} />
                <h3 className="mt-4 text-xl font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{card.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-14 text-center">
            <h3 className="text-2xl font-semibold text-slate-900">Message from the Principal</h3>
            <div className="mx-auto mt-6 max-w-3xl rounded-2xl bg-white p-8 text-left shadow-md">
              <p className="text-lg italic leading-8 text-slate-700">
                &quot;Welcome to Mundra Model Schools, where we believe every child has the potential to excel. Our
                dedicated faculty and staff are committed to providing a nurturing environment that fosters academic
                excellence, character development, and lifelong learning. We look forward to partnering with you in
                your child&apos;s educational journey.&quot;
              </p>
              <p className="mt-5 font-semibold text-blue-700">- Principal, Mundra Model Schools</p>
            </div>
          </div>
        </div>
      </section>

      <section id="academics" className="scroll-mt-28 bg-white px-4 py-16 md:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Academic Programs</h2>
            <p className="mt-3 text-slate-600">
              Comprehensive educational programs designed to meet the needs of students at every level.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {academicLevels.map((level) => (
              <article
                key={level.id}
                id={level.id}
                className="rounded-2xl border border-blue-100 bg-blue-50 p-6 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <h3 className="text-xl font-semibold text-slate-900">{level.title}</h3>
                <p className="mt-2 leading-7 text-slate-600">{level.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-14">
            <h3 className="text-center text-2xl font-semibold text-slate-900">Our Curriculum Features</h3>
            <div className="mt-6 grid gap-5 md:grid-cols-3">
              {curriculumFeatures.map((feature) => (
                <article key={feature.title} className="rounded-2xl bg-slate-100 p-6">
                  <Badge text={feature.icon} />
                  <h4 className="mt-4 text-lg font-semibold text-slate-900">{feature.title}</h4>
                  <p className="mt-2 leading-7 text-slate-600">{feature.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
