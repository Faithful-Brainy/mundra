"use client";

import { Role } from "@prisma/client";
import { useState } from "react";
import { User } from "@prisma/client";

type EditableUser = {
  id: string;
  name: string | null;
  email: string;
  password: string;
  role: "PARENT" |
  "SENMAST" |
  "NURCOR" |
  "ASSNURCOR" |
  "HEAD" |
  "ASSHEAD" |
  "STUDENT" |
  "TEACHER" |
  "PRINCIPAL" |
  "DIRECTOR" |
  "ASSDIC" |
  "BURSAR" |
  "MANAGER" |
  "VP" |
  "GIUDE" |
  "LIB" |
  "ICT" |
  "PROP" |
  "DEV" |
  "REG"
};

type UserFormProps = {
  user: EditableUser;
};

export default function UserForm({ user }: UserFormProps) {
  const [name, setName] = useState(user.name ?? "");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState(user.email);
  const [password, setPassword] = useState(user.password ?? "");
  const [role, setRole] = useState(user.role);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const roleOptions: Array<{ value: EditableUser["role"]; label: string }> = [
    { value: "PARENT", label: "Parent" },
    { value: "STUDENT", label: "Student" },
    { value: "TEACHER", label: "Teacher" },
    { value: "PRINCIPAL", label: "Principal" },
    { value: "DIRECTOR", label: "Director" },
    { value: "BURSAR", label: "Bursar" },
    { value: "MANAGER", label: "Manager" },
    { value: "VP", label: "Vice Principal" },
    { value: "GIUDE", label: "Guidance Counselor" },
    { value: "LIB", label: "Librarian" },
    { value: "ICT", label: "ICT Officer" },
    { value: "PROP", label: "Proprietor" },
    { value: "DEV", label: "Dev" },
    { value: "REG", label: "Registrar" },
  ];

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(false);

    const res = await fetch("/api/controllers/updateUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: user.id,
        name,
        email,
        password,
        role,
      }),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    setLoading(false);
    setStatus("success");
    window.location.reload();
  }

  return (
    <main>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input
          type="text"
          placeholder="Change Name"
          className="rounded border border-[#1e3c72]/40 bg-[#eaf8ff] px-4 py-2 text-[#0b1324] placeholder:text-[#1e3c72]/70 focus:border-[#1e3c72] focus:outline-none"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <input
          type="text"
          placeholder="Change Password"
          className="rounded border border-[#1e3c72]/40 bg-[#eaf8ff] px-4 py-2 text-[#0b1324] placeholder:text-[#1e3c72]/70 focus:border-[#1e3c72] focus:outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-fit items-center justify-center rounded-full border border-[#0f2242] bg-[#0f2242] px-5 py-2 text-sm font-semibold text-white shadow-[0_6px_18px_rgba(15,34,66,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#1e3c72] active:translate-y-0"
        >
          { loading ? "Submitting..." : "Submit" }
        </button>
        <br />

        <p className="font-bold text-sm">If You Wish To Change Your Email or Other Status, Contact Us With The Feedback Feature</p>

        {status === "success" && (
          <p className="text-sm font-medium text-[#14532d]">
            You might have to reload the site to see changes.
          </p>
        )}
        {status === "error" && <p className="text-sm font-medium text-[#7f1d1d]">Failed to update.</p>}
      </form>
    </main>
  );
}
