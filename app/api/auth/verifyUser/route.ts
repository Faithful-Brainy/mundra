import prisma from "@/lib/prisma-client";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    let params: {identifier?: string};

    try{
        params = (await req.json()) as {identifier?: string};
    }catch {
        return NextResponse.json({error: "Invalid Request"}, {status: 400})
    }

    const identifier = params.identifier || "";

    try {
        const user = await prisma.user.findFirst({
            where: {
                OR: [{id: identifier}, {email: identifier}]
            }
        });

        if (!user) {
            throw new Error("UserNotFound");
        }

        const newUser = await prisma.user.update({
            where: {
                id: user.id,
            },

            data: {
                verified: true,
            }
        })

        return NextResponse.json({newUser, success: true}, {status: 201});

    } catch(e: any) {
        if (e.message === "UserNotFound"){
         return NextResponse.json({error: "Failed To Find User, Are You Sure This User Exists?"}, {status: 405});   
        }

        return NextResponse.json({error: "Failed To Verify User. Please Try Again Later"}, {status: 500});
    }
}