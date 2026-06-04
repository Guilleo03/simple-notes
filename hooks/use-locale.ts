"use client"

import { useState, useEffect } from "react"
import { resolveLocale, translations } from "@/lib/i18n"
import type { Locale, Translations } from "@/lib/i18n"

interface UseLocaleReturn {
  locale: Locale
  t: Translations
}

export function useLocale(): UseLocaleReturn {
  const [locale, setLocale] = useState<Locale>("en")

  useEffect(() => {
    const browserLang = navigator.language || "en"
    const resolved = resolveLocale(browserLang)
    setLocale(resolved)
  }, [])

  return { locale, t: translations[locale] }
}
