import React, { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { translations, type Language } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultText?: string) => string;
}

const STORAGE_KEY = "infratrack_preferred_lang";

let activeLanguage: Language = "en";

export function getActiveLanguage(): Language {
  if (typeof window !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY) as Language;
    if (saved === "en" || saved === "hi") {
      activeLanguage = saved;
    }
  }
  return activeLanguage;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key: string, defaultText?: string) => defaultText || key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "en" || stored === "hi") {
        activeLanguage = stored;
        return stored;
      }
    }
    return "en";
  });

  const setLanguage = (newLang: Language) => {
    activeLanguage = newLang;
    setLanguageState(newLang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.lang = newLang;
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  const t = (key: string, defaultText?: string): string => {
    const dict = translations[language];
    if (dict && dict[key]) {
      return dict[key];
    }
    // Fallback to English
    if (translations.en[key]) {
      return translations.en[key];
    }
    return defaultText || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
