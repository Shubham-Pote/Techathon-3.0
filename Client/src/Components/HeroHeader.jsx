import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { FiArrowUpRight } from "react-icons/fi"
import { useAuth } from "../context/AuthContext"
import SchemeSearch from "./SchemeSearch"

export default function HeroHeader({ search, setSearch }) {
  const { t } = useTranslation()
  const { user } = useAuth()

  function submit(query) {
    setSearch(query)
    document.getElementById("scheme-results")?.focus()
  }

  return (
    <section className="kc-directory-hero" aria-labelledby="directory-heading">
      <div className="kc-shell kc-directory-intro">
        <div>
          <p className="kc-kicker">{t("landing.farmSupport")}</p>
          <h1 className="kc-display" id="directory-heading">{t("schemes.heading")}</h1>
          <p>{t("hero.subtitle")}</p>
        </div>
        <div>
          <SchemeSearch value={search} onChange={setSearch} onSearch={submit} />
          {!user && <Link className="kc-text-link" to="/login">{t("landing.checkYourEligibility")} <FiArrowUpRight aria-hidden="true" /></Link>}
        </div>
      </div>
    </section>
  )
}
