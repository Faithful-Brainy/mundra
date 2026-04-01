import { cookies } from "next/headers";
import WardCard from "./components/WardCard";
import prisma from "@/lib/prisma-client";
import jwt, { JwtPayload } from "jsonwebtoken";
import Link from "next/link";

export default async function Wards() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return <div>Not logged in.</div>;
  }

  let payload: JwtPayload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  } catch {
    return <div>Invalid session.</div>;
  }

  const id = String(payload.id ?? "");

  if (!id) {
    return <div>Invalid session.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      wards: true,
    },
  });

  if (!user) {
    return <div>User Not found.</div>;
  }

  return (
    <ul>
      {user.wards.map((ward) => (
        <li key={ward.id}>
          <WardCard ward={ward} />
        </li>
      ))}

      <li className="px-4 pb-8">
        <Link
          href={`/user/${user.id}`}
          className="inline-flex rounded-full bg-[#0f2242] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e3c72]"
        >
          Fetch Another Ward
        </Link>
      </li>
    </ul>
  );
}
