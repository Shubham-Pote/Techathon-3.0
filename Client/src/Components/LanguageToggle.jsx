import { useState, useRef, useEffect } from "react"
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

export default function LanguageToggle({ transparent = false }) {
  const { i18n } = useTranslation()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const current = LANGUAGES.find((l) => l.code === i18n.language) || LANGUAGES[0]

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const select = (code) => {
    i18n.changeLanguage(code)
    setOpen(false)
  }

  return (
    <div className="relative" ref={ref}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl border transition-all text-sm font-medium ${
          transparent
            ? "border-white/30 text-white/90 hover:bg-white/10"
            : "border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700"
        }`}
      >
        {/* Globe icon */}
        <svg
          className={`w-4 h-4 sm:w-5 sm:h-5 ${transparent ? "text-white/90" : "text-green-600"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10A15.3 15.3 0 0 1 12 2z" />
        </svg>
        <span className="hidden sm:inline">{current.label}</span>
        <span className="sm:hidden text-xs">{current.code.toUpperCase()}</span>
        {/* Chevron */}
        <svg
          className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""} ${transparent ? "text-white/70" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 mt-2 w-56 sm:w-64 max-h-[70vh] sm:max-h-[420px] overflow-y-auto rounded-xl bg-white shadow-2xl border border-gray-200 py-2 z-[100] animate-in fade-in slide-in-from-top-2">
          {LANGUAGES.map((l) => {
            const isActive = l.code === i18n.language
            return (
              <button
                key={l.code}
                onClick={() => select(l.code)}
                className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-colors
                  ${isActive
                    ? "bg-emerald-50 text-emerald-700 font-semibold"
                    : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <span className="min-w-[72px] font-medium">{l.native}</span>
                <span className="text-gray-400">-</span>
                <span className={isActive ? "text-emerald-600" : "text-gray-500"}>{l.label}</span>
              </button>
            )
          })}

        </div>
      )}
    </div>
  )
}
