"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Language = "EN" | "AR";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<Language>("EN");
  const [translations, setTranslations] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem("aafaq-language") as Language | null;
    if (saved && (saved === "EN" || saved === "AR")) setLanguage(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("aafaq-language", language);
    // Load translation file
    fetch(`/locales/${language.toLowerCase()}.json`)
      .then(res => res.json())
      .then(data => setTranslations(data))
      .catch(err => console.error("Translation load error", err));
  }, [language]);

  const t = (key: string): string => {
    if (!translations) return key;
    const keys = key.split(".");
    let value: any = translations;
    for (const k of keys) {
      if (value[k] === undefined) return key;
      value = value[k];
    }
    return value;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};