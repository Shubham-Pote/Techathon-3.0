import { useTranslation } from "react-i18next"
import SchemeSearch from "./SchemeSearch"
import field from "../assets/features/hero.jpeg"

export default function HeroHeader({ search, setSearch }) {
  const { t } = useTranslation()

  function submit(query) {
    setSearch(query)
    document.getElementById("scheme-results").focus()
  }

  return (
    <section className="kc-shell kc-directory-hero" aria-labelledby="directory-heading">
      <div>
        <p className="kc-kicker">{t("landing.farmSupport")}</p>
        <h1 className="kc-display" id="directory-heading">{t("schemes.heading")}</h1>
        <p>{t("hero.subtitle")}</p>
        <SchemeSearch value={search} onChange={setSearch} onSearch={submit} />
      </div>
      <img src={field} alt="" />
    </section>
  )
}
