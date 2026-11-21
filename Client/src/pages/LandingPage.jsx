import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { FiArrowRight, FiCheckCircle, FiClipboard, FiSearch, FiShield } from "react-icons/fi"
import { LuSprout, LuWheat } from "react-icons/lu"
import Navbar from "../Components/Navbar"
import SchemeSearch from "../Components/SchemeSearch"
import farmer from "../assets/features/img8.jpeg"

const topics = [
  { category: "SUBSIDY", label: "landing.subsidies", icon: LuSprout },
  { category: "INSURANCE", label: "nav.insurance", icon: FiShield },
  { category: "WELFARE", label: "landing.farmerWelfare", icon: LuWheat },
]

export default function LandingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function searchSchemes(query) {
    navigate(query ? `/home?${new URLSearchParams({ q: query })}` : "/home")
  }

  return (
    <>
      <Navbar />
      <main id="main-content" tabIndex={-1}>
        <section className="kc-shell kc-landing-hero" aria-labelledby="landing-heading">
          <div className="kc-hero-copy">
            <p className="kc-kicker"><LuSprout aria-hidden="true" /> {t("landing.farmSupport")}</p>
            <h1 id="landing-heading" className="kc-display">
              {t("hero.title1")} <em>{t("hero.title2")}</em>
            </h1>
            <p className="kc-hero-description">{t("landing.heroSubtitle")}</p>
            <SchemeSearch onSearch={searchSchemes} />
            <div className="kc-hero-links">
              <Link className="kc-text-link" to="/home">{t("landing.exploreSchemes")} <FiArrowRight aria-hidden="true" /></Link>
              <Link className="kc-text-link" to="/login"><FiCheckCircle aria-hidden="true" /> {t("landing.checkYourEligibility")}</Link>
            </div>
          </div>
          <div className="kc-hero-photo">
            <img src={farmer} alt="" fetchPriority="high" />
          </div>
        </section>

        <section className="kc-shell kc-topic-section" aria-labelledby="topic-heading">
          <div className="kc-section-heading">
            <h2 id="topic-heading" className="kc-display">{t("landing.supportTypes")}</h2>
          </div>
          <div className="kc-topic-grid">
            {topics.map((topic) => (
              <Link key={topic.category} className="kc-topic" to={`/home?category=${topic.category}`}>
                <span className="kc-topic-icon"><topic.icon aria-hidden="true" /></span>
                <span>{t(topic.label)}</span>
                <FiArrowRight aria-hidden="true" className="kc-topic-arrow" />
              </Link>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="kc-how">
          <div className="kc-shell">
            <h2 className="kc-display">{t("nav.howItWorks")}</h2>
            <ol className="kc-steps">
              <li><FiSearch aria-hidden="true" /><h3>{t("landing.exploreSchemes")}</h3><p>{t("schemes.filtersDesc")}</p></li>
              <li><FiCheckCircle aria-hidden="true" /><h3>{t("landing.checkYourEligibility")}</h3><p>{t("landing.steps.0.desc")}</p></li>
              <li><FiClipboard aria-hidden="true" /><h3>{t("schemeDetail.sidebar.process")}</h3><p>{t("landing.applicationGuide")}</p></li>
            </ol>
            <Link className="kc-button kc-button-light" to="/home">{t("landing.exploreSchemes")} <FiArrowRight aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
      <footer className="kc-shell kc-footer">
        <Link to="/" className="kc-brand"><LuSprout aria-hidden="true" /> Krishiculture</Link>
        <span>{t("landing.farmSupport")}</span>
      </footer>
    </>
  )
}
