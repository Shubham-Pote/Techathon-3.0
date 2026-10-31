const configuredApiBaseUrl = import.meta.env.VITE_API_URL?.trim();

if (!configuredApiBaseUrl) {
  throw new Error("VITE_API_URL must be configured for the client build.");
}

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");
