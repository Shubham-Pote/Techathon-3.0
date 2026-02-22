// -------------------------------------------------------------------
// Two-level cache: in-memory Map ➜ localStorage
// -------------------------------------------------------------------
const mem = new Map()
const LS_KEY = "tx_cache"

function loadLsCache() {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || "{}") } catch { return {} }
}

function persistToLs(key, value) {
  try {
    const lsc = loadLsCache()
    lsc[key] = value
    localStorage.setItem(LS_KEY, JSON.stringify(lsc))
  } catch { /* quota exceeded – ignore */ }
}

function cacheGet(key) {
  if (mem.has(key)) return mem.get(key)
  const lsc = loadLsCache()
  if (lsc[key] !== undefined) { mem.set(key, lsc[key]); return lsc[key] }
  return undefined
}

function cacheSet(key, value) {
  mem.set(key, value)
  persistToLs(key, value)
}

// -------------------------------------------------------------------
// Google Translate (free "gtx" client) — fast, good CORS, no key
// -------------------------------------------------------------------
const GTRANSLATE = "https://translate.googleapis.com/translate_a/single"

async function gtranslate(text, targetLang) {
  const url = `${GTRANSLATE}?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error("non-ok")
  const json = await res.json()
  // json[0] is an array of [[translatedChunk, sourceChunk], ...]
  return (json[0] || []).map(seg => seg[0]).join("")
}

// -------------------------------------------------------------------
// Public API
// -------------------------------------------------------------------

/**
 * Translate a single string from English to targetLang.
 * Uses in-memory + localStorage cache; falls back to original text.
 */
export async function translateText(text, targetLang) {
  if (!text || typeof text !== "string" || targetLang === "en") return text ?? ""
  const trimmed = text.trim()
  if (!trimmed) return trimmed
  const key = `${targetLang}\x00${trimmed}`
  const cached = cacheGet(key)
  if (cached !== undefined) return cached

  try {
    const result = await gtranslate(trimmed, targetLang)
    cacheSet(key, result)
    return result
  } catch {
    cacheSet(key, trimmed)
    return trimmed
  }
}

/**
 * Translate an array of strings. Each string is translated individually
 * (Google Translate is fast enough) with Promise.all for parallelism.
 * Already-cached entries are skipped.
 */
export async function translateArray(arr, targetLang) {
  if (!Array.isArray(arr) || arr.length === 0 || targetLang === "en") return arr ?? []
  return Promise.all(arr.map(item => translateText(typeof item === "string" ? item : "", targetLang)))
}
