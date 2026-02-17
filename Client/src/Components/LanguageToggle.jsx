import { useLang } from "../context/LanguageContext"

export default function LanguageToggle() {
  const { lang, setLang } = useLang()

  return (
    <select
      value={lang}
      onChange={(e) => setLang(e.target.value)}
      className="text-gray-400 rounded px-2"
    >
      <option value="en">English</option>
      <option value="hi">हिंदी</option>
      <option value="mr">मराठी</option>

    </select>
  )
}
