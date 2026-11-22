import { useEffect, useRef, useState } from "react"
import { FiChevronDown, FiGlobe } from "react-icons/fi"
import { useTranslation } from "react-i18next"

const LANGUAGES = [
  { code: "en", native: "English", label: "English" },
  { code: "hi", native: "हिन्दी", label: "Hindi" },
  { code: "or", native: "ଓଡ଼ିଆ", label: "Odia" },
  { code: "as", native: "অসমীয়া", label: "Assamese" },
  { code: "bn", native: "বাংলা", label: "Bengali" },
  { code: "gu", native: "ગુજરાતી", label: "Gujarati" },
  { code: "kn", native: "ಕನ್ನಡ", label: "Kannada" },
  { code: "ml", native: "മലയാളം", label: "Malayalam" },
  { code: "mr", native: "मराठी", label: "Marathi" },
  { code: "pa", native: "ਪੰਜਾਬੀ", label: "Punjabi" },
  { code: "ta", native: "தமிழ்", label: "Tamil" },
  { code: "te", native: "తెలుగు", label: "Telugu" },
  { code: "ur", native: "اردو", label: "Urdu" },
  { code: "ks", native: "کٲشُر", label: "Kashmiri" },
  { code: "mai", native: "मैथिली", label: "Maithili" },
]

export default function LanguageToggle() {
  const { t, i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const wrapper = useRef(null)
  const trigger = useRef(null)
  const current = LANGUAGES.find((language) => language.code === i18n.language) || LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    function dismiss(event) {
      if (!wrapper.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener("pointerdown", dismiss)
    return () => document.removeEventListener("pointerdown", dismiss)
  }, [open])

  function close() {
    setOpen(false)
    trigger.current?.focus()
  }

  return (
    <div
      className="relative"
      ref={wrapper}
      onKeyDown={(event) => { if (open && event.key === "Escape") close() }}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false) }}
    >
      <button
        type="button"
        ref={trigger}
        className="kc-nav-control"
        aria-label={t("nav.language", { language: current.label })}
        aria-expanded={open}
        aria-controls={open ? "site-languages" : undefined}
        onClick={() => setOpen(!open)}
      >
        <FiGlobe aria-hidden="true" />
        <span className="hidden sm:inline" lang={current.code}>{current.native}</span>
        <span className="sm:hidden text-xs">{current.code.toUpperCase()}</span>
        <FiChevronDown className="hidden sm:inline" aria-hidden="true" />
      </button>
      {open && (
        <ul className="kc-popover kc-languages" id="site-languages">
          {LANGUAGES.map(({ code, native, label }) => (
            <li key={code}>
              <button
                type="button"
                aria-pressed={code === i18n.language}
                onClick={() => { i18n.changeLanguage(code); close() }}
              >
                <strong lang={code} dir="auto">{native}</strong>
                {native !== label && <span>{label}</span>}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
