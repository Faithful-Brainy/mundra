import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { cookies } from "next/headers";

export default async function SectionHero() {
  let loggedIn: boolean;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) loggedIn = false;
  else loggedIn = true;

  return (
    <section
      id="home"
      className="mt-20 flex min-h-screen items-center text-center text-white [background-image:linear-gradient(rgba(30,60,114,0.8),rgba(42,82,152,0.8)),url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20viewBox=%220%200%201200%20800%22%3E%3Crect%20fill=%22%23f0f8ff%22%20width=%221200%22%20height=%22800%22/%3E%3Crect%20fill=%22%232a5298%22%20x=%22100%22%20y=%22200%22%20width=%22300%22%20height=%22400%22%20opacity=%220.1%22/%3E%3Crect%20fill=%22%231e3c72%22%20x=%22800%22%20y=%22150%22%20width=%22250%22%20height=%22500%22%20opacity=%220.1%22/%3E%3Ccircle%20fill=%22%2387ceeb%22%20cx=%22600%22%20cy=%22400%22%20r=%22150%22%20opacity=%220.1%22/%3E%3C/svg%3E')]"
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="text-center">
          <div className="flex min-h-[10vh] w-full items-center justify-center">
            <Image
              src={logo}
              priority
              alt="The Logo Of Mundra Symbolizing Strength and Goodwill"
              width={400}
              height={400}
            />
          </div>
          <h1 className="mb-4 text-[2.5rem] font-[Montserrat,Arial,sans-serif] animate-[slideDown_1s_ease-out] max-md:text-[2.5rem]">
            Welcome to Mundra Model Schools E-Platform
          </h1>
          <p className="mb-8 text-[1.3rem] animate-[slideUp_1s_ease-out] max-md:text-[1.1rem]">
            Nurturing Excellence, Building Tomorrow&apos;s Leaders
          </p>
          <div className="flex flex-wrap justify-center gap-4 max-md:flex-col max-md:items-center">
            {!loggedIn && <Link
              href="/user/login"
              className="inline-block rounded-full bg-[#87CEEB] px-[30px] py-[15px] font-bold text-[#1e3c72] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#5DADE2]"
            >
              Sign In
            </Link> }
            <Link
              href="/wards/components"
              className="inline-block rounded-full border-2 border-white bg-transparent px-[30px] py-[15px] font-bold text-white transition-all duration-300 hover:bg-white hover:text-[#1e3c72]"
            >
              Learn More
            </Link>
            <Link
              href="/feedback"
              className="inline-block rounded-full border-2 border-white bg-transparent px-[30px] py-[15px] font-bold text-white transition-all duration-300 hover:bg-white hover:text-[#1e3c72]"
            >
              Send Feedback
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
