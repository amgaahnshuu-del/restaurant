"use client";

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { LANGUAGE_COOKIE_NAME, LANGUAGE_STORAGE_KEY, type Language, readBrowserLanguage } from "@/lib/language";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const STORAGE_EVENT = "gusto-language-storage";

const readLanguage = (): Language => {
  return readBrowserLanguage();
};

const subscribe = (callback: () => void) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleStorage = (event: StorageEvent) => {
    if (event.key === LANGUAGE_STORAGE_KEY) {
      callback();
    }
  };

  const handleCustomEvent = () => {
    callback();
  };

  window.addEventListener("storage", handleStorage);
  window.addEventListener(STORAGE_EVENT, handleCustomEvent);

  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(STORAGE_EVENT, handleCustomEvent);
  };
};

const writeLanguage = (language: Language) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  document.cookie = `${LANGUAGE_COOKIE_NAME}=${language}; path=/; max-age=31536000; samesite=lax`;
  window.dispatchEvent(new Event(STORAGE_EVENT));
};

export const LanguageProvider = ({
  children,
  initialLanguage = "en",
}: {
  children: ReactNode;
  initialLanguage?: Language;
}) => {
  const getServerSnapshot = useCallback(() => initialLanguage, [initialLanguage]);
  const language = useSyncExternalStore(subscribe, readLanguage, getServerSnapshot);

  const setLanguage = useCallback((nextLanguage: Language) => {
    if (readLanguage() === nextLanguage) {
      return;
    }

    writeLanguage(nextLanguage);
  }, []);

  const toggleLanguage = useCallback(() => {
    writeLanguage(language === "en" ? "mn" : "en");
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
    }),
    [language, setLanguage, toggleLanguage],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }

  return context;
};
