import { createContext, useContext, useState } from "react"

const LangContext = createContext()

const translations = {
  en: {
    title: "Schemes for Farmers",
    login: "Login",
    apply: "Apply Now",
  },
  hi: {
    title: "किसानों के लिए योजनाएं",
    login: "लॉगिन",
    apply: "आवेदन करें",
  },
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en")

  return (
    <LangContext.Provider
      value={{ lang, setLang, t: translations[lang] }}
    >
      {children}
    </LangContext.Provider>
  )
}

export const useLang = () => useContext(LangContext)
