import { useAuth } from "../context/AuthContext"
import { useTranslation } from "react-i18next"
import LanguageToggle from "./LanguageToggle"
import WeatherButton from "./WeatherButton"
import HelpCenterButton from "./HelpCenterButton"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function Navbar({ variant }) {
  const { logout, user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (location.pathname === "/home") {
      const handleScroll = () => setScrolled(window.scrollY > 50)
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [location])

  const isHome = location.pathname === "/home"

  const navbarStyle = isHome
    ? scrolled
      ? "bg-gradient-to-r from-emerald-900/95 via-emerald-800/95 to-emerald-700/95 shadow-lg backdrop-blur-md border-b border-emerald-800/60"
      : "bg-transparent border-b border-transparent"
    : "bg-emerald-900 shadow-md border-b border-emerald-800/70"

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navbarStyle} text-white`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-8 py-3">

        {/* LEFT */}
        <div
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition -ml-30"
          onClick={() => navigate("/home")}
        >
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-sm">
            {/* Leaf-in-circle logomark */}
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="w-5 h-5 text-emerald-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <circle cx="12" cy="12" r="9" className="opacity-70" />
              <path
                d="M9.5 14.5c3 0 5.8-2 6.5-6-4 0-6.5 2.5-6.5 6Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M9.5 14.5c0 1.5.5 2.5 1.5 3.5"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <h1 className="text-lg sm:text-xl font-bold tracking-tight">
            Krishiculture
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex gap-2 sm:gap-4 items-center text-sm font-medium -mr-20">

          <LanguageToggle />

          <HelpCenterButton />

          <WeatherButton />

          <button
            onClick={() => {
              if (user) logout()
              else navigate("/login")
            }}
            className="
              px-3 sm:px-5 py-2 rounded-xl text-xs sm:text-sm
              bg-white/10 border border-white/20
              hover:bg-white hover:text-emerald-900
              transition-all font-semibold shadow-sm
            "
          >
            {!user ? t('nav.login') : t('nav.logout')}
          </button>

        </div>
      </div>
    </nav>
  )
}