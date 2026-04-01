import { NextResponse } from "next/server";
import prisma from "@/lib/prisma-client";

enum Role {
  PARENT,
  SENMAST,
  NURCOR,
  ASSNURCOR,
  HEAD,
  ASSHEAD,
  STUDENT,
  TEACHER,
  PRINCIPAL,
  REG,
  DIRECTOR,
  ASSDIC,
  BURSAR,
  MANAGER,
  VP,
  GIUDE,
  LIB,
  ICT,
  PROP,
  DEV,
}


type SignupPayload = {
  email?: string;
  password?: string;
  name?: string;
  role?: Role;
};

export async function POST(req: Request) {
  let payload: SignupPayload = {};

  try {
    payload = (await req.json()) as SignupPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const email = (payload.email ?? "").trim().toLowerCase();
  const password = (payload.password ?? "").trim();
  const name = (payload.name ?? "").trim();
  const role: Role = (payload.role!);

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  try {
    const existingUser = await prisma.user.findFirst({
      where: { email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 });
    }

    const newUser = await prisma.user.create({
      data: {
        name: name || email.split("@")[0] || "Unnamed",
        email,
        password,
        role,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Signup failed" }, { status: 500 });
  }
}
