import HeroHeader from "../Components/HeroHeader"
import SchemePage from "../Components/SchemePage"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

export default function Home() {
  const [params] = useSearchParams()
  const query = params.get("q") || ""
  const category = params.get("category")

  return <Directory key={params.toString()} initialSearch={query} category={category} />
}

function Directory({ initialSearch, category }) {
  const [search, setSearch] = useState(initialSearch)

  return (
    <main id="main-content" tabIndex={-1}>
      <HeroHeader search={search} setSearch={setSearch} />
      <SchemePage search={search} category={category} />
    </main>
  )
}
