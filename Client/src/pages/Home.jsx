import Navbar from "../Components/Navbar"
import HeroHeader from "../Components/HeroHeader"
import SchemePage from "../Components/SchemePage"
import { useState } from "react"

export default function Home() {
  const [search, setSearch] = useState("")

  return (
    <>
      <Navbar />
      <HeroHeader search={search} setSearch={setSearch} />
      <SchemePage search={search} />
    </>
  )
}
