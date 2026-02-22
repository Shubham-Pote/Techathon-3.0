import { useAuth } from "../context/AuthContext"
import { useTranslation } from "react-i18next"
import LanguageToggle from "./LanguageToggle"
import HelpCenterButton from "./HelpCenterButton"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaLeaf, FaBars, FaTimes } from "react-icons/fa"

export default function Navbar() {
  const { logout, user } = useAuth()
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : ""
    return () => { document.body.style.overflow = "" }
  }, [mobileOpen])

  const isHome = location.pathname === "/home"
  const isTransparent = isHome && !scrolled && !mobileOpen

  return (
    <header
      className={[
        "sticky top-0 z-50 mx-auto w-full border-b border-transparent",
        "md:rounded-xl md:border md:transition-all md:duration-500 md:ease-out",
        scrolled && !mobileOpen
          ? "bg-white/90 supports-[backdrop-filter]:bg-white/70 border-gray-200/60 backdrop-blur-xl md:top-3 md:max-w-5xl md:shadow-lg"
          : isTransparent
            ? "bg-transparent md:max-w-full"
            : "bg-white md:max-w-full",
        mobileOpen ? "bg-white" : "",
      ].join(" ")}
    >
      <nav
        className={[
          "flex w-full items-center justify-between px-4 sm:px-6",
          "md:transition-all md:duration-500 md:ease-out",
          scrolled ? "h-14 md:px-4" : "h-16 md:px-6",
        ].join(" ")}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => navigate("/home")}
        >
          <div className={[
            "rounded-xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300",
            isTransparent ? "bg-white/20 backdrop-blur-sm" : "bg-gradient-to-br from-green-600 to-emerald-400",
            scrolled ? "w-8 h-8" : "w-9 h-9",
          ].join(" ")}>
            <FaLeaf className="text-white" size={scrolled ? 14 : 16} />
          </div>
          <span className={[
            "font-bold tracking-tight transition-all duration-300",
            isTransparent ? "text-white" : "text-gray-900 group-hover:text-green-700",
            scrolled ? "text-[16px]" : "text-[18px]",
          ].join(" ")}>
            Krishiculture
          </span>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageToggle transparent={isTransparent} />
          <HelpCenterButton transparent={isTransparent} />
          <button
            onClick={() => {
              if (user) logout()
              else navigate("/login")
            }}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
              user
                ? isTransparent
                  ? "text-white/80 border border-white/30 hover:bg-white/10"
                  : "text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                : "bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md"
            }`}
          >
            {!user ? t("nav.login") : t("nav.logout")}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden w-10 h-10 rounded-lg border flex items-center justify-center transition ${
            isTransparent
              ? "border-white/30 text-white hover:bg-white/10"
              : "border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={[
          "fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl md:hidden",
          mobileOpen ? "block" : "hidden",
        ].join(" ")}
      >
        <div className="flex h-full w-full flex-col justify-between gap-y-2 p-5">
          <div className="grid gap-y-2">
            <LanguageToggle />
            <HelpCenterButton />
          </div>
          <div className="flex flex-col gap-2 pb-6">
            <button
              onClick={() => {
                if (user) logout()
                else navigate("/login")
                setMobileOpen(false)
              }}
              className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all ${
                user
                  ? "text-gray-600 border border-gray-200 hover:bg-gray-50"
                  : "bg-green-600 text-white hover:bg-green-700"
              }`}
            >
              {!user ? t("nav.login") : t("nav.logout")}
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}