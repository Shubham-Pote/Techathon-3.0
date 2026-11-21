import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { useAuth } from "../context/AuthContext"
import { useBookmarks } from "../context/BookmarkContext"
import { isEligible } from "../utils/eligibility"
import { translateText, translateArray } from "../utils/translate"
import { FiArrowUpRight, FiBookmark, FiHeart, FiMapPin, FiShield } from "react-icons/fi"
import { LuSprout } from "react-icons/lu"

const categoryIcons = { SUBSIDY: LuSprout, INSURANCE: FiShield, WELFARE: FiHeart }
const noCrops = []

export default function SchemeCard({ scheme }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const { user } = useAuth()
  const { isBookmarked, toggleBookmark } = useBookmarks()

  const farmerProfile = user?.profile
  const bookmarked = isBookmarked(scheme?.scheme_id)

  const eligible =
    farmerProfile && isEligible(scheme, farmerProfile)

  const CategoryIcon = categoryIcons[scheme?.category] || LuSprout
  const rawCrops = scheme?.supported_crops || noCrops
  const rawFinancialSummary = scheme?.details?.financial_assistance_summary || ""
  const rawName = scheme?.scheme_name || ""
  const rawDesc = scheme?.details?.description || ""
  const rawState = scheme?.state || ""
  const mode = scheme?.application_process?.mode || ""

  const [translated, setTranslated] = useState(null)

  useEffect(() => {
    if (lang === "en") return

    let cancelled = false
    Promise.all([
      translateText(rawName, lang),
      translateText(rawDesc, lang),
      translateText(rawFinancialSummary, lang),
      translateText(rawState, lang),
      translateArray(rawCrops, lang),
    ]).then(([name, desc, financial, state, crops]) => {
      if (!cancelled) setTranslated({ lang, name, desc, financial, state, crops })
    })

    return () => { cancelled = true }
  }, [lang, rawName, rawDesc, rawFinancialSummary, rawState, rawCrops])

  const { name, desc, financial, state, crops } = translated?.lang === lang
    ? translated
    : { name: rawName, desc: rawDesc, financial: rawFinancialSummary, state: rawState, crops: rawCrops }
  const detailsPath = scheme?.scheme_id && `/schemes/${scheme.scheme_id}`
  const portal = scheme?.application_process?.portal_url

  return (
    <article className="kc-card">
      <div className="kc-card-top">
        <span className="kc-topic-icon"><CategoryIcon aria-hidden="true" /></span>
        {scheme?.category && <span className="kc-chip">{scheme.category}</span>}
        {user && (
          <button
            className="kc-bookmark"
            type="button"
            onClick={() => toggleBookmark(scheme?.scheme_id)}
            aria-label={bookmarked ? t("card.removeBookmark") : t("card.bookmark")}
            aria-pressed={bookmarked}
          >
            <FiBookmark aria-hidden="true" fill={bookmarked ? "currentColor" : "none"} />
          </button>
        )}
      </div>
      <div className="kc-card-main">
        <h3>{detailsPath ? <Link to={detailsPath}>{name || "Unnamed Scheme"}</Link> : name}</h3>
        <div className="kc-card-meta">
          <span><FiMapPin aria-hidden="true" /> {state || t("card.allIndia")}</span>
          {mode && <span>{mode}</span>}
          {farmerProfile && <span className="kc-chip">{eligible ? t("card.eligible") : t("card.notEligible")}</span>}
        </div>
        <p className="kc-card-description">{desc || t("card.noDescription")}</p>
        {financial && <div className="kc-card-benefit"><strong>{t("card.financialAssistance")}</strong><p>{financial}</p></div>}
        {(crops.length > 0 || Boolean(scheme?.min_land_acres)) && (
          <div className="kc-card-crops">
            {crops.slice(0, 3).map((crop, index) => <span className="kc-chip" key={index}>{crop}</span>)}
            {crops.length > 3 && <span>{t("card.more", { n: crops.length - 3 })}</span>}
            {scheme?.min_land_acres ? <span>{t("card.minAcre", { n: scheme.min_land_acres })}</span> : null}
          </div>
        )}
      </div>
      <div className="kc-card-actions">
        {detailsPath && <Link className="kc-text-link" to={detailsPath}>{t("card.viewDetails")}</Link>}
        {portal && <a className="kc-text-link" href={portal} target="_blank" rel="noopener noreferrer">{t("card.applyNow")} <FiArrowUpRight aria-hidden="true" /></a>}
      </div>
    </article>
  )
}
