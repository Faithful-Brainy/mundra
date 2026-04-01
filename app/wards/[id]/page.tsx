import prisma from "@/lib/prisma-client";
import WardPage from "../components/WardPage";

export default async function WardEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const ward = await prisma.ward.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!ward) {
    return <div>Ward not found.</div>;
  }

  return <WardPage ward={ward} />;
}
