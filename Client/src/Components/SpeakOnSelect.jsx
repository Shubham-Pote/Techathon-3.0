import { useEffect, useRef, useState, useCallback } from "react"
import { useTranslation } from "react-i18next"

/* BCP-47 language tags for SpeechSynthesis */
const LANG_MAP = {
  en: "en-IN",
  hi: "hi-IN",
  mr: "mr-IN",
}

export default function SpeakOnSelect() {
  const { i18n } = useTranslation()
  const [popup, setPopup] = useState(null)   // { x, y, text }
  const [speaking, setSpeaking] = useState(false)
  const popupRef = useRef(null)

  /* ── Position popup above the selection ── */
  const handleMouseUp = useCallback((e) => {
    /* ignore clicks inside our own popup */
    if (popupRef.current?.contains(e.target)) return

    setTimeout(() => {
      const sel = window.getSelection()
      const text = sel?.toString().trim()
      if (!text || text.length < 2) { setPopup(null); return }

      const range = sel.getRangeAt(0)
      const rect  = range.getBoundingClientRect()

      setPopup({
        x: rect.left + rect.width / 2,
        y: rect.top - 10,          /* 10 px above selection top */
        text,
      })
    }, 20)
  }, [])

  /* ── Hide popup when clicking elsewhere ── */
  const handleMouseDown = useCallback((e) => {
    if (popupRef.current?.contains(e.target)) return
    setPopup(null)
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [])

  /* ── Hide popup on scroll so it doesn't drift ── */
  const handleScroll = useCallback(() => {
    setPopup(null)
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [])

  useEffect(() => {
    document.addEventListener("mouseup",   handleMouseUp)
    document.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("scroll",      handleScroll, { passive: true })
    return () => {
      document.removeEventListener("mouseup",   handleMouseUp)
      document.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("scroll",      handleScroll)
    }
  }, [handleMouseUp, handleMouseDown, handleScroll])

  /* ── Stop speech when language changes ── */
  useEffect(() => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }, [i18n.language])

  /* ── Speak ── */
  const speak = () => {
    if (!popup?.text) return
    window.speechSynthesis.cancel()
    const utter = new SpeechSynthesisUtterance(popup.text)
    utter.lang  = LANG_MAP[i18n.language] ?? "en-IN"
    utter.rate  = 0.95
    utter.pitch = 1
    utter.onstart = () => setSpeaking(true)
    utter.onend   = () => setSpeaking(false)
    utter.onerror = () => setSpeaking(false)
    window.speechSynthesis.speak(utter)
  }

  const stop = () => {
    window.speechSynthesis?.cancel()
    setSpeaking(false)
  }

  if (!popup) return null

  return (
    <div
      ref={popupRef}
      style={{
        position: "fixed",
        left: popup.x,
        top:  popup.y,
        transform: "translate(-50%, -100%)",
        zIndex: 9999,
      }}
      className="flex items-center gap-2 bg-slate-800 text-white text-xs font-medium px-3 py-1.5 rounded-full shadow-xl select-none pointer-events-auto"
    >
      {speaking ? (
        <>
          {/* animated bars */}
          <span className="flex items-end gap-[2px] h-3.5">
            {[1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="w-[3px] bg-emerald-400 rounded-full animate-pulse"
                style={{
                  height: `${[60, 100, 80, 55][i - 1]}%`,
                  animationDelay: `${(i - 1) * 0.12}s`,
                }}
              />
            ))}
          </span>
          <span className="text-emerald-300">Speaking…</span>
          <button
            onMouseDown={(e) => { e.stopPropagation(); stop() }}
            className="ml-0.5 text-red-400 hover:text-red-200 leading-none transition"
            title="Stop"
          >
            ■
          </button>
        </>
      ) : (
        <button
          onMouseDown={(e) => { e.stopPropagation(); speak() }}
          className="flex items-center gap-1.5 hover:text-emerald-300 transition"
          title="Click to speak selected text"
        >
          {/* mic icon */}
          <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.91-3c-.49 0-.9.36-.98.85C16.52 14.2 14.47 16 12 16s-4.52-1.8-4.93-4.15c-.08-.49-.49-.85-.98-.85-.61 0-1.09.54-1 1.14.49 3 2.89 5.35 5.91 5.78V20c0 .55.45 1 1 1s1-.45 1-1v-2.08c3.02-.43 5.42-2.78 5.91-5.78.1-.6-.39-1.14-1-1.14z"/>
          </svg>
          <span className="text-[11px]">🔊 Speak</span>
        </button>
      )}

      {/* downward caret */}
      <span
        className="absolute left-1/2 -translate-x-1/2 -bottom-[6px] border-[6px] border-transparent border-t-slate-800"
        style={{ top: "100%", bottom: "unset" }}
      />
    </div>
  )
}
