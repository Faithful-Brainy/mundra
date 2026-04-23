import prisma from "@/lib/prisma-client";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const payload: { tableName: string } = (await req.json()) as { tableName: string };

    const tableName = (payload.tableName ?? "").trim();

    try {
        if (tableName === "Subject") {
            const data = await prisma.subject.findMany({
                select: {
                    id: true,
                    name: true,
                },
                orderBy: {
                    id: "asc",
                },
            });

            return NextResponse.json(data);
        }

        if (tableName === "Class") {
            const data = await prisma.class.findMany({
                select: {
                    id: true,
                    name: true,
                    level: true,
                    subLevel: true,
                },
                orderBy: [
                    { level: "asc" },
                    { subLevel: "asc" },
                    { name: "asc" },
                ],
            });

            return NextResponse.json(data);
        }

        return NextResponse.json({error: "Unsupported table"}, {status: 400});
    } catch (e) {
        console.error(e);
        return NextResponse.json({error: "Database Connection Error"}, {status: 500})
    }
}
