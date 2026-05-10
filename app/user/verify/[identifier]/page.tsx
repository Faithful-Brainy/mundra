import Link from "next/link";

export default async function VerificationPage({
  params,
}: {
  params: Promise<{ identifier: string }>;
}) {
    const param = await params;
    const identifier = param.identifier;

    const res = await fetch("/api/auth/verifyUser", {
        method: "POST",
        body: JSON.stringify(identifier)
    })

    if(res.ok) {
        return(
        <h1>This User Has Been Verified, Return To <Link href={`${process.env.BASE_URL}/user/login`}>Login</Link></h1>
    )} else {
        const data = await res.json();

        return(
            <h1>{data.error}</h1>
        )
    }
}