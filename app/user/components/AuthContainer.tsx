"use client";

import { ReactNode } from "react";

type AuthContainerProps = {
  title: string;
  titleClassName?: string;
  children: ReactNode;
};

export default function AuthContainer({
  title,
  titleClassName,
  children,
}: AuthContainerProps) {
  return (
    <main className="grid min-h-screen place-items-center bg-gradient-to-b from-[rgba(30,60,114,0.8)] to-[rgba(42,82,152,0.8)] px-4 py-20 md:px-12">
      <section className="grid h-auto w-full max-w-[1000px] gap-4 rounded-[3rem] bg-gradient-to-b from-[rgba(187,210,254,0.8)] to-[rgba(120,165,244,0.8)] p-8 text-left text-black md:min-h-[550px] md:p-10">
        <h1 className={titleClassName ?? "font-mono text-4xl md:text-5xl"}>{title}</h1>
        {children}
      </section>
    </main>
  );
}
