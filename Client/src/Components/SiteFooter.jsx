import { Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { LuWheat } from "react-icons/lu"

export default function SiteFooter() {
  const { t } = useTranslation()
  return (
    <footer className="kc-footer">
      <div className="kc-shell">
        <Link to="/" className="kc-brand"><span className="kc-brand-mark"><LuWheat aria-hidden="true" /></span>Krishiculture</Link>
        <Link className="kc-text-link" to="/home">{t("nav.schemes")}</Link>
      </div>
    </footer>
  )
}
