"use client";

import { Ward } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

type WardCardProps = {
  ward: Ward | null;
};

export default function WardCard({ ward }: WardCardProps) {
  if (!ward) return null;

  return (
    <div className="flex justify-center p-4">
      <div className="w-[95%] max-w-6xl overflow-hidden rounded-[2.5rem] border border-gray-100 bg-white shadow-2xl transition-transform duration-300 hover:-translate-y-2">
        <div className="flex flex-col md:flex-row">
          <div className="md:w-1/3 relative h-80 md:h-auto">
            <Image
              src={ward.imageUrl || "/chat.png"}
              alt={ward.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-8 md:w-2/3">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{ward.name}</h2>
                <p className="text-blue-600 font-medium">{ward.classId}</p>
              </div>
              <span
                className={`${ward.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"} rounded-full px-4 py-1 text-sm font-semibold`}
              >
                {ward.isActive ? "Active Student" : "Inactive Student"}
              </span>
            </div>

            <p className="mb-6 leading-relaxed text-gray-600">{ward.bio}</p>

            <Link
              href={`/wards/${ward.id}`}
              className="mt-8 rounded-2xl bg-blue-600 px-8 py-3 font-bold text-white transition-colors hover:bg-blue-700"
            >
              See More
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
