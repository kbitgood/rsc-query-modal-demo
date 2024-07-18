"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

import "./globals.css";

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <nav className="py-2 px-4 border-b flex gap-4">
            <Link
              href="/"
              className={
                "hover:underline " + (pathname === "/" ? "font-bold" : "")
              }
            >
              Home
            </Link>
            <Link
              href="/about"
              className={
                "hover:underline " +
                (pathname.startsWith("/about") ? "font-bold" : "")
              }
            >
              About
            </Link>
            <Link
              href="/search"
              className={
                "hover:underline " +
                (pathname.startsWith("/search") ? "font-bold" : "")
              }
            >
              Search
            </Link>
          </nav>
          <main className="p-4">{children}</main>
        </QueryClientProvider>
      </body>
    </html>
  );
}
