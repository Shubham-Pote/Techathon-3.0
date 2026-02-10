export default function VoiceButton() {
  const speak = () => {
    const msg = new SpeechSynthesisUtterance(
      "You can browse schemes or login to check eligibility"
    )
    window.speechSynthesis.speak(msg)
  }

  return (
    <button
      onClick={speak}
      className="fixed bottom-24 right-4 bg-green-600 text-white p-4 rounded-full shadow-lg"
    >
      🎤
    </button>
  )
}
