import { useEffect, useRef, useState } from "react"
import { useReducedMotion } from "framer-motion"
import { FiMessageCircle, FiMic, FiRotateCcw, FiSend, FiX } from "react-icons/fi"
import { useTranslation } from "react-i18next"
import api from "../utils/api"

const FAQ_GROUPS = [
  ["faq1", "faq2", "faq3"],
  ["faq4", "faq5", "faq6"],
  ["faq7", "faq8", "faq9"],
  ["faq10", "faq11", "faq12"],
]

export default function Chatbot() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language
  const reduceMotion = useReducedMotion()
  const dialog = useRef(null)
  const composer = useRef(null)
  const log = useRef(null)
  const recognition = useRef(null)
  const pending = useRef(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceError, setVoiceError] = useState("")
  const [faqGroup, setFaqGroup] = useState(0)

  useEffect(() => {
    log.current?.scrollTo({ top: log.current.scrollHeight, behavior: reduceMotion ? "instant" : "smooth" })
  }, [messages, loading, reduceMotion])

  useEffect(() => () => {
    pending.current?.abort()
    recognition.current?.abort()
  }, [])

  async function sendMessage(value) {
    const message = value.trim()
    if (!message || pending.current) return

    const request = new AbortController()
    pending.current = request
    const history = [...messages, { role: "user", text: message }]
    setMessages(history)
    setInput("")
    setLoading(true)
    composer.current?.focus()

    try {
      const response = await api.post("/chatbot", { message, language: lang, history }, { signal: request.signal })
      setMessages((previous) => [...previous, { role: "assistant", text: response.data?.data?.reply || t("chatbot.error") }])
      setFaqGroup((index) => (index + 1) % FAQ_GROUPS.length)
    } catch {
      if (!request.signal.aborted) setMessages((previous) => [...previous, { role: "assistant", text: t("chatbot.error") }])
    } finally {
      if (pending.current === request) {
        pending.current = null
        setLoading(false)
      }
    }
  }

  function resetChat() {
    pending.current?.abort()
    pending.current = null
    setLoading(false)
    setMessages([])
    setFaqGroup(0)
    setInput("")
    setVoiceError("")
    composer.current?.focus()
  }

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setVoiceError("")
    if (!SpeechRecognition) {
      setVoiceError(t("chatbot.voiceNotSupported"))
      return
    }

    const speech = new SpeechRecognition()
    recognition.current = speech
    speech.lang = lang + "-IN"
    speech.onresult = (event) => sendMessage(event.results[0][0].transcript)
    speech.onerror = (event) => {
      if (event.error !== "aborted") setVoiceError(t("chatbot.voiceError"))
    }
    speech.onend = () => {
      recognition.current = null
      setListening(false)
    }
    speech.start()
    setListening(true)
  }

  return (
    <>
      <button
        type="button"
        onClick={() => { dialog.current.showModal(); composer.current.focus() }}
        className="kc-chat-trigger"
        aria-haspopup="dialog"
        aria-label={t("chatbot.open")}
      >
        <FiMessageCircle aria-hidden="true" />
        <span>{t("chatbot.name")}</span>
      </button>
      <dialog
        ref={dialog}
        className="kc-chat"
        aria-labelledby="chat-title"
        onClose={() => recognition.current?.abort()}
      >
        <header className="kc-chat-header">
          <span className="kc-brand-mark"><FiMessageCircle aria-hidden="true" /></span>
          <h2 id="chat-title">{t("chatbot.name")}</h2>
          <button type="button" className="kc-nav-control" onClick={resetChat} aria-label={t("chatbot.reset")}><FiRotateCcw aria-hidden="true" /></button>
          <button type="button" className="kc-nav-control" onClick={() => dialog.current.close()} aria-label={t("chatbot.close")}><FiX aria-hidden="true" /></button>
        </header>
        <div className="kc-chat-log" ref={log}>
          <div role="log" aria-live="polite" className="kc-chat-messages">
            <p className="kc-chat-message">{t("chatbot.greeting")}</p>
            {messages.map((item, index) => (
              <p key={index} className="kc-chat-message" data-role={item.role}>{item.text}</p>
            ))}
            {loading && <p className="kc-chat-message">{t("chatbot.sending")}</p>}
          </div>
          {!loading && (
            <div className="kc-chat-faq">
              <p>{t("chatbot.suggestedQuestions")}</p>
              {FAQ_GROUPS[faqGroup].map((key) => (
                <button type="button" key={key} onClick={() => sendMessage(t("chatbot." + key))}>{t("chatbot." + key)}</button>
              ))}
            </div>
          )}
        </div>
        {voiceError && <p className="kc-chat-note" role="alert">{voiceError}</p>}
        <p className="kc-chat-note">{t("chatbot.note")}</p>
        <form className="kc-chat-form" onSubmit={(event) => { event.preventDefault(); sendMessage(input) }}>
          <input
            ref={composer}
            aria-label={t("chatbot.placeholder")}
            placeholder={t("chatbot.placeholder")}
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
          <button type="button" className="kc-button kc-button-outline" onClick={startVoice} aria-pressed={listening} aria-label={t("chatbot.voice")} disabled={loading || listening}>
            <FiMic aria-hidden="true" />
          </button>
          <button type="submit" className="kc-button" aria-label={t("chatbot.send")} disabled={loading || !input.trim()}><FiSend aria-hidden="true" /></button>
        </form>
      </dialog>
    </>
  )
}
