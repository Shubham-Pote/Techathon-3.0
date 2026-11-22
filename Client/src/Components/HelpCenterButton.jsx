import { useEffect, useRef, useState } from "react"
import { FiArrowUpRight, FiMapPin, FiX } from "react-icons/fi"
import { useTranslation } from "react-i18next"
import { getNearbyHelpCenters, getDirections } from "../services/helpCenterService"
import { translateArray } from "../utils/translate"

const labels = [
  "Nearby help centers", "Agriculture offices", "Banks", "Service centers",
  "No places found in this category.", "Finding nearby centers…", "Directions", "km away",
  "Showing results for Delhi because your location is unavailable.", "Couldn’t load help centers.",
]
const groups = ["agricultureOffices", "banks", "serviceCenters"]

export default function HelpCenterButton() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [translation, setTranslation] = useState(null)
  const wrapper = useRef(null)
  const trigger = useRef(null)

  const [title, agriculture, banks, services, empty, searching, directions, distance, fallback, error] =
    translation?.lang === lang ? translation.labels : labels
  const places = data?.[groups[activeTab]] || []

  useEffect(() => {
    if (!expanded) return
    function dismiss(event) {
      if (!wrapper.current?.contains(event.target)) setExpanded(false)
    }
    document.addEventListener("pointerdown", dismiss)
    return () => document.removeEventListener("pointerdown", dismiss)
  }, [expanded])

  useEffect(() => {
    if (!expanded || lang === "en") return
    let cancelled = false
    translateArray(labels, lang).then((result) => {
      if (!cancelled) setTranslation({ lang, labels: result })
    })
    return () => { cancelled = true }
  }, [expanded, lang])

  async function fetchCenters() {
    setLoading(true)
    try {
      setData(await getNearbyHelpCenters())
    } finally {
      setLoading(false)
    }
  }

  function close() {
    setExpanded(false)
    trigger.current?.focus()
  }

  return (
    <div className="relative" ref={wrapper} onKeyDown={(event) => { if (expanded && event.key === "Escape") close() }}>
      <button
        ref={trigger}
        type="button"
        className="kc-nav-control"
        aria-label={title}
        aria-expanded={expanded}
        aria-controls={expanded ? "nearby-help" : undefined}
        onClick={() => {
          setExpanded(!expanded)
          if (!expanded && !data && !loading) fetchCenters()
        }}
      >
        <FiMapPin aria-hidden="true" />
        <span className="hidden sm:inline">{t("nav.help")}</span>
      </button>
      {expanded && (
        <section className="kc-popover kc-help-panel" id="nearby-help" aria-labelledby="nearby-help-title">
          <header className="kc-help-header">
            <h2 id="nearby-help-title">{title}</h2>
            <button type="button" className="kc-nav-control" aria-label={t("nav.close")} onClick={close}><FiX aria-hidden="true" /></button>
          </header>
          <div className="kc-help-tabs" role="group" aria-label={title}>
            {[agriculture, banks, services].map((tab, index) => (
              <button type="button" key={groups[index]} aria-pressed={activeTab === index} onClick={() => setActiveTab(index)}>{tab}</button>
            ))}
          </div>
          {loading ? <p className="kc-help-status" role="status">{searching}</p> : data?.failed ? (
            <div className="kc-help-status">
              <p role="alert">{error}</p>
              <button type="button" className="kc-text-link" onClick={fetchCenters}>{t("schemes.retry")}</button>
            </div>
          ) : (
            <>
              {data?.fallbackLocation && <p className="kc-help-status">{fallback}</p>}
              {places.length === 0 ? <p className="kc-help-status">{empty}</p> : (
                <ul className="kc-help-places">
                  {places.map((place) => (
                    <li key={place.id}>
                      <strong>{place.name}</strong>
                      {place.address && <p>{place.address}</p>}
                      <p>{place.distance.toFixed(1)} {distance}</p>
                      {place.phone && <a className="kc-text-link" href={"tel:" + place.phone}>{place.phone}</a>}
                      <button className="kc-text-link" type="button" onClick={() => getDirections(data.userLocation.lat, data.userLocation.lon, place.lat, place.lon)}>
                        {directions} <FiArrowUpRight aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </section>
      )}
    </div>
  )
}
