import { API_BASE_URL } from "../config/api";

const API_URL = `${API_BASE_URL}/schemes`;
const contentFields = ["details", "benefits", "eligibility", "application_process", "documents_required"];

function normalizeContent(scheme) {
  const normalized = { ...scheme };
  for (const field of contentFields) {
    if (typeof normalized[field] === "string") {
      try {
        normalized[field] = JSON.parse(normalized[field]);
      } catch {
        normalized[field] = undefined;
      }
    }
  }
  return normalized;
}

// Get all schemes
export async function getAllSchemes() {
  const res = await fetch(API_URL);

  if (!res.ok) {
    throw new Error("Failed to fetch schemes");
  }

  const response = await res.json();
  if (Array.isArray(response.data)) response.data = response.data.map(normalizeContent);
  return response;
}

// Get scheme by ID
export async function getSchemeById(id) {
  const res = await fetch(`${API_URL}/${encodeURIComponent(id)}`);

  if (!res.ok) {
    throw new Error("Failed to fetch scheme");
  }

  const response = await res.json();
  if (response.data) response.data = normalizeContent(response.data);
  return response;
}
