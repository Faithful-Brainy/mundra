export default function News() {
  const newsItems = [
    {
      date: "September 15, 2025",
      title: "New Academic Session Begins",
      category: "Academics",
      body: "We warmly welcome all students and parents to the new academic session. Orientation for new students starts next week.",
    },
    {
      date: "September 30, 2025",
      title: "Inter-House Sports Festival",
      category: "Events",
      body: "Students across all houses will compete in track, football, and relay events. Parents are invited to attend and support.",
    },
    {
      date: "October 10, 2025",
      title: "Parent-Teacher Conference Week",
      category: "Parents",
      body: "Book one-on-one meetings with class teachers to review student progress and discuss goals for the term.",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#1e3c72] via-[#2a5298] to-[#1e3c72] px-4 pb-12 pt-24 md:px-10 md:pt-28">
      <section className="mx-auto w-full max-w-6xl rounded-[2.2rem] border border-white/30 bg-white/90 p-6 text-black shadow-[0_24px_80px_rgba(0,0,0,0.3)] backdrop-blur md:p-10">
        <div className="mb-8 border-b border-[#1e3c72]/20 pb-6">
          <h1 className="font-mono text-3xl font-bold text-[#0f2242] md:text-5xl">
            News & Events
          </h1>
          <p className="mt-3 max-w-3xl text-base text-[#1e3c72] md:text-lg">
            Stay updated with the latest happenings and upcoming events at Mundra
            Model Schools.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {newsItems.map((item) => (
            <article
              key={item.title}
              className="rounded-3xl border border-[#1e3c72]/20 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="rounded-full bg-[#dce8ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0f2242]">
                  {item.category}
                </span>
                <time className="text-sm font-medium text-[#1e3c72]/90">
                  {item.date}
                </time>
              </div>
              <h2 className="text-xl font-bold text-[#0f2242]">{item.title}</h2>
              <p className="mt-3 text-sm leading-6 text-[#1e3c72]/90">{item.body}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
