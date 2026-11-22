import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import en from "./en.json"

const translations = import.meta.glob(["./*.json", "!./en.json"], { import: "default" })

i18n.on("languageChanged", (language) => {
  document.documentElement.lang = language
  document.documentElement.dir = i18n.dir(language)
})

i18n
  .use(initReactI18next)
  .use({
    type: "backend",
    read(language, _namespace, done) {
      const load = translations["./" + language + ".json"]
      if (!load) {
        done(null, {})
        return
      }
      load().then(
        (translation) => done(null, translation),
        (error) => done(error, false),
      )
    },
  })
  .init({
    resources: { en: { translation: en } },
    partialBundledLanguages: true,
    supportedLngs: ["en", ...Object.keys(translations).map((path) => path.slice(2, -5))],
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  })

export default i18n
