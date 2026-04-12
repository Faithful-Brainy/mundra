import Link from "next/link";

export default function PrincipalPage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0b2447_0%,#091224_46%,#05070f_100%)] px-4 py-20 md:px-10">
      <section className="mx-auto w-full max-w-7xl rounded-[2.25rem] border border-[#38bdf8]/35 bg-[#0b1f44] p-6 text-white shadow-[0_26px_90px_rgba(2,6,23,0.65)] md:p-10">
        <div>
          <p className="font-[Montserrat,Segoe_UI,sans-serif] text-xs uppercase tracking-[0.28em] text-[#7dd3fc]">
            Welcome Sir!
          </p>
          <h1 className="mt-2 font-[Poppins,Montserrat,sans-serif] text-3xl font-semibold text-[#e0f2fe] md:text-5xl">
            Principal
          </h1>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-full border border-[#38bdf8]/50 bg-[#0c4a6e] px-5 py-2.5 text-sm font-semibold text-[#e0f2fe]">
              News Publication Desk
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6">
          <article className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white text-[#0f172a] shadow-2xl transition-transform duration-300 hover:-translate-y-2">
            <div className="flex flex-col md:flex-row">
              <div className="flex min-h-80 items-end bg-[linear-gradient(180deg,#38bdf8_0%,#2563eb_58%,#0f172a_100%)] p-8 md:w-1/3">
                <section>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#dbeafe]">
                    Principal Actions
                  </p>
                  <h2 className="mt-4 text-3xl font-bold text-white">
                    School News
                  </h2>
                  <p className="mt-3 text-base text-[#e0f2fe]">
                    Create announcements, updates, and event posts for the school community.
                  </p>
                </section>
              </div>

              <div className="p-8 md:w-2/3">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      Publication Center
                    </p>
                    <p className="mt-1 text-3xl font-bold text-gray-800">
                      News Management
                    </p>
                  </div>

                  <span className="rounded-full bg-sky-100 px-4 py-1 text-sm font-semibold text-sky-700">
                    Frontend Ready
                  </span>
                </div>

                <p className="mb-6 leading-relaxed text-gray-600">
                  Open the principal news form to draft a news item with the required schema fields and preview how it will read before any backend integration.
                </p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                      Required Fields
                    </p>
                    <p className="mt-2 text-base font-semibold text-[#0f172a]">
                      Title, Description, Date, Type, Role
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                      Workflow
                    </p>
                    <p className="mt-2 text-base font-semibold text-[#0f172a]">
                      Draft and preview news posts
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <Link
                    href="/admin/principal/news"
                    className="inline-flex rounded-2xl bg-blue-600 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-700"
                  >
                    Open News Page
                  </Link>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
