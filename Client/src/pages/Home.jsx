import Navbar from "../Components/Navbar"
import SchemeGrid from "../Components/SchemeGrid"
import FeatureCards from "../Components/FeatureCards"
import VoiceButton from "../Components/VoiceButton"
import { useLang } from "../context/LanguageContext"
import Chatbot from "../Components/chatbot"

export default function Home() {
  const { t } = useLang()

  return (
    <>
      <Navbar />
      <FeatureCards />

      <div className="p-4">
        <h2 className="text-xl font-semibold mb-4">{t.title}</h2>
        <SchemeGrid />
      </div>

      <VoiceButton />
      <Chatbot />
    </>
  )
}
