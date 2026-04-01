import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return NextResponse.json({ status: 401, loggedIn: false });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        return NextResponse.json({ isLoggedIn: true, user: user });
    } catch {
        console.error("OOPS");
    }
}