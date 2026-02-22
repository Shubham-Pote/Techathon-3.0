// Nearby Help Center Service using Overpass API (OpenStreetMap - free, no API key)

const OVERPASS_API = "https://overpass-api.de/api/interpreter"

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
 * Query Overpass API for nearby places
 */
async function queryOverpass(query) {
  try {
    const res = await fetch(OVERPASS_API, {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    })
    if (!res.ok) throw new Error("Overpass query failed")
    return await res.json()
  } catch (error) {
    console.error("Overpass error:", error)
    return null
  }
}

/**
 * Calculate distance between two coordinates (in km)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Get nearby help centers (agriculture offices, banks, CSCs)
 */
export async function getNearbyHelpCenters() {
  try {
    const { lat, lon } = await getCurrentLocation()
    const radius = 10000 // 10km radius

    // Overpass QL query for multiple types of places
    const query = `
      [out:json][timeout:25];
      (
        // Agriculture offices
        node["office"="government"]["government"~"agriculture|rural"](around:${radius},${lat},${lon});
        way["office"="government"]["government"~"agriculture|rural"](around:${radius},${lat},${lon});
        node["amenity"="townhall"]["name"~"[Aa]griculture|[Kk]rishi|[Kk]heti"](around:${radius},${lat},${lon});
        node["office"="government"]["name"~"[Aa]griculture|[Kk]rishi"](around:${radius},${lat},${lon});
        
        // Banks
        node["amenity"="bank"](around:${radius},${lat},${lon});
        way["amenity"="bank"](around:${radius},${lat},${lon});
        
        // Common Service Centers / Post Offices / Government Services
        node["amenity"="post_office"](around:${radius},${lat},${lon});
        node["office"="government"](around:${radius},${lat},${lon});
        node["amenity"="community_centre"](around:${radius},${lat},${lon});
      );
      out center body 50;
    `

    const data = await queryOverpass(query)
    if (!data?.elements) return { agricultureOffices: [], banks: [], serviceCenters: [], userLocation: { lat, lon } }

    const agricultureOffices = []
    const banks = []
    const serviceCenters = []

    data.elements.forEach((el) => {
      const elLat = el.lat || el.center?.lat
      const elLon = el.lon || el.center?.lon
      if (!elLat || !elLon) return

      const place = {
        id: el.id,
        name: el.tags?.name || el.tags?.operator || "Unknown",
        lat: elLat,
        lon: elLon,
        distance: calculateDistance(lat, lon, elLat, elLon),
        address: el.tags?.["addr:full"] || el.tags?.["addr:street"] || "",
        phone: el.tags?.phone || el.tags?.["contact:phone"] || "",
      }

      // Categorize the place
      const tags = el.tags || {}
      const name = (tags.name || "").toLowerCase()

      if (
        tags.government?.includes("agriculture") ||
        tags.government?.includes("rural") ||
        name.includes("agriculture") ||
        name.includes("krishi") ||
        name.includes("kheti")
      ) {
        place.type = "agriculture"
        place.icon = "🌾"
        agricultureOffices.push(place)
      } else if (tags.amenity === "bank") {
        place.type = "bank"
        place.icon = "🏦"
        banks.push(place)
      } else if (
        tags.amenity === "post_office" ||
        tags.amenity === "community_centre" ||
        tags.office === "government"
      ) {
        place.type = "service_center"
        place.icon = "🏛️"
        serviceCenters.push(place)
      }
    })

    // Sort by distance and limit results
    const sortByDistance = (a, b) => a.distance - b.distance
    
    return {
      agricultureOffices: agricultureOffices.sort(sortByDistance).slice(0, 5),
      banks: banks.sort(sortByDistance).slice(0, 5),
      serviceCenters: serviceCenters.sort(sortByDistance).slice(0, 5),
      userLocation: { lat, lon },
    }
  } catch (error) {
    console.error("Help center service error:", error)
    return { agricultureOffices: [], banks: [], serviceCenters: [], userLocation: null }
  }
}

/**
 * Open location in Google Maps
 */
export function openInMaps(lat, lon, name) {
  const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lon}`
  window.open(url, "_blank")
}

/**
 * Get directions to a location
 */
export function getDirections(fromLat, fromLon, toLat, toLon) {
  const url = `https://www.google.com/maps/dir/${fromLat},${fromLon}/${toLat},${toLon}`
  window.open(url, "_blank")
}
