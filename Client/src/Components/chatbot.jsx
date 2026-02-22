import { useState, useRef, useEffect } from "react"
import { FaMicrophone, FaPaperPlane, FaTimes, FaRedo, FaLeaf } from "react-icons/fa"
import botImage from "../assets/features/bot-img.png"
import { useTranslation } from "react-i18next"
import api from "../utils/api"

const VOICE_LOCALE_MAP = {
  en: "en-IN", hi: "hi-IN", mr: "mr-IN", ta: "ta-IN", te: "te-IN",
  kn: "kn-IN", bn: "bn-IN", gu: "gu-IN", pa: "pa-IN", ml: "ml-IN",
  or: "or-IN", as: "as-IN", ur: "ur-IN", ks: "ks-IN", mai: "mai-IN",
}

const FAQ_GROUPS = [
  ["faq1", "faq2", "faq3"],
  ["faq4", "faq5", "faq6"],
  ["faq7", "faq8", "faq9"],
  ["faq10", "faq11", "faq12"],
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-green-400 animate-bounce"
          style={{ animationDelay: `${i * 0.18}s`, animationDuration: "0.9s" }}
        />
      ))}
    </div>
  )
}

export default function Chatbot() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language

  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [faqGroupIndex, setFaqGroupIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)

  const messagesEndRef = useRef(null)
  const recognitionRef = useRef(null)
  const prevLangRef = useRef(lang)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: "bot", text: t("chatbot.greeting") }])
      setFaqGroupIndex(0)
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
  }, [open])

  useEffect(() => {
    if (prevLangRef.current !== lang && open && messages.length > 0) {
      setMessages((prev) => [...prev, { role: "bot", text: t("chatbot.greeting") }])
      setFaqGroupIndex(0)
    }
    prevLangRef.current = lang
  }, [lang])

  const currentFaqs = FAQ_GROUPS[faqGroupIndex].map((key) => t(`chatbot.${key}`))

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return
    const userMsg = { role: "user", text: text.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setLoading(true)
    setTimeout(() => inputRef.current?.focus(), 50)
    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role === "bot" ? "assistant" : "user",
        text: m.text,
      }))
      const res = await api.post("/chatbot", { message: text.trim(), language: lang, history })
      const reply = res.data?.data?.reply || t("chatbot.error")
      setMessages((prev) => [...prev, { role: "bot", text: reply }])
      setFaqGroupIndex((prev) => (prev + 1) % FAQ_GROUPS.length)
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: t("chatbot.error") }])
    } finally {
      setLoading(false)
    }
  }

  const startVoice = () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) { alert(t("chatbot.voiceNotSupported")); return }
    const recognition = new SR()
    recognition.lang = VOICE_LOCALE_MAP[lang] || "en-IN"
    setIsListening(true)
    recognition.start()
    recognition.onresult = (e) => { sendMessage(e.results[0][0].transcript); setIsListening(false) }
    recognition.onend = () => setIsListening(false)
    recognitionRef.current = recognition
  }

  const clearChat = () => {
    setMessages([{ role: "bot", text: t("chatbot.greeting") }])
    setFaqGroupIndex(0)
    inputRef.current?.focus()
  }

  return (
    <>
      {/* Floating Trigger */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-6 right-6 z-[9999] group flex items-center gap-0 hover:gap-3 transition-all duration-300 cursor-pointer"
          aria-label="Open Krishi Mitra"
          style={{ pointerEvents: 'auto' }}
        >
          {/* Pill label — slides in on hover */}
          <span className="overflow-hidden max-w-0 group-hover:max-w-[220px] transition-all duration-300 ease-in-out">
            <span className="whitespace-nowrap bg-white text-green-700 font-semibold text-[13px] px-3 py-1.5 rounded-full shadow-md border border-green-100 mr-1">
              How can I help you?
            </span>
          </span>

          {/* Free image */}
          <div className="relative shrink-0 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-200 drop-shadow-xl pointer-events-none">
            <img src={botImage} alt="Krishi Mitra" className="w-[80px] h-auto object-contain pointer-events-none" />
            {/* Online dot */}
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 border-2 border-white rounded-full shadow" />
          </div>
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          style={{ width: "min(460px, calc(100vw - 32px))", maxHeight: "calc(100vh - 32px)" }}
          className="fixed bottom-4 right-4 z-50 bg-white rounded-2xl shadow-[0_16px_70px_rgba(0,0,0,0.20)] flex flex-col overflow-hidden border border-gray-200"
        >
          {/* ── Header (myScheme-style: white bg) ── */}
          <div className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center gap-3 shrink-0 shadow-[0_1px_4px_rgba(0,0,0,0.06)]">
            {/* Logo */}
            <div className="relative shrink-0">
              <img src={botImage} alt="Krishi Mitra" className="w-12 h-12 object-contain" />
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 border-2 border-white rounded-full" />
            </div>

            {/* Title + badge */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-gray-900 font-bold text-[16px] leading-tight tracking-tight">
                  {t("chatbot.title")}
                </p>
                <span className="text-[10px] font-semibold bg-green-100 text-green-700 px-2 py-[2px] rounded-full border border-green-200 leading-none">
                  Chat
                </span>
              </div>
              <p className="text-gray-400 text-[11px] mt-0.5 leading-none">Krishiculture • Always Online</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-0.5 shrink-0">
              <button
                onClick={clearChat}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition"
                title="New chat"
              >
                <FaRedo size={11} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-2 rounded-lg transition"
              >
                <FaTimes size={14} />
              </button>
            </div>
          </div>

          {/* ── Messages ── */}
          <div className="flex-1 overflow-y-auto bg-[#f8f9fb] px-5 py-5 space-y-4 min-h-0">
            {messages.map((m, i) => {
              const isLast = i === messages.length - 1
              const isBot = m.role === "bot"
              const isFirstBot = isBot && i === 0

              return (
                <div key={i} className={`flex flex-col ${isBot ? "items-start" : "items-end"} gap-2.5`}>

                  {/* First bot message → prominent intro card */}
                  {isFirstBot ? (
                    <div className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm px-5 py-4">
                      <div className="flex items-center gap-2.5 mb-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                          <FaLeaf className="text-white" size={12} />
                        </div>
                        <span className="font-bold text-gray-900 text-[15px]">{t("chatbot.title")}</span>
                      </div>
                      <p className="text-gray-700 text-[13.5px] leading-relaxed">{m.text}</p>
                    </div>
                  ) : isBot ? (
                    /* Regular bot bubble */
                    <div className="flex items-end gap-2 max-w-[90%]">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center shrink-0 mb-0.5 shadow-sm">
                        <FaLeaf className="text-white" size={9} />
                      </div>
                      <div className="bg-white text-gray-800 px-4 py-3 rounded-2xl rounded-tl-sm text-[13.5px] leading-relaxed whitespace-pre-wrap break-words shadow-sm border border-gray-100">
                        {m.text}
                      </div>
                    </div>
                  ) : (
                    /* User bubble */
                    <div className="max-w-[80%] bg-green-600 text-white px-4 py-3 rounded-2xl rounded-tr-sm text-[13.5px] leading-relaxed whitespace-pre-wrap break-words shadow-sm">
                      {m.text}
                    </div>
                  )}

                  {/* FAQ suggestion chips — only after last bot message */}
                  {isBot && isLast && !loading && (
                    <div className="w-full space-y-2 mt-0.5">
                      <p className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-widest text-center mb-1">
                        {t("chatbot.suggestedQuestions")}
                      </p>
                      {currentFaqs.map((faq, fi) => (
                        <button
                          key={fi}
                          onClick={() => sendMessage(faq)}
                          className="w-full text-center text-[13px] font-medium text-gray-700 bg-white border border-gray-200 hover:border-green-400 hover:text-green-700 hover:bg-green-50 hover:shadow-md px-4 py-2.5 rounded-xl transition-all duration-150 active:scale-[0.98] shadow-sm"
                        >
                          {faq}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {/* Typing indicator */}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-green-600 to-emerald-400 flex items-center justify-center shrink-0 shadow-sm">
                  <FaLeaf className="text-white" size={9} />
                </div>
                <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Disclaimer ── */}
          <div className="bg-[#f8f9fb] border-t border-gray-100 px-5 py-2 shrink-0">
            <p className="text-center text-[11px] text-gray-400 leading-snug">
              *Krishi Mitra can make mistakes. Consider checking important information.
            </p>
          </div>

          {/* ── Input Bar ── */}
          <div className="flex items-center gap-2.5 px-4 py-3 bg-white border-t border-gray-100 shrink-0">
            <input
              ref={inputRef}
              className="flex-1 bg-[#f8f9fb] border border-gray-200 rounded-xl px-4 py-2.5 text-[13.5px] text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-green-400 focus:bg-white transition"
              placeholder={t("chatbot.placeholder")}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage(input)}
            />
            <button
              onClick={startVoice}
              disabled={loading}
              className={`shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border transition ${
                isListening
                  ? "bg-red-500 text-white border-red-500 animate-pulse"
                  : "text-gray-400 border-gray-200 hover:text-green-600 hover:bg-green-50 hover:border-green-300"
              }`}
              title="Voice input"
            >
              <FaMicrophone size={14} />
            </button>
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl bg-green-600 text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm active:scale-95"
            >
              <FaPaperPlane size={13} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
