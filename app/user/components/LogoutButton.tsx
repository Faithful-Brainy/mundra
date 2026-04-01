"use client";

import { useState } from "react";

export default function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    if (isLoading) return;
    setIsLoading(true);

    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } finally {
      window.location.href = "/user/login";
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="rounded-full border border-[#0f2242] bg-[#0f2242] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e3c72] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
}
