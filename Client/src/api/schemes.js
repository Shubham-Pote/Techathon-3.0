import { API_BASE_URL } from "../config/api"

function headers() {
  const token = localStorage.getItem("token")

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

export async function fetchSchemes() {
  try {
    const res = await fetch(`${API_BASE_URL}/schemes`, {
      headers: headers()
    })

    if (!res.ok) return []

    const json = await res.json()
    return json.data || []
  } catch {
    return []
  }
}

export async function fetchSchemeById(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/schemes/${id}`, {
      headers: headers()
    })

    if (!res.ok) return null

    const json = await res.json()
    return json.data
  } catch {
    return null
  }
}
