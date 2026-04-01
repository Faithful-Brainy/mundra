import Link from "next/link";

export default function UserNotLoggedInPage() {
    return(
        <div><Link href={"/user/login"}>YOU ARE NOT LOGGED IN, Click ME to Login NOW!</Link></div>
    )
}