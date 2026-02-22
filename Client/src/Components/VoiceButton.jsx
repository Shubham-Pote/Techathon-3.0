import { FaMicrophone } from "react-icons/fa"
import { useState } from "react"

export default function VoiceButton() {
  const [speaking, setSpeaking] = useState(false)

  const speak = () => {
    if (speaking) {
      window.speechSynthesis.cancel()
      setSpeaking(false)
      return
    }
    const msg = new SpeechSynthesisUtterance(
      "You can browse schemes or login to check eligibility"
    )
    msg.onend = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(msg)
  }

  return (
    <button
      onClick={speak}
      className={`fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 ${
        speaking
          ? "bg-red-500 hover:bg-red-600 animate-pulse"
          : "bg-green-600 hover:bg-green-700 hover:scale-105"
      } text-white`}
      title="Read page aloud"
    >
      <FaMicrophone size={18} />
    </button>
  )
}
