import { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import { getWeatherForecast } from "../services/weatherService"
import { translateText } from "../utils/translate"

export default function WeatherButton() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState(false)
  const [translatedRecs, setTranslatedRecs] = useState([])
  const dropdownRef = useRef(null)

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true)
      const data = await getWeatherForecast()
      setWeather(data)
      setLoading(false)
    }
    fetchWeather()
  }, [])

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

  // Translate recommendations
  useEffect(() => {
    if (!weather?.recommendations?.length) {
      setTranslatedRecs([])
      return
    }

    if (lang === "en") {
      setTranslatedRecs(weather.recommendations)
      return
    }

    let cancelled = false
    Promise.all(
      weather.recommendations.map(async (rec) => ({
        ...rec,
        message: await translateText(rec.message, lang),
      }))
    ).then((translated) => {
      if (!cancelled) setTranslatedRecs(translated)
    })

    return () => { cancelled = true }
  }, [weather, lang])

  const displayRecs = translatedRecs.length > 0 ? translatedRecs : (weather?.recommendations || [])
  const hasHighPriority = displayRecs.some((r) => r.priority === "high")

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Weather Button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className={`
          flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs sm:text-sm
          bg-white/10 border border-white/20
          hover:bg-white/20 transition-all font-medium
          ${hasHighPriority ? "ring-2 ring-amber-400/50" : ""}
        `}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <span className="text-base">{weather?.currentWeather?.icon || "🌤️"}</span>
            <span className="hidden sm:inline">
              {weather?.currentWeather?.temp ? `${Math.round(weather.currentWeather.temp)}°` : "Weather"}
            </span>
            {hasHighPriority && (
              <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
            )}
          </>
        )}
      </button>

      {/* Expanded Dropdown */}
      {expanded && weather && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{weather.currentWeather?.icon || "🌤️"}</span>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm">Weather Advisory</h3>
                  <p className="text-xs text-slate-500">
                    {weather.currentWeather?.condition} • {weather.currentWeather?.temp}°C
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500">7-day</p>
                <p className="text-sm font-medium text-blue-700">
                  {weather.totalRain?.toFixed(0)}mm
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="p-3 max-h-64 overflow-y-auto">
            {displayRecs.length > 0 ? (
              <div className="space-y-2">
                {displayRecs.map((rec, idx) => (
                  <div
                    key={idx}
                    className={`flex items-start gap-2.5 p-3 rounded-xl ${
                      rec.priority === "high"
                        ? "bg-amber-50 border border-amber-200"
                        : "bg-slate-50 border border-slate-100"
                    }`}
                  >
                    <span className="text-lg">{rec.icon}</span>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        rec.priority === "high" ? "text-amber-800" : "text-slate-700"
                      }`}>
                        {rec.message}
                      </p>
                      {rec.schemes && (
                        <div className="flex gap-1 mt-1.5">
                          {rec.schemes.map((scheme) => (
                            <span
                              key={scheme}
                              className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium"
                            >
                              {scheme}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-500 text-center py-4">
                Weather conditions are normal. No special advisories.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
