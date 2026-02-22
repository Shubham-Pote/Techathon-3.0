const API_BASE = `http://${window.location.hostname}:3000`;
const API_URL = `${API_BASE}/schemes`;

// Get all schemes
export async function getAllSchemes() {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch schemes");
  }

  return res.json(); // returns { success, data }
}

// Get scheme by ID
export async function getSchemeById(id) {
  const res = await fetch(`${API_URL}/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch scheme");
  }

  return res.json();
}