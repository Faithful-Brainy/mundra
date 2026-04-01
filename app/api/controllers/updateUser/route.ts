import prisma from "@/lib/prisma-client";
import type { User } from "@prisma/client";
import { NextResponse } from "next/server";
import  jwt  from "jsonwebtoken";

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

type UserPayload = {
    id?: string,
    email?: string,
    name?: string,
    password?: string
    user?: User
    role?: Role
    wardId?: string
}

export async function POST(req: Request) {
    let payload: UserPayload = {}

    try{
        payload = (await req.json()) as UserPayload;
    } catch {
        return NextResponse.json({error: "Payload Request Failed"}, {status: 400})
    }

    const prevUser = (payload.user)
    const id = (payload.id ?? "").trim();
    const wardId = (payload.wardId ?? "").trim();

    if (!id) {
        return NextResponse.json({error: "User ID is required"}, {status: 400});
    }

    const currentUser = await prisma.user.findUnique({
        where: { id },
        include: {
            wards: true,
        }
    });

    if (!currentUser) {
        return NextResponse.json({error: "User not found"}, {status: 404});
    }

    const email = (payload.email ?? prevUser?.email ?? currentUser.email)?.trim();
    const name = (payload.name ?? prevUser?.name ?? currentUser.name ?? "").trim();
    const password = (payload.password ?? prevUser?.password ?? currentUser.password)?.trim();
    const role: Role = (payload.role! ?? prevUser?.role ?? currentUser.role);

    try{
        if (wardId) {
            const ward = await prisma.ward.findUnique({
                where: { id: wardId },
            });

            if (!ward) {
                return NextResponse.json({error: "Ward not found"}, {status: 404});
            }

            if (ward.userId !== id) {
                await prisma.ward.update({
                    where: { id: wardId },
                    data: {
                        userId: id,
                    }
                });
            }
        }

        const userUpdate = await prisma.user.update({
            where: {
                id: id
            },
            data: {
                name,
                email,
                password,
                role,
            },
            include: {
                wards: true
            }
        });

        if (!userUpdate) {
            return NextResponse.json({error: "Failed to Update User"}, {status: 400});
        }

        const token = jwt.sign({
            id: userUpdate.id,
            email: userUpdate.email,
            password: userUpdate.password,
            wards: userUpdate.wards,
            role: userUpdate.role 
        }, process.env.JWT_SECRET!, {expiresIn:"7d"});

        const response = NextResponse.json({ userUpdate, success: true });
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        return response
    } catch (e) {
        return NextResponse.json({error: e}, {status: 500});
    }
}
