"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import AuthContainer from "../components/AuthContainer";
import { Ward } from "@prisma/client";

export type PublicUser = { id: number; name: string; email: string; password: string; wards: Ward[] | null };

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [users, setUsers] = useState<PublicUser[]>([]);
  const [error, setError] = useState("");
  const [user, setUser] = useState<PublicUser | null>(null);
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/auth/users")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { users?: PublicUser[] } | null) => {
        if (data?.users) {
          setUsers(data.users);
        }
      })
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = (await res.json()) as { error?: string; user?: PublicUser };

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      setUser(data.user ?? null);
      setSuccess("Success");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContainer title="Login">
      <form onSubmit={handleSubmit} className="grid gap-4">
        <div className="grid gap-1">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="text"
            placeholder="Email"
            className="rounded-full border border-black px-4 py-2"
            value={email}
            list="auth-username-list"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          {users.length > 0 && (
            <datalist id="auth-username-list">
              {users.map((user) => (
                <option key={user.id} value={user.email ?? user.name} />
              ))}
            </datalist>
          )}
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

        <button
          className="inline-flex w-full max-w-[281px] items-center justify-center rounded-full border border-[#0f2242] bg-[#0f2242] px-5 py-2.5 text-center text-sm font-semibold text-white shadow-[0_8px_22px_rgba(15,34,66,0.32)] transition-all hover:-translate-y-0.5 hover:bg-[#1e3c72] active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit"}
        </button>

        {user?.id && (
          <Link
            className="w-full max-w-[281px] rounded-3xl bg-black px-4 py-2 text-center text-white disabled:cursor-not-allowed disabled:opacity-70"
            href={`/user/${user.id}`}
          >
            Go to Profile
          </Link>
        )}
      </form>

      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-700">{success}</p>}

      <p>
        No Account?{" "}
        <Link href="/user/signup" className="font-semibold underline">
          Sign Up for One
        </Link>
      </p>
    </AuthContainer>
  );
}
