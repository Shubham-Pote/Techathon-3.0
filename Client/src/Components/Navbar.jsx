import { useAuth } from "../context/AuthContext"
import { useTranslation } from "react-i18next"
import LanguageToggle from "./LanguageToggle"
import HelpCenterButton from "./HelpCenterButton"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { FaBars, FaTimes } from "react-icons/fa"
import logo from "../assets/features/logo.jpeg"

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
        "sticky top-0 z-50 mx-auto w-full",
        "md:rounded-2xl md:border md:transition-all md:duration-500 md:ease-out",
        scrolled && !mobileOpen
          ? "bg-white/95 supports-[backdrop-filter]:bg-white/80 border-b border-slate-200/50 backdrop-blur-xl md:top-4 md:max-w-5xl md:shadow-lg md:shadow-slate-200/40"
          : isTransparent
            ? "bg-transparent border-transparent md:max-w-full"
            : "bg-white border-b border-slate-100 md:max-w-full",
        mobileOpen ? "bg-white border-b border-slate-100" : "",
      ].join(" ")}
    >
      <nav
        className={[
          "flex w-full items-center justify-between px-5 sm:px-6",
          "md:transition-all md:duration-500 md:ease-out",
          scrolled ? "h-14 md:px-5" : "h-16 md:px-6",
        ].join(" ")}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => navigate("/home")}
        >
          <div className={[
            "rounded-xl overflow-hidden ring-2 ring-white/20 shadow-sm group-hover:shadow-lg group-hover:ring-emerald-200/50 transition-all duration-300",
            scrolled ? "w-8 h-8" : "w-10 h-10",
          ].join(" ")}>
            <img 
              src={logo} 
              alt="Krishiculture Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <span className={[
            "font-bold tracking-tight transition-all duration-300",
            isTransparent ? "text-white drop-shadow-sm" : "text-slate-800 group-hover:text-emerald-600",
            scrolled ? "text-base" : "text-lg",
          ].join(" ")}>
            Krishiculture
          </span>
        </div>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-2.5">
          <LanguageToggle transparent={isTransparent} />
          <HelpCenterButton transparent={isTransparent} />
          <button
            onClick={() => {
              if (user) logout()
              else navigate("/login")
            }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
              user
                ? isTransparent
                  ? "text-white/90 border border-white/30 hover:bg-white/15 hover:border-white/50"
                  : "text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800"
                : isTransparent
                  ? "bg-white text-emerald-600 hover:bg-white/90 shadow-lg shadow-black/10"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-md shadow-emerald-200/50 hover:shadow-lg hover:shadow-emerald-300/50"
            }`}
          >
            {!user ? t("nav.login") : t("nav.logout")}
          </button>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`md:hidden w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all duration-300 ${
            isTransparent
              ? "border-white/30 text-white hover:bg-white/15 hover:border-white/50"
              : "border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300"
          }`}
        >
          {mobileOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={[
          "fixed top-14 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-t border-slate-100 bg-white/98 backdrop-blur-2xl md:hidden",
          mobileOpen ? "block" : "hidden",
        ].join(" ")}
      >
        <div className="flex h-full w-full flex-col justify-between gap-y-3 p-6">
          <div className="grid gap-y-3">
            <LanguageToggle />
            <HelpCenterButton />
          </div>
          <div className="flex flex-col gap-3 pb-8">
            <button
              onClick={() => {
                if (user) logout()
                else navigate("/login")
                setMobileOpen(false)
              }}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                user
                  ? "text-slate-600 border-2 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  : "bg-gradient-to-r from-emerald-600 to-emerald-500 text-white hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-200/50"
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