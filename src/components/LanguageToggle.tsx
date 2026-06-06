"use client"

import { useRouter } from "next/navigation"

import { useLanguage } from "@/contexts/LanguageContext"

const LanguageToggle = () => {
  const router = useRouter()
  const { language, setLanguage } = useLanguage()

  const handleLanguageChange = (nextLanguage: "en" | "mn") => {
    if (nextLanguage === language) {
      return
    }

    setLanguage(nextLanguage)
    router.refresh()
  }

  return (
    <div className="inline-flex items-center rounded-full border border-border/80 bg-white/80 p-1 shadow-[0_12px_30px_hsl(var(--border)/0.2)] backdrop-blur">
      <button
        type="button"
        onClick={() => handleLanguageChange("en")}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
          language === "en"
            ? "bg-[#8d7149] text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={language === "en"}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => handleLanguageChange("mn")}
        className={`rounded-full px-3 py-1.5 text-sm font-semibold transition ${
          language === "mn"
            ? "bg-[#8d7149] text-white shadow-sm"
            : "text-muted-foreground hover:text-foreground"
        }`}
        aria-pressed={language === "mn"}
      >
        MN
      </button>
    </div>
  )
}

export default LanguageToggle
