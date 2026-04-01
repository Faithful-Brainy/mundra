import Link from "next/link";
import prisma from "@/lib/prisma-client";
import {
  getTeacherAccounts,
  getTeacherAdminViewer,
  teacherPanelSections,
} from "./lib";

function getInitials(name?: string | null) {
  return (name ?? "Teacher")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function TeacherAdminPage() {
  const viewer = await getTeacherAdminViewer();

  if (!viewer) {
    return <div>Access denied.</div>;
  }

  const [teachers, wardCount] = await Promise.all([
    getTeacherAccounts(),
    prisma.ward.count(),
  ]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#082f49_0%,#0f172a_44%,#020617_100%)] px-4 py-20 md:px-10">
      <section className="mx-auto w-full max-w-7xl rounded-[2.25rem] border border-cyan-300/25 bg-[#071b32] p-6 text-white shadow-[0_26px_90px_rgba(2,6,23,0.65)] md:p-10">
        <header className="border-b border-cyan-300/15 pb-8">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
            Teacher Admin Desk
          </p>
          <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="font-[Poppins,Montserrat,sans-serif] text-3xl font-semibold text-cyan-50 md:text-5xl">
                Teacher Accounts
              </h1>
              <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
                View every teacher account already stored in the database and open a
                teacher panel by user ID. Each panel now includes spaces for
                scoresheet work, student reports, attendance, and more.
              </p>
            </div>

            <Link
              href="/admin"
              className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-950/70 px-5 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-900"
            >
              Back To Admin
            </Link>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-cyan-300/20 bg-cyan-950/30 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
              Total Teachers
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">
              {teachers.length}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Live teacher accounts from the `User` table where role is `TEACHER`.
            </p>
          </article>

          <article className="rounded-3xl border border-cyan-300/20 bg-cyan-950/30 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
              Ward Records
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">{wardCount}</p>
            <p className="mt-2 text-sm text-slate-300">
              Current student records available for teacher workflows.
            </p>
          </article>

          <article className="rounded-3xl border border-cyan-300/20 bg-cyan-950/30 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
              Ready Modules
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">
              {teacherPanelSections.length}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Scoresheet, student report, attendance, and more are already mapped into each teacher panel.
            </p>
          </article>
        </section>

        <section className="mt-8 grid gap-6 xl:grid-cols-[1.55fr_0.95fr]">
          <article className="rounded-[2rem] border border-cyan-300/20 bg-[#0b223f] p-6">
            <div className="flex flex-col gap-2 border-b border-cyan-300/15 pb-4">
              <h2 className="font-[Poppins,Montserrat,sans-serif] text-2xl font-semibold text-cyan-50">
                Teacher List
              </h2>
              <p className="text-sm text-slate-300">
                Open any teacher panel with the database ID route:
                {" "}
                <span className="font-semibold text-cyan-200">
                  /admin/teacher/[id]
                </span>
              </p>
            </div>

            <div className="mt-5 grid gap-4">
              {teachers.length === 0 ? (
                <div className="rounded-[1.75rem] border border-dashed border-cyan-300/25 bg-cyan-950/20 p-8 text-center text-slate-300">
                  No teacher accounts exist in the database yet.
                </div>
              ) : (
                teachers.map((teacher: any) => (
                  <Link
                    key={teacher.id}
                    href={`/admin/teacher/${teacher.id}`}
                    className="group rounded-[1.75rem] border border-cyan-300/15 bg-cyan-950/20 p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-cyan-300/40 hover:bg-cyan-950/35"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-200/25 bg-cyan-400/10 text-lg font-semibold text-cyan-100">
                          {getInitials(teacher.name)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {teacher.name ?? "Unnamed Teacher"}
                          </h3>
                          <p className="text-sm text-cyan-200">{teacher.email}</p>
                          <p className="mt-2 line-clamp-2 text-sm text-slate-300">
                            {teacher.bio ?? "No teacher bio added yet."}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-start gap-2 md:items-end">
                        <span className="rounded-full border border-cyan-300/20 bg-slate-950/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                          {teacher.role}
                        </span>
                        <span className="text-xs text-slate-400">
                          ID: {teacher.id}
                        </span>
                        <span className="text-sm font-semibold text-cyan-100">
                          Open Teacher Panel
                        </span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </article>

          <aside className="rounded-[2rem] border border-cyan-300/20 bg-[#0b223f] p-6">
            <div className="border-b border-cyan-300/15 pb-4">
              <h2 className="font-[Poppins,Montserrat,sans-serif] text-2xl font-semibold text-cyan-50">
                Panel Modules
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Every teacher panel comes with these work areas ready in the UI.
              </p>
            </div>

            <div className="mt-5 grid gap-3">
              {teacherPanelSections.map((section) => (
                <article
                  key={section.id}
                  className="rounded-3xl border border-cyan-300/15 bg-cyan-950/20 p-4"
                >
                  <h3 className="text-base font-semibold text-white">
                    {section.title}
                  </h3>
                  <p className="mt-2 text-sm text-slate-300">{section.summary}</p>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-3xl border border-emerald-300/20 bg-emerald-950/25 p-4 text-sm text-emerald-100">
              Signed in as {viewer.name ?? viewer.email} ({viewer.role}).
            </div>
          </aside>
        </section>
      </section>
    </main>
  );
}
