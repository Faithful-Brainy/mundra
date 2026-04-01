import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma-client";
import jwt, { JwtPayload } from "jsonwebtoken";

const registrarRoles = new Set(["REG", "DEV", "PROP"]);
export const dynamic = "force-dynamic";

async function createWardFromAdmission(formData: FormData) {
    "use server";

    const admissionId = String(formData.get("admissionId") ?? "").trim();

    if (!admissionId) {
        return;
    }

    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return;
    }

    let payload: JwtPayload;

    try {
        payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
        return;
    }

    const registrar = await prisma.user.findUnique({
        where: { id: String(payload.id ?? "") },
    });

    if (!registrar || !registrarRoles.has(registrar.role)) {
        return;
    }

    const admission = await (async () => {
        try {
            return await prisma.admission.findUnique({
                where: { id: admissionId },
            });
        } catch {
            return null;
        }
    })();

    if (!admission) {
        return;
    }

    const classId = Number.parseInt(admission.classId, 10);

    if (Number.isNaN(classId)) {
        return;
    }

    const owner = await prisma.user.findFirst({
        where: {
            OR: [
                { id: admission.userId },
                { name: admission.userId },
                { email: admission.userId },
            ],
        },
    });

    if (!owner) {
        return;
    }

    const existingWard = await prisma.ward.findFirst({
        where: {
            name: admission.name,
            classId,
            userId: owner.id,
        },
    });

    if (!existingWard) {
        const ward = await prisma.ward.create({
            data: {
                name: admission.name,
                classId,
                userId: owner.id,
                passKey: admission.id.split("-")[0]?.toUpperCase() ?? "WARDKEY",
            },
        });

        console.log(ward.id)
    }

    revalidatePath(`/admin/registrar/${admissionId}`);
    revalidatePath("/admin/registrar");
}

export default async function AdmissionVerifyPage({
    params
}: {
    params: Promise<{id: string}>;
}) {
    const { id } = await params;
    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return(<div>Access denied.</div>)
    }

    let payload: JwtPayload;

    try {
        payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
        return(<div>Invalid Session</div>)
    }

    const registrar = await prisma.user.findUnique({
        where: { id: String(payload.id ?? "") },
    });

    if (!registrar || !registrarRoles.has(registrar.role)) {
        return(<div>Access denied.</div>)
    }

    const admission = await (async () => {
        try {
            return await prisma.admission.findUnique({
                where: { id },
            });
        } catch {
            return null;
        }
    })();

    if (!admission) return(<div>Admission Unloaded</div>)

    const classId = Number.parseInt(admission.classId, 10);
    const owner = await prisma.user.findFirst({
      where: {
        OR: [
          { id: admission.userId },
          { name: admission.userId },
          { email: admission.userId },
        ],
      },
    });
    const ward = Number.isNaN(classId)
      ? null
      : await prisma.ward.findFirst({
          where: {
            name: admission.name,
            classId,
            userId: owner?.id ?? admission.userId,
          },
        });

    return(
        <main className="min-h-screen bg-[radial-gradient(circle_at_top,#0b2447_0%,#091224_46%,#05070f_100%)] px-4 py-20 md:px-10">
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
                          {owner?.name || owner?.email || admission.userId}
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

                    <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1d4ed8]">
                        Ward Record
                      </p>
                      {ward ? (
                        <div className="mt-3 space-y-2 text-sm text-[#0f172a]">
                          <p className="font-semibold">Ward already created.</p>
                          <p>Ward ID: {ward.id}</p>
                          <p>Pass Key: {ward.passKey}</p>
                        </div>
                      ) : (
                        <div className="mt-3 space-y-4">
                          <p className="text-sm text-gray-600">
                            Create the ward from this admission record. Only the registrar can do this.
                          </p>
                          <form action={createWardFromAdmission}>
                            <input type="hidden" name="admissionId" value={admission.id} />
                            <button
                              type="submit"
                              className="inline-flex rounded-2xl bg-blue-600 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-700"
                            >
                              Create Ward
                            </button>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </article>
        </main>
    );
}
