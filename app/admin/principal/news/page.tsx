"use client";

import Link from "next/link";
import { useState } from "react";

const inputClassName =
  "mt-2 w-full rounded-2xl border border-[#1e3c72]/30 bg-[#eaf8ff] px-4 py-3 text-sm text-[#0b1324] placeholder:text-[#1e3c72]/70 focus:border-[#0f2242] focus:outline-none";

const newsTypeOptions = [
  { value: "ANNOUNCEMENT", label: "Announcement" },
  { value: "NEWS", label: "News" },
  { value: "NEWSLETTER", label: "Newsletter" },
  { value: "URGENT", label: "Urgent" },
  { value: "EVENT", label: "Event" },
] as const;

const roleOptions = [
  "PARENT",
  "SENMAST",
  "NURCOR",
  "ASSNURCOR",
  "HEAD",
  "ASSHEAD",
  "STUDENT",
  "TEACHER",
  "PRINCIPAL",
  "REG",
  "DIRECTOR",
  "ASSDIC",
  "BURSAR",
  "MANAGER",
  "VP",
  "GIUDE",
  "LIB",
  "ICT",
  "PROP",
  "DEV",
] as const;

function formatRoleLabel(role: (typeof roleOptions)[number]) {
  return role.replaceAll("_", " ");
}

export default function NewsPage() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [type, setType] = useState<(typeof newsTypeOptions)[number]["value"]>("NEWS");
  const [forRole, setForRole] = useState<(typeof roleOptions)[number]>("PARENT");
  const [success, setSuccess] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState();

  let previewDate = "Select a publication date";

  if (date) {
    const parsedDate = new Date(date);

    previewDate = Number.isNaN(parsedDate.getTime())
      ? date
      : new Intl.DateTimeFormat("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }).format(parsedDate);
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setPending(true);

    const res = await fetch("/api/admin/createNewsItem", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({title, desc, date, type, for: forRole})
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data?.error);
      setSuccess(false);
    } else {
      setSuccess(true);
    }

    setPending(false);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#030712] via-[#0f2242] to-[#1e3c72] px-4 py-20 md:px-10">
      <section className="mx-auto w-full max-w-6xl rounded-[2.2rem] border border-[#7dd3fc]/35 bg-[#60a5fa] p-6 text-black shadow-[0_24px_80px_rgba(0,0,0,0.42)] md:p-10">
        <header className="grid gap-4 border-b border-[#1e3c72]/20 pb-6 md:grid-cols-[1.5fr_0.9fr] md:items-end">
          <div>
            <span className="inline-flex rounded-full border border-[#1e3c72]/25 bg-[#c8f1ff] px-4 py-2 text-sm font-medium text-[#0f2242]">
              Principal News Desk
            </span>
            <h1 className="mt-4 font-mono text-3xl font-bold text-[#0f2242] md:text-5xl">
              News Publication Form
            </h1>
            <p className="mt-3 max-w-2xl text-base text-[#1e3c72] md:text-lg">
            </p>
          </div>

          <div className="rounded-3xl border border-[#1e3c72]/25 bg-[#dff4ff] p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#1e3c72]">
              Form Guide
            </p>
            <p className="mt-3 text-sm leading-6 text-[#0f2242]">
              This page is used for the uploading of news and letters or memos acroos the website, for now this is only accessible ny the principal.
            </p>
          </div>
        </header>

        <form className="mt-8 grid gap-6" onSubmit={handleSubmit}>
          <section className="rounded-3xl border border-[#1e3c72]/25 bg-[#dff4ff] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#0f2242]">
              Publication Details
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-[#0f2242] md:col-span-2">
                News Title
                <input
                  type="text"
                  required
                  placeholder="Enter the headline for this post"
                  className={inputClassName}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </label>

              <label className="text-sm font-medium text-[#0f2242]">
                Publication Date
                <input
                  type="date"
                  required
                  className={inputClassName}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </label>

              <label className="text-sm font-medium text-[#0f2242]">
                News Type
                <select
                  required
                  className={inputClassName}
                  value={type}
                  onChange={(e) =>
                    setType(e.target.value as (typeof newsTypeOptions)[number]["value"])
                  }
                >
                  {newsTypeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-[#1e3c72]/25 bg-[#dff4ff] p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-[#0f2242]">
              Audience & Content
            </h2>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <label className="text-sm font-medium text-[#0f2242]">
                Target Role
                <select
                  required
                  className={inputClassName}
                  value={forRole}
                  onChange={(e) =>
                    setForRole(e.target.value as (typeof roleOptions)[number])
                  }
                >
                  {roleOptions.map((role) => (
                    <option key={role} value={role}>
                      {formatRoleLabel(role)}
                    </option>
                  ))}
                </select>
              </label>

              <div className="rounded-2xl border border-[#1e3c72]/20 bg-[#eaf8ff] p-4 text-sm text-[#0f2242]">
                <p className="font-semibold">Please Fill In This Form Fully</p>
                <p className="mt-2 leading-6 text-[#1e3c72]">
                  Fill in all required information on the news form.
                </p>
              </div>

              <label className="text-sm font-medium text-[#0f2242] md:col-span-2">
                Description
                <textarea
                  required
                  rows={6}
                  placeholder="Write the full news update, announcement details, or event summary."
                  className={`${inputClassName} resize-none`}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                />
              </label>
            </div>
          </section>

          <section className="rounded-3xl border border-[#1e3c72]/25 bg-[#cfefff] p-6">
            <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
              <div>
                <h2 className="text-xl font-semibold text-[#0f2242]">
                  Preview Snapshot
                </h2>
                <article className="mt-5 rounded-3xl border border-[#1e3c72]/20 bg-white p-5 shadow-sm">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="rounded-full bg-[#dce8ff] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[#0f2242]">
                      {type}
                    </span>
                    <time className="text-sm font-medium text-[#1e3c72]/90">
                      {previewDate}
                    </time>
                  </div>
                  <h3 className="text-xl font-bold text-[#0f2242]">
                    {title || "Your news title will appear here"}
                  </h3>
                  <p className="mt-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#1e3c72]">
                    Target: {formatRoleLabel(forRole)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-[#1e3c72]/90">
                    {desc || "Your full news description will be previewed here once you start typing."}
                  </p>
                </article>
              </div>

              <div className="flex flex-col justify-between gap-4">
                <div className="rounded-3xl border border-[#1e3c72]/20 bg-[#eaf8ff] p-5">
                  <h2 className="text-xl font-semibold text-[#0f2242]">
                    Submit Action
                  </h2>
                  <p className="mt-3 text-sm leading-6 text-[#1e3c72]">
                    Submission is local-only right now. This lets you shape the
                    exact admin form UI before we connect it to a database or API.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full border border-[#0f2242] bg-[#0f2242] px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(15,34,66,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#1e3c72] active:translate-y-0"
                    disabled={pending}
                  >
                    { !pending ? "Save News Draft" : "Saving....." }
                  </button>

                  <Link
                    href="/admin/principal"
                    className="inline-flex items-center justify-center rounded-full border border-[#1e3c72]/30 bg-[#eaf8ff] px-6 py-3 text-sm font-semibold text-[#0f2242] transition-colors hover:bg-[#c8f1ff]"
                  >
                    Back to Principal
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </form>

        {success && (
          <p className="mt-6 rounded-2xl border border-[#14532d]/20 bg-[#dcfce7] px-4 py-3 text-sm font-medium text-[#14532d]">
            News draft captured successfully
          </p>
        )}

        {error && (
          <p className="mt-6 rounded-2xl border border-[#14532d]/20 bg-[#dcfce7] px-4 py-3 text-sm font-medium text-[#ffffff]"> News Draft Capture Failed</p>
        )}
      </section>
    </main>
  );
}
