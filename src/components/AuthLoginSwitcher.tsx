"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import LoginForm from "@/app/login/LoginForm"
import CustomerLoginForm from "@/app/account/login/CustomerLoginForm"
import { useLanguage } from "@/contexts/LanguageContext"

type Role = "customer" | "admin" | "staff"

const copy = {
  en: {
    eyebrow: "One login for customers, staff, and admins",
    title: "Sign in",
    description:
      "Choose your access level below. Customers manage reservations, staff handle operations, and admins manage the floor.",
    customer: "Customer",
    staff: "Staff",
    admin: "Admin",
    customerHint: "Book tables, review reservations, and manage your profile.",
    staffHint: "Handle walk-ins, phone bookings, and guest check-ins.",
    adminHint: "Review bookings and manage restaurant operations.",
  },
  mn: {
    eyebrow: "Үйлчлүүлэгч, ажилтан болон админ нэг нэвтрэлттэй",
    title: "Нэвтрэх",
    description:
      "Доороос өөрийн эрхээ сонгоно уу. Үйлчлүүлэгч захиалгаа, ажилтан үйл ажиллагааг, админ танхимаа удирдана.",
    customer: "Хэрэглэгч",
    staff: "Ажилтан",
    admin: "Админ",
    customerHint: "Ширээ захиалж, захиалгаа шалгаж, профайлаа удирдана.",
    staffHint: "Walk-in, утасны захиалга болон зочдын бүртгэлийг хийнэ.",
    adminHint: "Захиалгыг шалгаж, рестораны ажиллагааг удирдана.",
  },
} as const

const AuthLoginSwitcher = () => {
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const roleParam = searchParams.get("role")
  const defaultEmail = searchParams.get("email") || ""
  const [role, setRole] = useState<Role>(
    roleParam === "admin" ? "admin" : roleParam === "staff" ? "staff" : "customer"
  )
  const content = copy[language]

  useEffect(() => {
    if (roleParam === "admin" || roleParam === "staff" || roleParam === "customer") {
      setRole(roleParam)
    }
  }, [roleParam])

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,hsl(40_60%_95%/.9),transparent_36%),linear-gradient(180deg,hsl(40_36%_97%/.7),hsl(36_28%_91%/.95))] px-4 py-16 dark:bg-[radial-gradient(circle_at_top,hsl(20_14%_14%/.72),transparent_36%),linear-gradient(180deg,hsl(20_14%_8%/.92),hsl(18_16%_6%/.98))]">
      <div className="mx-auto flex w-full max-w-2xl flex-col items-stretch gap-6">
        <div className="rounded-[32px] border border-border/70 bg-white/82 p-8 shadow-[0_24px_70px_hsl(28_25%_35%/.12)] backdrop-blur-md dark:border-white/10 dark:bg-white/[0.04] dark:shadow-[0_24px_70px_hsl(0_0%_0%/.28)]">
          <div className="text-center">
            <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-primary/80">
              {content.eyebrow}
            </p>
            <h1 className="mt-4 text-4xl font-light text-foreground md:text-5xl">
              {content.title}
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-muted-foreground/82 md:text-base">
              {content.description}
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`rounded-full border px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.24em] transition ${
                role === "customer"
                  ? "border-primary/30 bg-primary text-primary-foreground shadow-[0_12px_24px_hsl(40_60%_50%/.18)]"
                  : "border-border/70 bg-white/70 text-foreground hover:border-primary/25 hover:text-primary dark:border-white/10 dark:bg-white/[0.04]"
              }`}
            >
              {content.customer}
            </button>
            <button
              type="button"
              onClick={() => setRole("staff")}
              className={`rounded-full border px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.24em] transition ${
                role === "staff"
                  ? "border-primary/30 bg-primary text-primary-foreground shadow-[0_12px_24px_hsl(40_60%_50%/.18)]"
                  : "border-border/70 bg-white/70 text-foreground hover:border-primary/25 hover:text-primary dark:border-white/10 dark:bg-white/[0.04]"
              }`}
            >
              {content.staff}
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`rounded-full border px-5 py-2.5 font-sans text-[11px] uppercase tracking-[0.24em] transition ${
                role === "admin"
                  ? "border-primary/30 bg-primary text-primary-foreground shadow-[0_12px_24px_hsl(40_60%_50%/.18)]"
                  : "border-border/70 bg-white/70 text-foreground hover:border-primary/25 hover:text-primary dark:border-white/10 dark:bg-white/[0.04]"
              }`}
            >
              {content.admin}
            </button>
          </div>

          <div className="mt-5 rounded-[24px] border border-primary/10 bg-primary/[0.04] px-5 py-4 text-center">
            <p className="text-sm font-medium text-foreground">
              {role === "customer" ? content.customerHint : role === "staff" ? content.staffHint : content.adminHint}
            </p>
          </div>

          <div className="mt-8">
            {role === "customer" ? <CustomerLoginForm defaultEmail={defaultEmail} /> : <LoginForm defaultEmail={defaultEmail} />}
          </div>
        </div>
      </div>
    </main>
  )
}

export default AuthLoginSwitcher
