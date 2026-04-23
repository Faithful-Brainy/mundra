import prisma from "@/lib/prisma-client";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
    const payload = (await req.json()) as { tableName: string };

    const tableName = payload.tableName;

    const data = await prisma.$queryRaw`SELECT * FROM ${Prisma.raw(tableName)}`

    return NextResponse.json(data);
}