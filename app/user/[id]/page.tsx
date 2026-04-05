import prisma from "@/lib/prisma-client";
import UserForm from "../components/UserForm";
import WardForm from "../components/WardForm";
import LogoutButton from "../components/LogoutButton";
import Link from "next/link";
import UserLoadError from "../components/UserLoadError"
import Image from "next/image";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: { wards: true },
  });

  if (!user) {
    return(<UserLoadError />);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#030712] via-[#0f2242] to-[#1e3c72] px-4 py-20 md:px-10">
      <section className="mx-auto w-full max-w-6xl rounded-[2.2rem] border border-[#7dd3fc]/35 bg-[#60a5fa] p-6 text-black shadow-[0_24px_80px_rgba(0,0,0,0.42)] md:p-10">
        <header className="mb-8 grid gap-6 border-b border-[#1e3c72]/20 pb-6 md:grid-cols-[220px_1fr] md:items-center">
          <div className="relative mx-auto h-44 w-44 overflow-hidden rounded-3xl border-4 border-[#bae6fd] shadow-lg md:mx-0 md:h-52 md:w-52">
            <Image
              src={user.imageUrl || "/cookie.png"}
              alt={user.name || "User profile image"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 176px, 208px"
            />
          </div>
          <div>
            <h1 className="font-mono text-3xl font-bold text-[#0f2242] md:text-5xl">
              Welcome Back{user.name ? `, ${user.name}` : ""}
            </h1>
            <p className="mt-2 text-base text-[#1e3c72] md:text-lg">
              Manage your profile and keep track of your wards from one place.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <Link
                href="/wards"
                className="rounded-full bg-[#0f2242] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1e3c72]"
              >
                Manage Wards
              </Link>
              <LogoutButton />
              <span className="rounded-full border border-[#1e3c72]/25 bg-[#c8f1ff] px-4 py-2 text-sm font-medium text-[#0f2242]">
                Total Wards: {user.wards.length}
              </span>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-3xl border border-[#1e3c72]/25 bg-[#dff4ff] p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#0f2242]">Edit Profile</h2>
            <UserForm user={user} />
          </section>

          <section className="rounded-3xl border border-[#1e3c72]/25 bg-[#dff4ff] p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#0f2242]">Fetch a Ward</h2>
            <WardForm user={user} />
          </section>
        </div>

        <section className="mt-8 rounded-3xl border border-[#1e3c72]/25 bg-[#cfefff] p-6">
          <h2 className="mb-4 text-xl font-semibold text-[#0f2242]">Your Wards</h2>
          <ul className="grid gap-3 sm:grid-cols-2">
            {user.wards.map((ward) => (
              <li key={ward.id}>
                <Link
                  href={`/wards/${ward.id}`}
                  className="group flex items-center justify-between rounded-2xl border border-[#1e3c72]/25 bg-[#eaf8ff] px-4 py-3 text-sm font-medium text-[#0f2242] transition-all hover:-translate-y-0.5 hover:border-[#1e3c72] hover:shadow-md"
                >
                  <span className="truncate">
                    {ward.name} <span className="text-[#1e3c72]/70">({ward.classId})</span>
                  </span>
                  <span className="text-[#1e3c72] transition-transform group-hover:translate-x-0.5">
                    View
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          {user.wards.length === 0 && (
            <p className="text-sm text-[#14e3c72]/80">
              No wards added yet. Use the form above to fetch a ward from the school records.
            </p>
          )}
        </section>
      </section>
    </main>
  );
}
