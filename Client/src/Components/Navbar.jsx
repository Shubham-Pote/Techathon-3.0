import { useAuth } from "../context/AuthContext"
import { useLang } from "../context/LanguageContext"
import LanguageToggle from "./LanguageToggle"
import { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"

export default function Navbar({ variant }) {

  const { logout, user } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const location = useLocation()

  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    if (location.pathname === "/home") {
      const handleScroll = () => {
        setScrolled(window.scrollY > 50)
      }
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [location])

  const isHome = location.pathname === "/home"

  const navbarStyle = isHome
    ? scrolled
      ? "bg-gradient-to-r from-emerald-800 to-emerald-700 shadow-lg backdrop-blur-md"
      : "bg-transparent"
    : "bg-emerald-800 shadow-md"

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navbarStyle} text-white`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-8 py-3.5">

        {/* LEFT */}
        <div 
          className="flex items-center gap-2 cursor-pointer hover:opacity-90 transition"
          onClick={() => navigate("/home")}
        >
          <div className="w-9 h-9 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <span className="text-emerald-300 text-xl font-bold">🌾</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight">
            Krishiculture
          </h1>
        </div>

        {/* RIGHT */}
        <div className="flex gap-6 items-center text-sm font-medium">

          <LanguageToggle />

          <button
            onClick={() => navigate("/home")}
            className="hover:text-emerald-200 transition-colors"
          >
            Schemes
          </button>

          <button className="hover:text-emerald-200 transition-colors">
            Help
          </button>

          <button
            onClick={() => {
              if (user) logout()
              else navigate("/login")
            }}
            className="px-5 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white hover:text-emerald-800 transition-all font-semibold"
          >
            {!user ? "Login" : "Logout"}
          </button>

        </div>
      </div>
    </nav>
  )
}
