"use client";

import "./globals.css";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const pathname = usePathname();
  return (
    <html lang="en">
      <body>
        <nav className="py-2 px-4 border-b flex gap-4">
          <Link href="/" className={pathname === "/" ? "font-bold" : ""}>
            Home
          </Link>
          <Link
            href="/about"
            className={pathname.startsWith("/about") ? "font-bold" : ""}
          >
            About
          </Link>
          <Link
            href="/search"
            className={pathname.startsWith("/search") ? "font-bold" : ""}
          >
            Search
          </Link>
        </nav>
        <main className="p-4">{children}</main>
      </body>
    </html>
  );
}
