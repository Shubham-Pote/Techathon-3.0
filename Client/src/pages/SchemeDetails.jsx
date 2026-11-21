import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { FiArrowUpRight } from "react-icons/fi"
import Navbar from "../Components/Navbar"
import SchemeContent from "../Components/SchemeContent"
import DownloadButton from "../Components/DownloadButton"
import { getSchemeById } from "../services/schemeService"
import { translateArray, translateText } from "../utils/translate"

const sections = ["details", "benefits", "eligibility", "process", "docs"]

export default function SchemeDetails() {
  const { id } = useParams()

  return (
    <>
      <Navbar />
      <SchemeDetail key={id} id={id} />
    </>
  )
}

const empty = {}

function SchemeDetail({ id }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [scheme, setScheme] = useState(null)
  const [failed, setFailed] = useState(false)
  const [translated, setTranslated] = useState(null)

  useEffect(() => {
    let cancelled = false
    getSchemeById(id)
      .then((response) => {
        if (!response?.success || !response.data) throw new Error("Scheme not found")
        const data = { ...response.data }
        for (const field of ["details", "benefits", "eligibility", "application_process", "documents_required"]) {
          if (typeof data[field] === "string") data[field] = JSON.parse(data[field])
        }
        if (!cancelled) setScheme(data)
      })
      .catch(() => {
        if (!cancelled) setFailed(true)
      })

    return () => { cancelled = true }
  }, [id])

  useEffect(() => {
    if (!scheme || lang === "en") return

    let cancelled = false
    Promise.all([
      translateText(scheme.scheme_name, lang),
      translateText(scheme.category, lang),
      translateText(scheme.application_process?.mode, lang),
      translateArray(scheme.supported_crops || [], lang),
      translateText(scheme.details?.financial_assistance_summary, lang),
    ]).then(([name, category, mode, crops, summary]) => {
      if (!cancelled) setTranslated({ lang, name, category, mode, crops, summary })
    })
    return () => { cancelled = true }
  }, [scheme, lang])

  if (!scheme) {
    return (
      <main id="main-content" tabIndex={-1} className="kc-shell kc-details-header">
        <Link className="kc-text-link" to="/home">{t("schemeDetail.back")}</Link>
        <p className="mt-4" role={failed ? "alert" : "status"}>
          {t(failed ? "schemeDetail.loadError" : "schemeDetail.loading")}
        </p>
      </main>
    )
  }

  const proc = scheme.application_process || empty
  const details = scheme.details || empty
  const benefits = scheme.benefits || empty
  const copy = translated?.lang === lang ? translated : null
  const tags = [
    copy?.category || scheme.category,
    copy?.mode || proc.mode,
    scheme.min_land_acres && t("schemeDetail.minAcre", { n: scheme.min_land_acres }),
    ...(copy?.crops || scheme.supported_crops || []),
  ].filter(Boolean)

  return (
    <main id="main-content" tabIndex={-1} className="kc-shell">
      <div className="kc-details-header">
        <Link className="kc-text-link" to="/home">{t("schemeDetail.back")}</Link>
        <h1 className="kc-display">{copy?.name || scheme.scheme_name}</h1>
        <div className="kc-card-crops">
          {tags.map((tag, index) => <span className="kc-chip" key={index}>{tag}</span>)}
        </div>
        <div className="kc-details-actions">
          {proc.portal_url && (
            <a className="kc-button" href={proc.portal_url} target="_blank" rel="noopener noreferrer">
              {t("card.applyNow")} <FiArrowUpRight aria-hidden="true" />
            </a>
          )}
          <DownloadButton scheme={scheme} details={details} benefits={benefits} proc={proc} />
        </div>
      </div>
      <div className="kc-details-layout">
        <nav className="kc-details-nav" aria-labelledby="scheme-sections">
          <h2 id="scheme-sections">{t("schemeDetail.schemeSection")}</h2>
          <ul>
            {sections.map((section) => (
              <li key={section}><a href={`#${section}`}>{t(`schemeDetail.sidebar.${section}`)}</a></li>
            ))}
          </ul>
        </nav>

        <div className="kc-details-body">
          {details.financial_assistance_summary && (
            <div className="kc-financial mb-8">
              <strong>{t("schemeDetail.financialAssistance")}</strong>
              <p>{copy?.summary || details.financial_assistance_summary}</p>
            </div>
          )}
          <SchemeContent scheme={scheme} proc={proc} details={details} benefits={benefits} />
        </div>
      </div>
    </main>
  )
}
