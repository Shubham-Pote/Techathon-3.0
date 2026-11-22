import { useTranslation } from "react-i18next"

export function useLang() {
  const { t, i18n } = useTranslation()
  return { lang: i18n.language, setLang: i18n.changeLanguage.bind(i18n), t }
}
