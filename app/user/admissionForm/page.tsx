"use client";

import { UserScalarFieldEnum } from "@/app/generated/prisma/internal/prismaNamespace";
import { encodeAdmissionSubjectId, formatSubjectName } from "@/lib/admission-subject";
import Link from "next/link";
import { useEffect, useState } from "react";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-[#1e3c72]/30 bg-[#eaf8ff] px-4 py-3 text-sm text-[#0b1324] placeholder:text-[#1e3c72]/70 focus:border-[#0f2242] focus:outline-none";

const relOptions = [
    { value: "PARENT", label: "Parent" },
    { value: "GUARDIAN", label: "Guardian or CareTaker" },
    { value: "ADOPTIVE", label: "Adopted Parent" },
    { value: "KIN", label: "Relative" }
];

export default function AdmissionForm() {
  type SubjectOption = {
    id: number;
    name: string;
  };

  const [name, setName] = useState("");
  const [classId, setClassId] = useState("");
  const [parentAccount, setParentAccount] = useState("");
  const [userId, setUserId] = useState("");
  const [state, setState] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<SubjectOption[]>([]);

  useEffect(() => {
    async function loadCurrentUser() {
      const res = await fetch("/api/auth/getLoginCookie");
      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.user) {
        return;
      }

      setParentAccount(data.user.name ?? data.user.email ?? "");
      setUserId(data.user.id);
    }

    async function loadSubjects() {
      const res = await fetch("/api/getAllFromTable", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tableName: "ClassAdmit" }),
      });

      const data = await res.json().catch(() => []);

      if (!res.ok || !Array.isArray(data)) {
        return;
      }

      setClasses(data);
    }

    loadCurrentUser();
    loadSubjects();
  }, []);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault()
    setLoading(true);
    setSuccess(false);

    if (!classId) {
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/makeAdmit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, classId, userId }),
    });

    if (res.ok) {setSuccess(true); setLoading(false);}
    else {setLoading(false); setSuccess(false);}
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#030712] via-[#0f2242] to-[#1e3c72] px-4 py-20 md:px-10">
      <section className="mx-auto w-full max-w-6xl rounded-[2.2rem] border border-[#7dd3fc]/35 bg-[#60a5fa] p-6 text-black shadow-[0_24px_80px_rgba(0,0,0,0.42)] md:p-10">
        <header className="grid gap-4 border-b border-[#1e3c72]/20 pb-6 md:grid-cols-[1.5fr_0.9fr] md:items-end">
          <div>
            <span className="inline-flex rounded-full border border-[#1e3c72]/25 bg-[#c8f1ff] px-4 py-2 text-sm font-medium text-[#0f2242]">
              Student Admission Portal
            </span>
            <h1 className="mt-4 font-mono text-3xl font-bold text-[#0f2242] md:text-5xl">
              Admission Form
            </h1>
            <p className="mt-3 max-w-2xl text-base text-[#1e3c72] md:text-lg">
              Complete the student details below to begin a new admission request.
            </p>
          </div>

          <div className="rounded-3xl border border-[#1e3c72]/25 bg-[#dff4ff] p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1e3c72]">
              Form Guide
            </p>
            <p className="mt-3 text-sm leading-6 text-[#0f2242]">
              Fill in the core student, parent, and contact information. 
            </p>
          </div>
        </header>

        <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
          <section className="rounded-3xl border border-[#1e3c72]/25 bg-[#dff4ff] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#0f2242]">Student Information</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-[#0f2242]">
                Full Name
                <input type="text" placeholder="Enter student's full name" className={inputClassName} value={name} onChange={(e) => setName(e.target.value)} />
              </label>

              <label className="text-sm font-medium text-[#0f2242]">
                Class
                <select
                  className={inputClassName}
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    {classes.length > 0 ? "Select a Class" : "Classes Load Failed"}
                  </option>
                  {classes.map((classOp) => (
                    <option key={classOp.id} value={classOp.id.toString()}>
                      {classOp.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-medium text-[#0f2242]">
                Date of Birth
                <input type="date" className={inputClassName} />
              </label>

              <label className="text-sm font-medium text-[#0f2242]">
                Gender
                <select defaultValue="" className={inputClassName}>
                  <option value="" disabled>
                    Select gender
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>

              <label className="text-sm font-medium text-[#0f2242]">
                Previous School
                <input type="text" placeholder="Enter previous school" className={inputClassName} />
              </label>

              <label className="text-sm font-medium text-[#0f2242]">
                State of Origin
                <input type="text" placeholder="Enter state of origin" className={inputClassName} value={state} onChange={(e) => setState(e.target.value)}/>
              </label>

            </div>
          </section>

          <section className="rounded-3xl border border-[#1e3c72]/25 bg-[#dff4ff] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#0f2242]">Parent or Guardian</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-[#0f2242]">
                Parent Account
                <input type="text" className={inputClassName} value={parentAccount} readOnly />
              </label>

              <label className="text-sm font-medium text-[#0f2242]">
                Relationship
                <select className={inputClassName}>
                  {relOptions.map(
                    (relOp) => (
                      <option key={relOp.value} value={relOp.value}>
                        {relOp.label}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="text-sm font-medium text-[#0f2242]">
                Phone Number
                <input type="tel" placeholder="Enter phone number" className={inputClassName} />
              </label>

            </div>
          </section>

          <section className="rounded-3xl border border-[#1e3c72]/25 bg-[#cfefff] p-6">
            <h2 className="text-xl font-semibold text-[#0f2242]">Additional Notes</h2>
            <div className="mt-5 grid gap-4">
              <label className="text-sm font-medium text-[#0f2242]">
                Medical Information or Special Notes
                <textarea
                  rows={5}
                  placeholder="Add allergies, health notes, learning support details, or any other important information."
                  className={`${inputClassName} resize-none`}
                />
              </label>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-full border border-[#0f2242] bg-[#0f2242] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(15,34,66,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#1e3c72] active:translate-y-0"
                  disabled={loading}
                >
                  { loading ? <p>Submitting....</p> : <p>Submit Form</p> }
                </button>

                <Link
                  href="/user"
                  className="inline-flex items-center justify-center rounded-full border border-[#1e3c72]/30 bg-[#eaf8ff] px-6 py-3 text-sm font-semibold text-[#0f2242] transition-colors hover:bg-[#c8f1ff]"
                >
                  Back to Profile
                </Link>
              </div>
            </div>
          </section>
        </form>
        {success && (
          <p className="text-sm font-medium text-[#14532d]">
            Your Form was Submitted to Admin for Verification, You Will be Notified Upon Completion.
          </p>
      )}
      </section>
    </main>
  );
}
