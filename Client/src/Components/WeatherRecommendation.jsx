import { useState, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { getWeatherForecast } from "../services/weatherService"
import { translateText } from "../utils/translate"

export default function WeatherRecommendation() {
  const { i18n } = useTranslation()
  const lang = i18n.language

  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [translatedRecs, setTranslatedRecs] = useState([])

  useEffect(() => {
    async function fetchWeather() {
      setLoading(true)
      const data = await getWeatherForecast()
      setWeather(data)
      setLoading(false)
    }
    fetchWeather()
  }, [])

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

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-100">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
          <span className="text-blue-700 text-sm">Loading weather...</span>
        </div>
      </div>
    )
  }

  if (!weather) return null

  const { currentWeather, recommendations } = weather
  const displayRecs = translatedRecs.length > 0 ? translatedRecs : recommendations

  return (
    <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-emerald-50 rounded-2xl p-4 sm:p-5 border border-blue-100 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{currentWeather?.icon || "🌤️"}</span>
          <div>
            <h3 className="font-semibold text-slate-800 text-sm sm:text-base">
              Weather Advisory
            </h3>
            <p className="text-xs text-slate-500">
              {currentWeather?.condition} • {currentWeather?.temp}°C
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-500">7-day forecast</p>
          <p className="text-sm font-medium text-blue-700">
            {weather.totalRain?.toFixed(1)} mm rain
          </p>
        </div>
      </div>

      {displayRecs.length > 0 && (
        <div className="space-y-2">
          {displayRecs.map((rec, idx) => (
            <div
              key={idx}
              className={`flex items-start gap-3 p-3 rounded-xl ${
                rec.priority === "high"
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-white/60 border border-slate-100"
              }`}
            >
              <span className="text-xl">{rec.icon}</span>
              <div className="flex-1">
                <p className={`text-sm font-medium ${
                  rec.priority === "high" ? "text-amber-800" : "text-slate-700"
                }`}>
                  {rec.message}
                </p>
                {rec.schemes && (
                  <div className="flex gap-1.5 mt-1.5">
                    {rec.schemes.map((scheme) => (
                      <span
                        key={scheme}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-medium"
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
      )}

      {displayRecs.length === 0 && (
        <p className="text-sm text-slate-600 text-center py-2">
          Weather conditions are normal. No special advisories.
        </p>
      )}
    </div>
  )
}
