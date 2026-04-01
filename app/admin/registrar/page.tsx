import prisma from "@/lib/prisma-client";
import { Admission } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RegistrarPage() {
  const admissions = await (async () => {
    try {
      return await prisma.admission.findMany({
        orderBy: { id: "desc" },
      });
    } catch {
      return [];
    }
  })();

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0b2447_0%,#091224_46%,#05070f_100%)] px-4 py-20 md:px-10">
      <section className="mx-auto w-full max-w-7xl rounded-[2.25rem] border border-[#38bdf8]/35 bg-[#0b1f44] p-6 text-white shadow-[0_26px_90px_rgba(2,6,23,0.65)] md:p-10">
        <div>
          <p className="font-[Montserrat,Segoe_UI,sans-serif] text-xs uppercase tracking-[0.28em] text-[#7dd3fc]">
            Welcome Sir!
          </p>
          <h1 className="mt-2 font-[Poppins,Montserrat,sans-serif] text-3xl font-semibold text-[#e0f2fe] md:text-5xl">
            Registrar
          </h1>

          <div className="mt-8 flex flex-wrap gap-3">
            <div className="rounded-full border border-[#38bdf8]/50 bg-[#0c4a6e] px-5 py-2.5 text-sm font-semibold text-[#e0f2fe]">
              Pending Registration Requests: {admissions.length}
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6">
          {admissions.length === 0 ? (
            <div className="rounded-[2rem] border border-dashed border-[#7dd3fc]/35 bg-[#0f274f] p-10 text-center text-[#bae6fd]">
              No admission requests found yet.
            </div>
          ) : (
            admissions.map((admission: Admission) => (
              <article
                key={admission.id}
                className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white text-[#0f172a] shadow-2xl transition-transform duration-300 hover:-translate-y-2"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="flex min-h-80 items-end bg-[linear-gradient(180deg,#38bdf8_0%,#2563eb_58%,#0f172a_100%)] p-8 md:w-1/3">
                    <section>
                      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#dbeafe]">
                        Admission Request
                      </p>
                      <h2 className="mt-4 text-3xl font-bold text-white">
                        {admission.name}
                      </h2>
                      <p className="mt-3 text-base text-[#e0f2fe]">
                        Request #{admission.id}
                      </p>
                      <p className="mt-2 text-sm text-[#bfdbfe]">
                        Class ID: {admission.classId}
                      </p>
                    </section>
                  </div>

                  <div className="p-8 md:w-2/3">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-blue-600">
                          Admission Intake
                        </p>
                        <p className="mt-1 text-3xl font-bold text-gray-800">
                          {admission.name}
                        </p>
                      </div>

                      <span className="rounded-full bg-amber-100 px-4 py-1 text-sm font-semibold text-amber-700">
                        Pending Review
                      </span>
                    </div>

                    <p className="mb-6 leading-relaxed text-gray-600">
                      Review the submitted admission details below and confirm that the student profile information is ready for the next step.
                    </p>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                          Parent / Guardian
                        </p>
                        <p className="mt-2 text-base font-semibold text-[#0f172a]">
                          {admission.userId}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                          State
                        </p>
                        <p className="mt-2 text-base font-semibold text-[#0f172a]">
                          {admission.state || "Not provided"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                          Gender
                        </p>
                        <p className="mt-2 text-base font-semibold text-[#0f172a]">
                          {admission.gend || "Not provided"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                          Relationship
                        </p>
                        <p className="mt-2 text-base font-semibold text-[#0f172a]">
                          {admission.rel || "Not provided"}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                          Class ID
                        </p>
                        <p className="mt-2 text-base font-semibold text-[#0f172a]">
                          {admission.classId}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                          Date of Birth
                        </p>
                        <p className="mt-2 text-base font-semibold text-[#0f172a]">
                          {admission.dob
                            ? admission.dob.toLocaleDateString()
                            : "Not provided"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8">
                      <Link href={`./registrar/${admission.id}`} className="inline-flex rounded-2xl bg-blue-600 px-8 py-3 font-bold text-white">
                        Verify
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
