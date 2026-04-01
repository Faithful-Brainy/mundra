import prisma from "@/lib/prisma-client";
import { NextResponse } from "next/server";

type WardPayload = {
    id?: string,
    name?: string,
    classId?: number,
    bio?: string
}

export async function POST(req: Request) {
    let payload: WardPayload = {}

    try{
        payload = (await req.json()) as WardPayload;
    } catch {
        return NextResponse.json({error: "Payload Request Failed"}, {status: 400})
    }

    const id = payload.id
    const classId = payload.classId ?? 0
    const name = (payload.name ?? "").trim()
    const bio = (payload.bio ?? "").trim()

    try{
        const wardUpdate = await prisma.ward.update({
            where: {
                id: id
            },
            data: {
                name,
                classId,
                bio,
            }
        });

        if (!wardUpdate) {
            return NextResponse.json({error: "Failed to Update Ward"}, {status: 400});
        }

        return NextResponse.json({ wardUpdate });
    } catch (e) {
        return NextResponse.json({error: e}, {status: 500});
    }
}