import { Link, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { FiArrowRight, FiArrowUpRight, FiCheckCircle, FiClipboard, FiSearch, FiShield } from "react-icons/fi"
import { LuSprout, LuWheat } from "react-icons/lu"
import EditorialHero from "../Components/EditorialHero"
import SchemeSearch from "../Components/SchemeSearch"

const topics = [
  { category: "SUBSIDY", label: "landing.subsidies", description: "landing.subsidyDescription", icon: LuSprout },
  { category: "INSURANCE", label: "nav.insurance", description: "landing.insuranceDescription", icon: FiShield },
  { category: "WELFARE", label: "landing.farmerWelfare", description: "landing.welfareDescription", icon: LuWheat },
]

const steps = [
  { title: "landing.findStep", description: "schemes.filtersDesc", icon: FiSearch },
  { title: "landing.checkYourEligibility", description: "landing.eligibilityDescription", icon: FiCheckCircle },
  { title: "landing.applyStep", description: "landing.applicationGuide", icon: FiClipboard },
]

export default function LandingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  function searchSchemes(query) {
    navigate(query ? "/home?" + new URLSearchParams({ q: query }) : "/home")
  }

  return (
    <main id="main-content" tabIndex={-1}>
      <EditorialHero
        tagline={t("landing.farmSupport")}
        title={t("hero.title1")}
        accent={t("hero.title2")}
        description={t("landing.heroSubtitle")}
        landscapeImage="/field-portrait.webp"
      >
        <SchemeSearch onSearch={searchSchemes} />
        <div className="kc-hero-links">
          <Link className="kc-text-link" to="/home">{t("landing.exploreSchemes")} <FiArrowRight aria-hidden="true" /></Link>
          <Link className="kc-text-link" to="/login">{t("landing.checkYourEligibility")} <FiArrowUpRight aria-hidden="true" /></Link>
        </div>
      </EditorialHero>

      <section id="browse-support" className="kc-topic-section" aria-labelledby="topic-heading">
        <div className="kc-shell">
          <div className="kc-section-heading">
            <h2 id="topic-heading" className="kc-display">{t("landing.supportTypes")}</h2>
            <Link className="kc-text-link" to="/home">{t("schemes.allSchemes")} <FiArrowRight aria-hidden="true" /></Link>
          </div>
          <ul className="kc-topic-grid">
            {topics.map((topic) => (
              <li key={topic.category}>
                <Link className="kc-topic" data-category={topic.category} to={"/home?category=" + topic.category}>
                  <span className="kc-topic-icon"><topic.icon aria-hidden="true" /></span>
                  <span className="kc-topic-title">{t(topic.label)}</span>
                  <span className="kc-topic-description">{t(topic.description)}</span>
                  <FiArrowUpRight aria-hidden="true" className="kc-topic-arrow" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="how-it-works" className="kc-guide" aria-labelledby="guide-heading">
        <div className="kc-shell kc-guide-layout">
          <div>
            <h2 id="guide-heading" className="kc-display">{t("nav.howItWorks")}</h2>
            <Link className="kc-button" to="/home">{t("landing.exploreSchemes")} <FiArrowRight aria-hidden="true" /></Link>
          </div>
          <ol className="kc-guide-steps">
            {steps.map((step) => (
              <li key={step.title}>
                <step.icon aria-hidden="true" />
                <div><h3>{t(step.title)}</h3><p>{t(step.description)}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </main>
  )
}
