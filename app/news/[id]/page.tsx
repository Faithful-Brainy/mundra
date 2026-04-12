import Link from "next/link";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma-client";

function formatEnumLabel(value: string) {
  return value.replaceAll("_", " ");
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const newsId = Number.parseInt(id, 10);

  if (Number.isNaN(newsId)) {
    notFound();
  }

  const newsItem = await (async () => {
    try {
      return await prisma.newsItem.findUnique({
        where: { id: newsId },
      });
    } catch {
      return null;
    }
  })();

  if (!newsItem) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#030712] via-[#0f2242] to-[#1e3c72] px-4 py-20 md:px-10">
      <section className="mx-auto w-full max-w-6xl rounded-[2.2rem] border border-[#7dd3fc]/35 bg-[#60a5fa] p-6 text-black shadow-[0_24px_80px_rgba(0,0,0,0.42)] md:p-10">
        <header className="grid gap-4 border-b border-[#1e3c72]/20 pb-6 md:grid-cols-[1.35fr_0.85fr] md:items-end">
          <div>
            <span className="inline-flex rounded-full border border-[#1e3c72]/25 bg-[#c8f1ff] px-4 py-2 text-sm font-medium text-[#0f2242]">
              Mundra Newsroom
            </span>
            <h1 className="mt-4 font-mono text-3xl font-bold text-[#0f2242] md:text-5xl">
              News Article
            </h1>
            <p className="mt-3 max-w-2xl text-base text-[#1e3c72] md:text-lg">
              A full publication view for the selected news item, presented in a
              newspaper-style layout.
            </p>
          </div>

          <div className="rounded-3xl border border-[#1e3c72]/25 bg-[#dff4ff] p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1e3c72]">
              Publication Note
            </p>
            <p className="mt-3 text-sm leading-6 text-[#0f2242]">
              This page is read-only and displays the already fetched news item
              in a richer editorial format.
            </p>
          </div>
        </header>

        <article className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-3xl border border-[#1e3c72]/25 bg-[#dff4ff] p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-[#1e3c72]/20 bg-[#eaf8ff] px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#0f2242]">
                {formatEnumLabel(newsItem.type)}
              </span>
              <span className="rounded-full border border-[#1e3c72]/20 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#1e3c72]">
                For {formatEnumLabel(newsItem.for)}
              </span>
            </div>

            <h2 className="mt-5 font-mono text-3xl font-bold leading-tight text-[#0f2242] md:text-5xl">
              {newsItem.title}
            </h2>

            <div className="mt-6 flex flex-wrap items-center gap-4 border-y border-[#1e3c72]/15 py-4 text-sm text-[#1e3c72]">
              <p className="font-semibold">Published: {newsItem.date}</p>
              <p>Edition ID: #{newsItem.id}</p>
            </div>

            <div className="mt-6 rounded-[2rem] border border-[#1e3c72]/15 bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                Lead Story
              </p>
              <div className="mt-4 space-y-4 text-base leading-8 text-[#0f2242] md:text-lg">
                {newsItem.desc
                  .split(/\n+/)
                  .filter(Boolean)
                  .map((paragraph, index) => (
                    <p key={`${newsItem.id}-${index}`}>{paragraph}</p>
                  ))}
              </div>
            </div>
          </section>

          <aside className="grid gap-6">
            <section className="rounded-3xl border border-[#1e3c72]/25 bg-[#dff4ff] p-6 shadow-sm">
              <h3 className="text-xl font-semibold text-[#0f2242]">
                Article Details
              </h3>
              <div className="mt-5 grid gap-4">
                <div className="rounded-2xl bg-[#eaf8ff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                    Headline
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#0f172a]">
                    {newsItem.title}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#eaf8ff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                    News Type
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#0f172a]">
                    {formatEnumLabel(newsItem.type)}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#eaf8ff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                    Audience
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#0f172a]">
                    {formatEnumLabel(newsItem.for)}
                  </p>
                </div>

                <div className="rounded-2xl bg-[#eaf8ff] p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                    Publication Date
                  </p>
                  <p className="mt-2 text-base font-semibold text-[#0f172a]">
                    {newsItem.date}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-[#1e3c72]/25 bg-[#cfefff] p-6">
              <h3 className="text-xl font-semibold text-[#0f2242]">
                Navigation
              </h3>
              <p className="mt-3 text-sm leading-6 text-[#1e3c72]">
                Return to the full list of school updates and announcements.
              </p>
              <div className="mt-5">
                <Link
                  href="/news"
                  className="inline-flex items-center justify-center rounded-full border border-[#0f2242] bg-[#0f2242] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(15,34,66,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#1e3c72] active:translate-y-0"
                >
                  Back to News
                </Link>
              </div>
            </section>
          </aside>
        </article>
      </section>
    </main>
  );
}
