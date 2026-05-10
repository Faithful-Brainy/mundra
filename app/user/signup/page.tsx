"use client";

import Link from "next/link";
import { useState } from "react";
import AuthContainer from "../components/AuthContainer";

const roleOptions = [
    { value: "PARENT", label: "Parent" },
    { value: "STUDENT", label: "Student" },
    { value: "TEACHER", label: "Teacher" },
    { value: "ICT", label: "ICT Officer" },
  ];

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [role, setRole] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password, name, role }),
      });

      const data = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(data.error!);
        return;
      }

      setSuccess("Success");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContainer
      title="Make a New Mundra Account"
      titleClassName="font-mono text-3xl md:text-5xl"
    >
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-1">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            placeholder="Name"
            className="rounded-full border border-black px-4 py-2"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Email"
            className="rounded-full border border-black px-4 py-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Password"
            className="rounded-full border border-black px-4 py-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="role">Role</label>
          <select
            id="role"
            className="rounded-full border border-black px-4 py-2"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            {roleOptions.map((roleOp) => (
              <option key={roleOp.value} value={roleOp.value}>
                {roleOp.label}
              </option>
            ))}
          </select>
        </div>


        <button
          className="inline-flex w-full max-w-[281px] items-center justify-center rounded-full border border-[#0f2242] bg-[#0f2242] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_8px_22px_rgba(15,34,66,0.32)] transition-all hover:-translate-y-0.5 hover:bg-[#1e3c72] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-700">You Have Been Registered, Check Your Email Adress For A Verification Link</p>}

      <p>
        Already have one?{" "}
        <Link href="/user/login" className="font-semibold underline">
          Log in instead
        </Link>
      </p>
    </AuthContainer>
  );
}
