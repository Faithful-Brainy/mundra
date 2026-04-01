import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma-client";

type SignupPayload = {
  email?: string;
  password?: string;
  name?: string;
  role?: string;
};

const validRoles = new Set(Object.values(Role));

function normalizeRole(role?: string): Role {
  if (role && validRoles.has(role as Role)) {
    return role as Role;
  }

  return Role.PARENT;
}

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
  const role = normalizeRole(payload.role);

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
        role: role,
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
