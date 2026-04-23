"use client";

import { useState } from "react";
import Link from "next/link";

type WardFormProps = {
  user: {
    id: string;
  };
};

export default function WardForm({ user }: WardFormProps) {
  const [wardLookup, setWardLookup] = useState("");
  const [passKey, setPassKey] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setStatus("idle");
    setError("");

    const res = await fetch("/api/auth/getWard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wardId: wardLookup, passKey }),
    });

    const data = await res.json();

    if (!res.ok || !data?.ward?.id) {
      setStatus("error");
      setError(data?.error ?? "Failed to fetch ward.");
      return;
    }

    const updateRes = await fetch("/api/controllers/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: user.id, wardId: data.ward.id }),
    });

    if (!updateRes.ok) {
      const updateData = await updateRes.json().catch(() => null);
      setStatus("error");
      setError(updateData?.error ?? "Failed to add ward to your account.");
      return;
    }

    setStatus("success");
    window.location.reload();
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          type="text"
          placeholder="Enter Ward ID or Name"
          className="rounded border border-[#1e3c72]/40 bg-[#eaf8ff] px-4 py-2 text-[#0b1324] placeholder:text-[#1e3c72]/70 focus:border-[#1e3c72] focus:outline-none"
          value={wardLookup}
          onChange={(e) => {
            setWardLookup(e.target.value);
          }}
        />
        <input
          type="password"
          placeholder="Enter Ward Pass Key"
          className="rounded border border-[#1e3c72]/40 bg-[#eaf8ff] px-4 py-2 text-[#0b1324] placeholder:text-[#1e3c72]/70 focus:border-[#1e3c72] focus:outline-none"
          value={passKey}
          onChange={(e) => {
            setPassKey(e.target.value);
          }}
        />
        <button
          type="submit"
          className="inline-flex w-fit items-center justify-center rounded-full border border-[#0f2242] bg-[#0f2242] px-5 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(15,34,66,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#1e3c72] active:translate-y-0"
        >
          Add Ward
        </button>
      </form>
      {status === "error" && <p className="text-sm font-medium text-[#7f1d1d]">{error}</p>}
      {status === "success" && (
        <p className="text-sm font-medium text-[#14532d]">
          Ward added successfully.
        </p>
      )}
      <br /> 
      <p className="font-semibold text-sm items-center justify-center px-1">If You Have Not Registered Your Child In Mundra Model Schools Yet, Get The <Link href={`./admissionForm`} className="text-[#7f1d1d]">Admission Form</Link></p>
    </main>
  );
}
