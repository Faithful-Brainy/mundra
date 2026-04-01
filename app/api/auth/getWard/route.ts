import prisma from "@/lib/prisma-client"
import { NextResponse } from "next/server"

type WardPayload = {
    wardId?: string,
    passKey?: string,
}

export async function POST(req: Request) {
    let payload: WardPayload = {}
    try {
        payload = (await req.json() as WardPayload)
    } catch {
        return NextResponse.json({error: "Invalid ward lookup payload"}, {status: 400});
    }

    const wardId = (payload.wardId ?? "").trim();
    const passKey = (payload.passKey ?? "").trim();

    if (!wardId && !passKey) {
        return NextResponse.json({error: "Ward ID or pass key is required"}, {status: 400});
    }

    const wardLookUp = await prisma.ward.findUnique({
                    where: { id: wardId },
                    select: {
                        id: true,
                        name: true,
                        classId: true,
                        class: true,
                        user: true,
                        imageUrl: true,
                        bio: true,
                        passKey: true
                    }
                });
    
    const ward = passKey === wardLookUp?.passKey ? wardLookUp : null

    if (!ward) return NextResponse.json({error: "Ward Not Loaded"}, {status: 404});

    return NextResponse.json({ ward, success: true, message: "Ward Successfully Loaded" });
}
