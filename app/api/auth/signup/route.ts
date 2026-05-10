import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import prisma from "@/lib/prisma-client";
import bcrypt from "bcrypt";
import { Mail } from "@/lib/email";

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
  const password = await bcrypt.hash(payload.password!.trim(), 10)
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
        password: true,
        created: true,
      },
    });

    const message = `
    <h6><b>Your Account Has Been Created But Is Not Yet Verified, Please Use The Link Below To Verify Your New Mundra Account:</b></h6><br />

    <a href="${process.env.BASE_URL}/user/verify/${newUser.id || newUser.email}">Verify My Account</a><br />

    <p>Your Account Info:<p>
    <ul>
    <li>Name: ${newUser.name}</li>
    <li>Email Address: ${newUser.email}</li>
    <li>Password: ${newUser.password}</li>
    <li>Created: ${newUser.created.toString()}</li>
    </ul>

    <b><strong>Note: DO NOT SHARE THIS MESSAGE WITH ANYONE LEST YOU RISK THE LOSS OF YOUR ACCOUNT</strong></b>
    `
    await Mail(newUser.email, "Mundra Account Verification", message);
    

    return NextResponse.json({ user: newUser }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Signup Failed" }, { status: 500 });
  }
}
