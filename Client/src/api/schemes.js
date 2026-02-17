function headers() {
  const token = localStorage.getItem("token")

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` })
  }
}

export async function fetchSchemes() {
  try {
    const res = await fetch("/schemes", {
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
    const res = await fetch(`/schemes/${id}`, {
      headers: headers()
    })

    if (!res.ok) return null

    const json = await res.json()
    return json.data
  } catch {
    return null
  }
}
