import prisma from "@/lib/prisma-client";
import { Mail } from "@/lib/email";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

const allowedWardCreators = new Set(["REG", "DEV", "PROP"]);

export type WardPayLoad = {
    classId?: number,
    name?: string,
    userId?: string,
    admissionId?: string,
}

export async function POST(req: Request) {
    let payload: WardPayLoad = {};

    try {
        payload = (await req.json()) as WardPayLoad;
    } catch {
        return NextResponse.json({error: "Eronic Payload"}, {status: 400});
    }

    const token = (await cookies()).get("token")?.value;

    if (!token) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    let jwtPayload: JwtPayload;

    try {
        jwtPayload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    } catch {
        return NextResponse.json({error: "Invalid session"}, {status: 401});
    }

    const registrar = await prisma.user.findUnique({
        where: { id: String(jwtPayload.id ?? "") },
    });

    if (!registrar || !allowedWardCreators.has(registrar.role)) {
        return NextResponse.json({error: "Only the registrar panel or admin dev mode can create wards"}, {status: 403});
    }

    let name = (payload.name ?? "").trim();
    let classId = payload.classId;
    let userId = (payload.userId ?? "").trim();
    let passKey = "WARDKEY";

    const admissionId = (payload.admissionId ?? "").trim();

    if (admissionId) {
        const admission = await prisma.admission.findUnique({
            where: { id: admissionId },
        });

        if (!admission) {
            return NextResponse.json({error: "Admission not found"}, {status: 404});
        }

        name = admission.name.trim();
        classId = Number.parseInt(admission.classId, 10);
        userId = admission.userId.trim();
        passKey = admission.id.split("-")[0]?.toUpperCase() ?? "WARDKEY";
    }

    if (!name || !userId || classId === undefined || Number.isNaN(classId)) {
        return NextResponse.json({error: "Ward details are incomplete"}, {status: 400});
    }

    const owner = await prisma.user.findFirst({
        where: {
            OR: [
                { id: userId },
                { name: userId },
                { email: userId },
            ],
        },
    });

    if (!owner) {
        return NextResponse.json({error: "Parent account not found for this admission"}, {status: 400});
    }

    userId = owner.id;

    const existingWard = await prisma.ward.findFirst({
        where: {
            name,
            classId,
            userId,
        },
    });

    if (existingWard) {
        return NextResponse.json({ ward: existingWard, success: true });
    }

    const ward = await prisma.ward.create({
        data: {
            classId,
            name,
            userId,
            passKey
        },
        include: {
            user: true,
        }
    });

    if (ward) {
        console.log("Attempting to send email to:", ward.user.email);
        const message: string = `
        <h1>Yor Ward Is Officially Registered</h1>
        <h2>Thank You For Registering With Mundra Model Schools</h2>
        <h3>${ward.name}'s info is shown below</h3>
        <ul>
          <li>ID: ${ward.id}</li> 
          <li>Name: ${ward.name}</li> 
          <li>ClassID: ${ward.classId}</li> 
          <li>PassKey: ${ward.passKey}</li>
        </ul>
        <h1><b>Note, DO NOT SHARE ANY INFO SHOWN HERE WITH ANYONE</b></h1> 
        `;
        await Mail("fcdbbrainy@gmail.com","Ward Registration Information", message )
        return NextResponse.json({ ward })
    } else {
        return NextResponse.json({error: "Failed To Create Ward"}, {status: 400})
    }
}
