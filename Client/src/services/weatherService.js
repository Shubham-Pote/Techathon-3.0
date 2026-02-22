// Weather Service using Open-Meteo API (free, no API key required)

const OPENMETEO_API = "https://api.open-meteo.com/v1/forecast"

// Default coordinates (India - Delhi as fallback)
const DEFAULT_LAT = 28.6139
const DEFAULT_LON = 77.2090

/**
 * Get user's current location
 */
function getCurrentLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        })
      },
      () => {
        resolve({ lat: DEFAULT_LAT, lon: DEFAULT_LON })
      },
      { timeout: 5000 }
    )
  })
}

/**
 * Fetch weather forecast data
 */
export async function getWeatherForecast() {
  try {
    const { lat, lon } = await getCurrentLocation()

    const params = new URLSearchParams({
      latitude: lat,
      longitude: lon,
      daily: "precipitation_sum,rain_sum,weathercode,temperature_2m_max,temperature_2m_min",
      timezone: "Asia/Kolkata",
      forecast_days: 7,
    })

    const res = await fetch(`${OPENMETEO_API}?${params}`)
    if (!res.ok) throw new Error("Weather fetch failed")

    const data = await res.json()
    return parseWeatherData(data)
  } catch (error) {
    console.error("Weather service error:", error)
    return null
  }
}

/**
 * Parse weather data and generate recommendations
 */
function parseWeatherData(data) {
  const daily = data.daily
  if (!daily) return null

  const forecast = daily.time.map((date, i) => ({
    date,
    precipitation: daily.precipitation_sum[i] || 0,
    rain: daily.rain_sum[i] || 0,
    weatherCode: daily.weathercode[i],
    tempMax: daily.temperature_2m_max[i],
    tempMin: daily.temperature_2m_min[i],
  }))

  const totalRain = forecast.reduce((sum, day) => sum + day.rain, 0)
  const heavyRainDays = forecast.filter((day) => day.rain > 20).length

  const recommendations = []

  if (totalRain > 100 || heavyRainDays >= 3) {
    recommendations.push({
      type: "heavy_rain",
      priority: "high",
      message: "Crop Insurance recommended for this season.",
      icon: "🌧️",
      schemes: ["INSURANCE"],
    })
  }

  if (totalRain > 50 && totalRain <= 100) {
    recommendations.push({
      type: "moderate_rain",
      priority: "medium",
      message: "Good conditions for water-intensive crops like paddy.",
      icon: "🌾",
      schemes: ["SUBSIDY"],
    })
  }

  if (totalRain < 10 && forecast.some((d) => d.tempMax > 38)) {
    recommendations.push({
      type: "drought",
      priority: "high",
      message: "Drought conditions possible. Consider drought-resistant crops.",
      icon: "☀️",
      schemes: ["WELFARE", "SUBSIDY"],
    })
  }

  const currentWeather = {
    temp: forecast[0]?.tempMax,
    condition: getWeatherCondition(forecast[0]?.weatherCode),
    icon: getWeatherIcon(forecast[0]?.weatherCode),
  }

  return {
    forecast,
    totalRain,
    heavyRainDays,
    recommendations,
    currentWeather,
  }
}

function getWeatherCondition(code) {
  const conditions = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Foggy",
    51: "Light drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    80: "Rain showers",
    95: "Thunderstorm",
  }
  return conditions[code] || "Unknown"
}

function getWeatherIcon(code) {
  if (code === 0 || code === 1) return "☀️"
  if (code === 2 || code === 3) return "⛅"
  if (code >= 45 && code <= 48) return "🌫️"
  if (code >= 51 && code <= 55) return "🌦️"
  if (code >= 61 && code <= 65) return "🌧️"
  if (code >= 80 && code <= 82) return "🌧️"
  if (code >= 95) return "⛈️"
  return "🌤️"
}
