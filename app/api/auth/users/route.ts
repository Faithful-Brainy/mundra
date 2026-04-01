import { NextResponse } from "next/server";

import prisma from "@/lib/prisma-client";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: "Unable to load users" }, { status: 500 });
  }
}
