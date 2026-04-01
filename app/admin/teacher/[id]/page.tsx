import Link from "next/link";
import prisma from "@/lib/prisma-client";
import {
  getTeacherAccountById,
  getTeacherAdminViewer,
  teacherPanelSections,
} from "../lib";

function getInitials(name?: string | null) {
  return (name ?? "Teacher")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export default async function TeacherPanelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const viewer = await getTeacherAdminViewer();

  if (!viewer) {
    return <div>Access denied.</div>;
  }

  const { id } = await params;

  const [teacher, wardCount, teacherCount] = await Promise.all([
    getTeacherAccountById(id),
    prisma.ward.count(),
    prisma.user.count({ where: { role: "TEACHER" } }),
  ]);

  if (!teacher) {
    return (
      <main className="min-h-screen bg-[radial-gradient(circle_at_top,#082f49_0%,#0f172a_44%,#020617_100%)] px-4 py-20 md:px-10">
        <section className="mx-auto max-w-4xl rounded-[2rem] border border-cyan-300/20 bg-[#071b32] p-8 text-white">
          <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
            Teacher Panel
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-cyan-50">
            Teacher account not found
          </h1>
          <p className="mt-3 text-slate-300">
            No teacher account with ID <span className="font-semibold text-cyan-200">{id}</span> exists in the database.
          </p>
          <Link
            href="/admin/teacher"
            className="mt-6 inline-flex rounded-full border border-cyan-300/40 bg-cyan-950/70 px-5 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-900"
          >
            Back To Teacher List
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#082f49_0%,#0f172a_44%,#020617_100%)] px-4 py-20 md:px-10">
      <section className="mx-auto w-full max-w-7xl rounded-[2.25rem] border border-cyan-300/25 bg-[#071b32] p-6 text-white shadow-[0_26px_90px_rgba(2,6,23,0.65)] md:p-10">
        <header className="border-b border-cyan-300/15 pb-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.75rem] border border-cyan-200/25 bg-cyan-400/10 text-2xl font-semibold text-cyan-50">
                {getInitials(teacher.name)}
              </div>

              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
                  Teacher Panel
                </p>
                <h1 className="mt-2 font-[Poppins,Montserrat,sans-serif] text-3xl font-semibold text-cyan-50 md:text-5xl">
                  {teacher.name ?? "Unnamed Teacher"}
                </h1>
                <p className="mt-3 text-sm text-cyan-100 md:text-base">
                  {teacher.email}
                </p>
                <p className="mt-2 max-w-3xl text-sm text-slate-300 md:text-base">
                  {teacher.bio ?? "No teacher bio added yet."}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/teacher"
                className="inline-flex rounded-full border border-cyan-300/40 bg-cyan-950/70 px-5 py-3 text-sm font-semibold text-cyan-100 transition-colors hover:bg-cyan-900"
              >
                All Teachers
              </Link>
              <Link
                href="/admin"
                className="inline-flex rounded-full border border-slate-400/30 bg-slate-900/50 px-5 py-3 text-sm font-semibold text-slate-100 transition-colors hover:bg-slate-800"
              >
                Admin Home
              </Link>
            </div>
          </div>
        </header>

        <section className="mt-8 grid gap-4 md:grid-cols-3">
          <article className="rounded-3xl border border-cyan-300/20 bg-cyan-950/30 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
              Teacher ID
            </p>
            <p className="mt-3 break-all text-sm font-semibold text-white">
              {teacher.id}
            </p>
          </article>

          <article className="rounded-3xl border border-cyan-300/20 bg-cyan-950/30 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
              Teacher Accounts
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">
              {teacherCount}
            </p>
            <p className="mt-2 text-sm text-slate-300">
              Current teacher account count in the database.
            </p>
          </article>

          <article className="rounded-3xl border border-cyan-300/20 bg-cyan-950/30 p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
              Student Records
            </p>
            <p className="mt-3 text-4xl font-semibold text-white">{wardCount}</p>
            <p className="mt-2 text-sm text-slate-300">
              Available ward records ready for future teacher assignment wiring.
            </p>
          </article>
        </section>

        <section className="mt-8 rounded-[2rem] border border-cyan-300/20 bg-[#0b223f] p-6">
          <div className="flex flex-col gap-2 border-b border-cyan-300/15 pb-4">
            <h2 className="font-[Poppins,Montserrat,sans-serif] text-2xl font-semibold text-cyan-50">
              Teacher Workspaces
            </h2>
            <p className="text-sm text-slate-300">
              Jump into the UI sections prepared for this teacher account.
            </p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {teacherPanelSections.map((section) => (
              <Link
                key={section.id}
                href={`#${section.id}`}
                className="rounded-[1.75rem] border border-cyan-300/15 bg-cyan-950/20 p-5 transition-transform duration-200 hover:-translate-y-1 hover:border-cyan-300/35 hover:bg-cyan-950/35"
              >
                <h3 className="text-lg font-semibold text-white">
                  {section.title}
                </h3>
                <p className="mt-2 text-sm text-slate-300">{section.summary}</p>
                <p className="mt-4 text-sm font-semibold text-cyan-100">
                  Open Section
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-5">
          {teacherPanelSections.map((section) => (
            <article
              id={section.id}
              key={section.id}
              className="rounded-[2rem] border border-cyan-300/20 bg-[#0b223f] p-6"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-cyan-300">
                    {teacher.name ?? "Teacher"} Workspace
                  </p>
                  <h3 className="mt-2 text-2xl font-semibold text-cyan-50">
                    {section.title}
                  </h3>
                  <p className="mt-3 max-w-3xl text-sm text-slate-300 md:text-base">
                    {section.summary}
                  </p>
                </div>

                <div className="rounded-full border border-emerald-300/20 bg-emerald-950/25 px-4 py-2 text-sm font-semibold text-emerald-100">
                  UI ready
                </div>
              </div>

              <div className="mt-5 grid gap-3 md:grid-cols-3">
                {section.points.map((point) => (
                  <div
                    key={point}
                    className="rounded-3xl border border-cyan-300/15 bg-slate-950/25 p-4 text-sm text-slate-200"
                  >
                    {point}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-[2rem] border border-amber-300/20 bg-amber-950/20 p-5 text-sm text-amber-100">
          Signed in as {viewer.name ?? viewer.email} ({viewer.role}). The
          teacher panel is reading live teacher accounts from Prisma without
          using API endpoints.
        </section>
      </section>
    </main>
  );
}
