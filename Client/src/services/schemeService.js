const API_URL = "http://localhost:3000/schemes";

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