import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/AuthContext"
import { useBookmarks } from "../context/BookmarkContext"
import { isEligible } from "../utils/eligibility"
import { translateText, translateArray } from "../utils/translate"

const categoryColors = {
  SUBSIDY: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  INSURANCE: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  WELFARE: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
}

export default function SchemeCard({ scheme }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const navigate = useNavigate()
  const { user } = useAuth()
  const { isBookmarked, toggleBookmark } = useBookmarks()

  const farmerProfile = user?.profile
  const bookmarked = isBookmarked(scheme?.scheme_id)

  const eligible =
    farmerProfile && isEligible(scheme, farmerProfile)

  const handleCardClick = () => {
    if (!scheme?.scheme_id) return
    navigate(`/schemes/${scheme.scheme_id}`)
  }

  const cat = categoryColors[scheme?.category] || categoryColors.SUBSIDY
  const rawCrops = scheme?.supported_crops || []
  const rawFinancialSummary = scheme?.details?.financial_assistance_summary || ""
  const rawName = scheme?.scheme_name || ""
  const rawDesc = scheme?.details?.description || ""
  const rawState = scheme?.state || ""
  const mode = scheme?.application_process?.mode || ""

  // --- Translated state ---
  const [trName, setTrName] = useState(rawName)
  const [trDesc, setTrDesc] = useState(rawDesc)
  const [trFinancial, setTrFinancial] = useState(rawFinancialSummary)
  const [trState, setTrState] = useState(rawState)
  const [trCrops, setTrCrops] = useState(rawCrops)

  useEffect(() => {
    let cancelled = false

    if (lang === "en") {
      setTrName(rawName)
      setTrDesc(rawDesc)
      setTrFinancial(rawFinancialSummary)
      setTrState(rawState)
      setTrCrops(rawCrops)
      return
    }

    // Kick off all translations in parallel
    Promise.all([
      translateText(rawName, lang),
      translateText(rawDesc, lang),
      translateText(rawFinancialSummary, lang),
      translateText(rawState, lang),
      translateArray(rawCrops, lang),
    ]).then(([name, desc, fin, state, crops]) => {
      if (cancelled) return
      setTrName(name)
      setTrDesc(desc)
      setTrFinancial(fin)
      setTrState(state)
      setTrCrops(crops)
    })

    return () => { cancelled = true }
  }, [lang, rawName, rawDesc, rawFinancialSummary, rawState, rawCrops])

  return (
    <div
      onClick={handleCardClick}
      className="
        relative cursor-pointer bg-white rounded-2xl
        border border-slate-200
        shadow-sm hover:shadow-md hover:border-slate-300
        transition-all duration-200
        overflow-hidden group
      "
    >
      {/* Mobile: top color bar, Desktop: left strip */}
      <div className={`h-1 sm:hidden w-full ${scheme?.category === "INSURANCE" ? "bg-blue-500" : scheme?.category === "WELFARE" ? "bg-amber-500" : "bg-emerald-500"}`} />
      
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-3 sm:gap-5">

        {/* LEFT: Category indicator - hidden on mobile, shown on desktop */}
        <div className={`hidden sm:block w-1.5 self-stretch rounded-full shrink-0 ${scheme?.category === "INSURANCE" ? "bg-blue-500" : scheme?.category === "WELFARE" ? "bg-amber-500" : "bg-emerald-500"}`} />

        {/* MIDDLE: Content */}
        <div className="flex-1 min-w-0">

          {/* Title row */}
          <div className="flex items-start justify-between gap-3 mb-1">
            <h3 className="text-[15px] font-semibold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors line-clamp-2">
              {trName || "Unnamed Scheme"}
            </h3>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Bookmark button */}
              {user && (
                <button
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(scheme?.scheme_id) }}
                  className={`p-1.5 rounded-lg transition-all duration-200 ${
                    bookmarked
                      ? "text-amber-500 bg-amber-50 hover:bg-amber-100"
                      : "text-slate-300 hover:text-amber-400 hover:bg-slate-50"
                  }`}
                  title={bookmarked ? "Remove bookmark" : "Bookmark scheme"}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={bookmarked ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2} className="w-[18px] h-[18px]">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                  </svg>
                </button>
              )}

              {/* Eligibility badge */}
              {farmerProfile && (
              <span
                className={`
                  shrink-0 px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap
                  ${eligible
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-slate-50 text-slate-500 ring-1 ring-slate-200"
                  }
                `}
              >
                {eligible ? t('card.eligible') : t('card.notEligible')}
              </span>
            )}
            </div>
          </div>

          {/* State + Category */}
          <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
            <span>{trState || t('card.allIndia')}</span>
            <span className="text-slate-300">•</span>
            <span className={`px-2 py-0.5 text-[11px] font-semibold rounded-md border ${cat.bg} ${cat.text} ${cat.border}`}>
              {scheme?.category}
            </span>
            {mode && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-xs text-slate-400">{mode}</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-[13px] text-slate-600 line-clamp-2 mb-3 leading-relaxed">
            {trDesc || t('card.noDescription')}
          </p>

          {/* Financial summary highlight */}
          {rawFinancialSummary && (
            <div className="bg-slate-50 border border-slate-100 rounded-lg px-3 py-2 mb-3">
              <p className="text-[11px] text-slate-500 font-semibold mb-0.5 uppercase tracking-wide">
                {t('card.financialAssistance')}
              </p>
              <p className="text-sm text-slate-700 font-medium line-clamp-1">
                {trFinancial}
              </p>
            </div>
          )}

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-1.5">
            {trCrops.slice(0, 4).map((crop, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-600 rounded-md border border-slate-200"
              >
                {crop}
              </span>
            ))}
            {trCrops.length > 4 && (
              <span className="text-[11px] text-slate-400 font-medium">
                {t('card.more', { n: trCrops.length - 4 })}
              </span>
            )}
          </div>
        </div>

        {/* RIGHT on desktop / BOTTOM on mobile: Apply button */}
        <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-between shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {scheme?.min_land_acres && (
            <span className="text-[11px] text-slate-400 font-medium whitespace-nowrap sm:mb-2">
              {t('card.minAcre', { n: scheme.min_land_acres })}
            </span>
          )}

          <a
            href={scheme?.application_process?.portal_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="
              px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl
              bg-emerald-600 text-white
              text-xs sm:text-sm font-semibold
              hover:bg-emerald-700 active:scale-95
              transition-all whitespace-nowrap
              shadow-sm hover:shadow
            "
          >
            {t('card.applyNow')}
          </a>
        </div>
      </div>
    </div>
  )
}