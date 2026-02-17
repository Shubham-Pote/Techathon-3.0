import Navbar from "../Components/Navbar"
import HeroHeader from "../Components/HeroHeader"
import SchemePage from "../Components/SchemePage"
import VoiceButton from "../Components/VoiceButton"
import Chatbot from "../Components/chatbot"
import { useState } from "react"

export default function Home() {
  const [search, setSearch] = useState("")

  return (
    <>
      <Navbar />
      <HeroHeader search={search} setSearch={setSearch} />
      <SchemePage search={search} />
      <VoiceButton />
      <Chatbot />
    </>
  )
}
