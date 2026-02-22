import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { getNearbyHelpCenters, getDirections } from "../services/helpCenterService"
import { translateText } from "../utils/translate"

export default function HelpCenterButton({ transparent = false }) {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [activeTab, setActiveTab] = useState("agriculture")
  const [translated, setTranslated] = useState({})
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setExpanded(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Fetch data when expanded
  useEffect(() => {
    if (expanded && !data && !loading) {
      fetchHelpCenters()
    }
  }, [expanded])

  // Translate labels
  useEffect(() => {
    if (lang === "en") {
      setTranslated({
        title: "Nearby Help Centers",
        agriculture: "Agriculture Office",
        bank: "Banks",
        serviceCenter: "Service Centers",
        noResults: "No places found nearby",
        loading: "Finding nearby centers...",
        directions: "Get Directions",
        km: "km away",
      })
      return
    }

    let cancelled = false
    Promise.all([
      translateText("Nearby Help Centers", lang),
      translateText("Agriculture Office", lang),
      translateText("Banks", lang),
      translateText("Service Centers", lang),
      translateText("No places found nearby", lang),
      translateText("Finding nearby centers...", lang),
      translateText("Get Directions", lang),
      translateText("km away", lang),
    ]).then(([title, agriculture, bank, serviceCenter, noResults, loadingText, directions, km]) => {
      if (!cancelled) {
        setTranslated({ title, agriculture, bank, serviceCenter, noResults, loading: loadingText, directions, km })
      }
    })

    return () => { cancelled = true }
  }, [lang])

  async function fetchHelpCenters() {
    setLoading(true)
    const result = await getNearbyHelpCenters()
    setData(result)
    setLoading(false)
  }

  const tabs = [
    { id: "agriculture", label: translated.agriculture || "Agriculture", icon: "AG", data: data?.agricultureOffices },
    { id: "bank", label: translated.bank || "Banks", icon: "BK", data: data?.banks },
    { id: "service", label: translated.serviceCenter || "CSC", icon: "SC", data: data?.serviceCenters },
  ]

  const currentTab = tabs.find((t) => t.id === activeTab)
  const places = currentTab?.data || []

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Help Center Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`
          flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm
          border transition-all font-medium
          ${transparent
            ? "border-white/30 text-white/90 hover:bg-white/10"
            : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
          }
        `}
        title="Find nearby help centers"
      >
        <svg className={`w-4 h-4 ${transparent ? "text-white/90" : "text-green-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="hidden sm:inline">Help</span>
      </button>

      {/* Expanded Dropdown */}
      {expanded && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-4 py-3 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
              <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {translated.title || "Nearby Help Centers"}
            </h3>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-3 py-2.5 text-xs font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-emerald-50 text-emerald-700 border-b-2 border-emerald-500"
                    : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <span className="mr-1 text-[10px] font-bold bg-gray-100 rounded px-1 py-0.5">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-3 max-h-72 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-8">
                <div className="w-5 h-5 border-2 border-emerald-200 border-t-emerald-500 rounded-full animate-spin" />
                <span className="text-sm text-slate-500">{translated.loading || "Finding nearby centers..."}</span>
              </div>
            ) : places.length > 0 ? (
              <div className="space-y-2">
                {places.map((place) => (
                  <div
                    key={place.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-800 text-sm truncate">
                          {place.name}
                        </h4>
                        {place.address && (
                          <p className="text-xs text-slate-500 truncate mt-0.5">{place.address}</p>
                        )}
                        <p className="text-xs text-emerald-600 font-medium mt-1">
                          {place.distance.toFixed(1)} {translated.km || "km away"}
                        </p>
                      </div>
                      <button
                        onClick={() => getDirections(data.userLocation.lat, data.userLocation.lon, place.lat, place.lon)}
                        className="shrink-0 px-2.5 py-1.5 text-xs bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition font-medium"
                      >
                        {translated.directions || "Directions"}
                      </button>
                    </div>
                    {place.phone && (
                      <a
                        href={`tel:${place.phone}`}
                        className="inline-flex items-center gap-1 mt-2 text-xs text-blue-600 hover:underline"
                      >
                        {place.phone}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-8">
                {translated.noResults || "No places found nearby"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
