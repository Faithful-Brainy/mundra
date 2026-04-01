import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma-client";
import Link from "next/link";

const activities = [
  { title: "Fee payment batch synced", time: "08:14 AM", tag: "Finance" },
  { title: "Two ward records updated", time: "09:02 AM", tag: "Student Data" },
  { title: "Timetable draft published", time: "10:27 AM", tag: "Academics" },
  { title: "Bus route B-03 adjusted", time: "11:41 AM", tag: "Transport" },
]

const tasks = [
  { task: "Approve new teacher accounts", status: "3 waiting" },
  { task: "Verify class reassignments", status: "5 flagged" },
  { task: "Review weekly attendance anomalies", status: "2 urgent" },
  { task: "Publish circular for guardians", status: "Draft" },
]

const staffPanels = [
  { roleKey: "PRINCIPAL", slug: "principal", role: "Principal", count: await prisma.user.count({ where: {role: "PRINCIPAL"} }), summary: "School strategy, discipline, and final approvals.", action: "Review Decisions" },
  { roleKey: "DIRECTOR", slug: "director", role: "Director", count: await prisma.user.count({ where: {role: "DIRECTOR"} }), summary: "Long-term planning, policy, and institutional growth.", action: "View Strategy" },
  { roleKey: "ASSDIC", slug: "assistant-director", role: "Assistant Director", count: await prisma.user.count({ where: {role: "ASSDIC"} }), summary: "Supports director-level execution and institutional follow-through.", action: "Review Follow-ups" },
  { roleKey: "BURSAR", slug: "bursar", role: "Bursar", count: await prisma.user.count({ where: {role: "BURSAR"} }), summary: "Fee records, payroll prep, and finance reconciliations.", action: "Open Finance Desk" },
  { roleKey: "MANAGER", slug: "school-manager", role: "School Manager", count: "1", summary: "Daily operations, scheduling, and staff coordination.", action: "Check Operations" },
  { roleKey: "VP", slug: "vice-principal", role: "Vice Principal", count: "2", summary: "Academic oversight and supervision of class activities.", action: "Monitor Academics" },
  { roleKey: "TEACHER", slug: "teacher", role: "Teachers", count: await prisma.user.count({ where: { role: "TEACHER" } }), summary: "Lesson delivery, grading, and student mentorship.", action: "Open Staff List", },
  { roleKey: "GIUDE", slug: "guidance-counselor", role: "Guidance Counselor", count: "3", summary: "Student welfare, behavior support, and counseling.", action: "View Cases" },
  { roleKey: "LIB", slug: "librarian", role: "Librarian", count: "2", summary: "Library resources, book lending, and reading programs.", action: "Library Panel" },
  { roleKey: "ICT", slug: "ict-officer", role: "ICT Officer", count: "3", summary: "Lab systems, network access, and device support.", action: "IT Dashboard" },
  { roleKey: "DEV", slug: "admin-controls", role: "Administrator In Dev Mode", count: "1", summary: "Welcome To Dev Panel.", action: "Open Admin Controls" },
  { roleKey: "PROP", slug: "proprietor", role: "Proprietor", count: "1", summary: "Full oversight across academic, operations, and finance.", action: "Open Admin Controls" },
  { roleKey: "REG", slug: "registrar", role: "Registratin Manager", count: "1", summary: "Registry of New Students", action: "Open Panel" },
]

const actionButtons = [
  {
    label: "Add Announcement",
    className:
      "rounded-full border border-[#38bdf8]/50 bg-[#0c4a6e] px-5 py-2.5 text-sm font-semibold text-[#e0f2fe] transition-colors hover:bg-[#075985]",
  },
  {
    label: "Export Reports",
    className:
      "rounded-full border border-[#1d4ed8]/60 bg-[#1e3a8a] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1d4ed8]",
  },
]

const cardTitleClass = "font-[Poppins,Montserrat,sans-serif] text-2xl font-semibold text-[#e0f2fe]"
const panelCardClass = "rounded-2xl border border-[#7dd3fc]/20 bg-[#0d234d] p-4 shadow-[0_10px_24px_rgba(2,6,23,0.28)]"

export default async function Admin() {
  const token = (await cookies()).get("token")?.value
  if (!token) return <div>Are You Logged In?</div>

  let payload: JwtPayload
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
  } catch {
    return <div>Invalid Session</div>
  }

  const user = await prisma.user.findUnique({ where: { id: payload.id } })
  if (!user) return <div>User not loaded.</div>
  if (["STUDENT", "PARENT"].includes(user.role)) return <div>Access denied. Admin page is not available for your role.</div>

  const isAdmin = ["DEV", "PROP"].includes(user.role)
  const visiblePanels = isAdmin ? staffPanels : staffPanels.filter((panel) => panel.roleKey === user.role)

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0b2447_0%,#091224_46%,#05070f_100%)] px-4 py-20 md:px-10">
      <section className="mx-auto w-full max-w-7xl rounded-[2.25rem] border border-[#38bdf8]/35 bg-[#0b1f44] p-6 text-white shadow-[0_26px_90px_rgba(2,6,23,0.65)] md:p-10">
        <header className="flex flex-col gap-5 border-b border-[#38bdf8]/25 pb-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-[Montserrat,Segoe_UI,sans-serif] text-xs uppercase tracking-[0.28em] text-[#7dd3fc]">Mundra Admin Console</p>
            <h1 className="mt-2 font-[Poppins,Montserrat,sans-serif] text-3xl font-semibold text-[#e0f2fe] md:text-5xl">Control Center</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#cbd5e1] md:text-base">
              Welcome back, {user.name ?? "Admin"}. Your active role is {user.role}.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {actionButtons.map((button) => (
              <button key={button.label} type="button" className={button.className}>
                {button.label}
              </button>
            ))}
          </div>
        </header>

        {isAdmin && (
          <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          </section>
        )}

        <section className="mt-8 rounded-3xl border border-[#38bdf8]/25 bg-[#102a57] p-6">
          <div className="flex flex-col gap-2 border-b border-[#7dd3fc]/20 pb-4">
            <h2 className={cardTitleClass}>{isAdmin ? "School Staff Panels" : `${user.role} Panel`}</h2>
            <p className="text-sm text-[#bfdbfe]">Frontend preview based on your role from schema. No backend wiring included.</p>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {visiblePanels.map((panel) => (
              <article key={panel.role} className={panelCardClass}>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-[Poppins,Montserrat,sans-serif] text-lg font-semibold text-[#dbeafe]">{panel.role}</h3>
                  <span className="rounded-full border border-[#38bdf8]/35 bg-[#0f172a] px-3 py-1 text-xs font-semibold text-[#7dd3fc]">{panel.count}</span>
                </div>
                <p className="mt-2 text-sm text-[#bfdbfe]">{panel.summary}</p>
                <br />
                <Link
                  type="button"
                  className="mt-4 rounded-full border border-[#38bdf8]/45 bg-[#0c4a6e] px-4 py-2 text-xs font-semibold text-[#e0f2fe] transition-colors hover:bg-[#075985]"
                  href={`/admin/${panel.slug}`}
                >
                  {panel.action}
                </Link>
              </article>
            ))}
            {visiblePanels.length === 0 && (
              <article className={panelCardClass}>
                <h3 className="font-[Poppins,Montserrat,sans-serif] text-lg font-semibold text-[#dbeafe]">No Panel Defined</h3>
                <p className="mt-2 text-sm text-[#bfdbfe]">No UI panel is configured yet for role: {user.role}.</p>
              </article>
            )}
          </div>
        </section>

        {isAdmin && (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
            <article className="rounded-3xl border border-[#38bdf8]/25 bg-[#102a57] p-6">
              <h2 className={cardTitleClass}>Recent Activity</h2>
              <ul className="mt-5 grid gap-3">
                {activities.map((item) => (
                  <li
                    key={item.title}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#7dd3fc]/20 bg-[#0d234d] px-4 py-3"
                  >
                    <div>
                      <p className="text-sm font-semibold text-[#dbeafe]">{item.title}</p>
                      <p className="text-xs text-[#93c5fd]">{item.tag}</p>
                    </div>
                    <span className="rounded-full bg-[#0f172a] px-3 py-1 text-xs font-medium text-[#7dd3fc]">{item.time}</span>
                  </li>
                ))}
              </ul>
            </article>

            <article className="rounded-3xl border border-[#38bdf8]/25 bg-[#102a57] p-6">
              <h2 className={cardTitleClass}>Admin Tasks</h2>
              <ul className="mt-5 grid gap-3">
                {tasks.map((item) => (
                  <li key={item.task} className="rounded-2xl border border-[#7dd3fc]/20 bg-[#0d234d] px-4 py-3">
                    <p className="text-sm font-semibold text-[#dbeafe]">{item.task}</p>
                    <p className="mt-1 text-xs text-[#7dd3fc]">{item.status}</p>
                  </li>
                ))}
              </ul>
            </article>
          </section>
        )}
      </section>
    </main>
  )
}
