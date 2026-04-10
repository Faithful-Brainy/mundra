import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import prisma from "@/lib/prisma-client";

type LoginPayload = {
  email?: string;
  password?: string;
};

export async function POST(req: Request) {
  let payload: LoginPayload = {};

  try {
    payload = (await req.json()) as LoginPayload;
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const identifier = (payload.email ?? "").trim();
  const password = await bcrypt.hash(payload.password!.trim(), 10);

  if (!identifier || !password) {
    return NextResponse.json({ error: "Username/email and password are required" }, { status: 400 });
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        password,
        OR: [{ name: identifier }, { email: identifier }],
      },
      include: {
        wards: true,
      }
    });

    if (!user || !bcrypt.compare(password, user?.password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        name: user.name,
        wards: user.wards,
        password: bcrypt.hash(user.password, 10),
        role: user.role
      },
      process.env.JWT_SECRET!,
      { expiresIn: "7d" },
    );

    const response = NextResponse.json({ user, success: true });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Login Failed!" }, { status: 500 });
  }
}
