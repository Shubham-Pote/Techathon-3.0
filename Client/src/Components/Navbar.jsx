import { Link, NavLink, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { FiArrowUpRight } from "react-icons/fi"
import { LuWheat } from "react-icons/lu"
import { useAuth } from "../context/AuthContext"
import LanguageToggle from "./LanguageToggle"
import HelpCenterButton from "./HelpCenterButton"

export default function Navbar() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()
  const { t } = useTranslation()

  return (
    <header className="kc-header">
      <a className="kc-skip" href="#main-content">{t("nav.skipToMain")}</a>
      <div className="kc-shell kc-header-inner">
        <Link to="/" className="kc-brand">
          <span className="kc-brand-mark"><LuWheat aria-hidden="true" /></span>Krishiculture
        </Link>
        <nav className="kc-nav" aria-label={t("nav.primary")}>
          <NavLink to="/home" className={pathname.startsWith("/schemes/") ? "kc-current" : undefined}>{t("nav.schemes")}</NavLink>
          {pathname === "/" && <a href="#how-it-works">{t("nav.howItWorks")}</a>}
        </nav>
        <div className="kc-nav-actions">
          <LanguageToggle />
          {pathname !== "/" && !pathname.startsWith("/login") && <HelpCenterButton />}
          {user ? (
            <button type="button" className="kc-button kc-nav-login" onClick={logout}>{t("nav.logout")}</button>
          ) : pathname !== "/login" && (
            <Link className="kc-button kc-nav-login" to="/login">{t("nav.login")} <FiArrowUpRight aria-hidden="true" /></Link>
          )}
        </div>
      </div>
    </header>
  )
}
