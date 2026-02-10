import { useState, useRef } from "react"
import { FaRobot, FaMicrophone, FaPaperPlane } from "react-icons/fa"

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: "bot", text: "👋 Hello Farmer! Ask me about schemes or insurance." }
  ])
  const [input, setInput] = useState("")

  const recognitionRef = useRef(null)

  // =====================
  // SEND MESSAGE (mock now)
  // =====================
  const sendMessage = (text) => {
    if (!text.trim()) return

    const newMsgs = [...messages, { role: "user", text }]
    setMessages(newMsgs)
    setInput("")

    // 🤖 fake reply (for now)
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "✅ I will help you with this. Backend will be connected soon."
        }
      ])
    }, 800)
  }

  // =====================
  // 🎤 Voice Recognition
  // =====================
  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert("Voice not supported in this browser")
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = "en-IN"
    recognition.start()

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript
      sendMessage(text)
    }

    recognitionRef.current = recognition
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setOpen(!open)}
        className="
          fixed bottom-6 right-6
          bg-green-600
          text-white
          p-4
          rounded-full
          shadow-xl
          hover:scale-110
          transition
        "
      >
        <FaRobot size={22} />
      </button>

      {/* Chat Window */}
      {open && (
        <div
          className="
            fixed bottom-20 right-6
            w-[320px]
            h-[420px]
            bg-white
            rounded-xl
            shadow-2xl
            flex flex-col
            overflow-hidden
          "
        >
          {/* Header */}
          <div className="bg-green-600 text-white p-3 font-semibold">
            Farmer Assistant 🌾
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`p-2 rounded-lg text-sm max-w-[80%] ${
                  m.role === "user"
                    ? "bg-green-500 text-white ml-auto"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {m.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="flex items-center p-2 gap-2 border-t">
            <button
              onClick={startVoice}
              className="text-green-600"
            >
              <FaMicrophone />
            </button>

            <input
              className="flex-1 border rounded px-2 py-1 text-sm"
              placeholder="Ask your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
            />

            <button
              onClick={() => sendMessage(input)}
              className="text-green-600"
            >
              <FaPaperPlane />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
