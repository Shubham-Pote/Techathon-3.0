import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/AuthContext"
import { useBookmarks } from "../context/BookmarkContext"
import { isEligible } from "../utils/eligibility"
import { translateText, translateArray } from "../utils/translate"
import { FaHandHoldingUsd, FaShieldAlt, FaHeart } from "react-icons/fa"

const categoryConfig = {
  SUBSIDY: {
    bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200",
    iconBg: "bg-emerald-100", iconText: "text-emerald-600",
    icon: FaHandHoldingUsd, label: "Subsidy"
  },
  INSURANCE: {
    bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200",
    iconBg: "bg-blue-100", iconText: "text-blue-600",
    icon: FaShieldAlt, label: "Insurance"
  },
  WELFARE: {
    bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200",
    iconBg: "bg-amber-100", iconText: "text-amber-600",
    icon: FaHeart, label: "Welfare"
  },
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

  const cat = categoryConfig[scheme?.category] || categoryConfig.SUBSIDY
  const CatIcon = cat.icon
  const rawCrops = scheme?.supported_crops || []
  const rawFinancialSummary = scheme?.details?.financial_assistance_summary || ""
  const rawName = scheme?.scheme_name || ""
  const rawDesc = scheme?.details?.description || ""
  const rawState = scheme?.state || ""
  const mode = scheme?.application_process?.mode || ""

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
        border border-slate-200/60
        shadow-sm hover:shadow-xl hover:shadow-slate-200/50
        transition-all duration-300 ease-out
        overflow-hidden group
      "
    >
      {/* Top accent bar */}
      <div className={`h-1 w-full ${cat.iconBg}`} />
      
      <div className="p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-5">

        {/* Content */}
        <div className="flex-1 min-w-0">

          {/* Title + Eligibility */}
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-base font-semibold text-slate-800 leading-snug group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2">
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
                  shrink-0 px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap
                  ${eligible
                    ? "bg-gradient-to-r from-emerald-50 to-green-50 text-emerald-600 ring-1 ring-emerald-200/50"
                    : "bg-slate-50 text-slate-400 ring-1 ring-slate-200/50"
                  }
                `}
              >
                {eligible ? t('card.eligible') : t('card.notEligible')}
              </span>
            )}
            </div>
          </div>

          {/* State + Category + Mode */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500 mb-3">
            <span>{trState || t('card.allIndia')}</span>
            <span className="text-slate-200">•</span>
            <span className={`px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${cat.bg} ${cat.text}`}>
              {scheme?.category}
            </span>
            {mode && (
              <>
                <span className="text-slate-200">•</span>
                <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">{mode}</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-[13px] text-slate-500 line-clamp-2 mb-3 leading-relaxed">
            {trDesc || t('card.noDescription')}
          </p>

          {/* Financial Assistance */}
          {rawFinancialSummary && (
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-lg px-3 py-2 mb-4">
              <p className="text-[11px] text-emerald-600 font-semibold mb-0.5">
                {t('card.financialAssistance')}
              </p>
              <p className="text-[13px] text-slate-700 font-medium line-clamp-1">
                {trFinancial}
              </p>
            </div>
          )}

          {/* Crop tags + Min land */}
          <div className="flex flex-wrap items-center gap-2">
            {trCrops.slice(0, 3).map((crop, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-50 rounded-full border border-slate-100"
              >
                {crop}
              </span>
            ))}
            {trCrops.length > 3 && (
              <span className="text-[11px] text-slate-400 font-medium">
                +{trCrops.length - 3} more
              </span>
            )}
            {scheme?.min_land_acres && (
              <>
                <span className="text-slate-200">|</span>
                <span className="text-[11px] text-slate-400">
                  Min. {scheme.min_land_acres} acres
                </span>
              </>
            )}
          </div>
        </div>

        {/* Apply button - right side */}
        <div className="flex items-center justify-center shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <a
            href={scheme?.application_process?.portal_url || "#"}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="
              px-5 py-2.5 rounded-xl
              bg-gradient-to-r from-emerald-600 to-emerald-500
              text-white text-sm font-semibold
              hover:from-emerald-700 hover:to-emerald-600
              active:scale-[0.98]
              transition-all duration-200 whitespace-nowrap
              shadow-sm shadow-emerald-200
            "
          >
            {t('card.applyNow')}
          </a>
        </div>
      </div>
    </div>
  )
}