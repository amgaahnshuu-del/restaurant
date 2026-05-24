import type { Metadata } from "next";
import type { ReactNode } from "react";
import "../index.css";

export const metadata: Metadata = {
  title: "Gusto Restaurant",
  description: "Fullstack restaurant showcase and reservation app powered by Next.js, Prisma, PostgreSQL, and JWT.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
