"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { useEffect, useState } from "react";
import { Role, User } from "@prisma/client";

type LoginCookieResponse = {
  isLoggedIn?: boolean;
  user?: User;
};

export default function Header() {
  const [isHover, setIsHover] = useState(false);
  const [user, setUser] = useState<User>();
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    fetch("/api/auth/getLoginCookie", {
      method: "GET",
    })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: LoginCookieResponse | null) => {
        if (data?.isLoggedIn && data.user) {
          setUser(data.user);
          setIsLoggedIn(true);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const navItems = [
    { href: "/", label: "Home" },
    { href: user?.id ? `/user/${user.id}` : "/user/login", label: isLoggedIn ? "Profile" : "Log In" },
    { href: "/wards", label: !["STUDENT"].includes(user?.role!) ? "Admissions" : "" },
    { href: "/settings", label: "Settings" },
    { href: "/news", label: "News" },
    { href: "/admin", label: !["PARENT","STUDENT"].includes(user?.role!) || !isLoggedIn ? "Admin" : "" },
  ];

  return (
    <header
      className={`fixed top-0 z-[1000] w-full bg-gradient-to-br from-[#1e3c72] to-[#2a5298] py-4 text-white shadow-[0_2px_10px_rgba(0,0,0,0.1)] transition-opacity ${isHover ? "opacity-100" : "opacity-0"}`}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
    >
      <div className="mx-auto max-w-[1200px] px-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-[1.8rem] font-bold font-[Montserrat,Arial,sans-serif]">
            <Image
              src={logo}
              priority
              alt="The Logo Of Mundra Symbolizing Strength and Goodwill"
              width={50}
              height={50}
              className="block"
            />
            Mundra Model Schools
          </div>
          <nav className="hidden md:block">
            <ul className="flex list-none gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="font-medium text-white no-underline transition-colors duration-300 hover:text-[#87CEEB]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <button className="block cursor-pointer bg-none text-[1.5rem] text-white md:hidden">
            <i className="fas fa-bars" />
          </button>
        </div>
      </div>
    </header>
  );
}
