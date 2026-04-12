import { NextResponse } from "next/server";
import prisma from "@/lib/prisma-client";

type NewsItemPayload = {
    title?: String,
    desc?: String
    date?: String,
    for?: 
    "PARENT" |
    "SENMAST" |
    "NURCOR" |
    "ASSNURCOR" |
    "HEAD" |
    "ASSHEAD" |
    "STUDENT" |
    "TEACHER" |
    "PRINCIPAL" |
    "REG" |
    "DIRECTOR" |
    "ASSDIC" |
    "BURSAR" |
    "MANAGER" |
    "VP" |
    "GIUDE" |
    "LIB" |
    "ICT" |
    "PROP" |
    "DEV" 
}

export async function POST (req: Request) {
    let payload: NewsItemPayload = {};

    try{
        payload = (await req.json()) as NewsItemPayload;
    } catch (e) {
        return NextResponse.json({error: "Invalid or Eronius Payload"}, {status: 400});
    }

    const title = payload.title as string;
    const desc = payload.desc as string;
    const date = payload.date as string;
    const forRole = payload.for!;

    try {
        const newsItem = await prisma.newsItem.create({
            data: {
                title,
                desc,
                date,
                for: forRole
            }
        })

        return NextResponse.json({success: true}, {status: 200})
    } catch (e) {
        console.error(e)
        return NextResponse.json({error: e}, {status: 500})
    }
}