const DEFAULT_API_BASE_URL = "https://techathon-ry1m.onrender.com";

export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || DEFAULT_API_BASE_URL
).replace(/\/+$/, "");
