"use client";

import { Ward } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

type WardPageProps = {
  ward: Ward;
};

export default function WardPage({ ward }: WardPageProps) {
  const id = ward.id;
  const [name, setName] = useState(ward.name);
  const [className, setClassName] = useState(ward.classId ?? "");
  const [bio, setBio] = useState(ward.bio ?? "");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    setStatus("idle");

    const res = await fetch("/api/controllers/updateWard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id, name, className, bio }),
    });

    if (!res.ok) {
      setStatus("error");
      return;
    }

    setStatus("success");
    window.location.reload();
  }

  return (
    <div className="flex justify-center p-4">
      <div className="w-[95%] max-w-6xl overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl transition-transform duration-300 hover:-translate-y-2">
        <div className="flex flex-col md:flex-row">
          <div className="relative h-80 md:h-auto md:w-1/3">
            <Image
              src={ward.imageUrl || "/chat.png"}
              alt={ward.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8 md:w-2/3">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{ward.name}</h2>
                <p className="font-medium text-blue-600">{ward.classId}</p>
              </div>
              <span
                className={`${ward.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} rounded-full px-4 py-1 text-sm font-semibold`}
              >
                {ward.isActive ? "Active Student" : "Inactive Student"}
              </span>
            </div>

            <p className="mb-6 leading-relaxed text-gray-600">{ward.bio}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-3 border-t p-6 md:p-8">
          <input
            className="rounded border border-gray-300 px-4 py-2 text-blue-700"
            placeholder="Change Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            className="rounded border border-gray-300 px-4 py-2 text-blue-700"
            placeholder="Change Class"
            value={className}
            onChange={(e) => setClassName(e.target.value as unknown as number)}
          />
          <input
            className="rounded border border-gray-300 px-4 py-2 text-blue-700"
            placeholder="Change Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <button
            type="submit"
            className="inline-flex w-fit rounded-full bg-[#0f2242] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1e3c72]"
          >
            Save Changes
          </button>
          {status === "error" && (
            <p className="text-sm text-red-600">Failed to update ward.</p>
          )}
        </form>
      </div>
    </div>
  );
}
