import type { Metadata } from "next";
import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { LANGUAGE_COOKIE_NAME, resolveLanguage } from "@/lib/language";
import "../index.css";

export const metadata: Metadata = {
  title: "Gusto Restaurant",
  description: "Fullstack restaurant showcase and reservation app powered by Next.js, Prisma, PostgreSQL, and JWT.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const language = resolveLanguage(cookieStore.get(LANGUAGE_COOKIE_NAME)?.value);

  return (
    <html lang={language} className="dark" suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <LanguageProvider initialLanguage={language}>{children}</LanguageProvider>
      </body>
    </html>
  );
}
