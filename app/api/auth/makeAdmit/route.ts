import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "@/lib/prisma-client";

type WardAdmitPayLoad = {
    classId?: string,
    name?: string,
    userId?: string
}

export async function POST(req: Request) {
    let payload: WardAdmitPayLoad = {}
    try {
        payload = (await req.json()) as WardAdmitPayLoad;
    } catch {
        return NextResponse.json({error: "Eronic Payload"}, {status: 400});
    }

    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return NextResponse.json({error: "You must be logged in to submit admission"}, {status: 401});
    }

    let authUser: JwtPayload;

    try {
        authUser = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
        return NextResponse.json({error: "Invalid session"}, {status: 401});
    }

    const name = (payload.name ?? "").trim();
    const classId = (payload.classId ?? "1");
    const userId = String(authUser.id ?? "").trim();

    if (!userId) {
        return NextResponse.json({error: "Parent account could not be resolved"}, {status: 400});
    }

    const admit = await prisma.admission.create({
        data: {
            name,
            classId,
            userId,
        }
    });

    if (admit) return NextResponse.json({success: true});
    else return NextResponse.json({error: "Failed To Save Form"}, {status: 500});
}
