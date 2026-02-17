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
    if (location.pathname === "/") {
      const handleScroll = () => {
        setScrolled(window.scrollY > 50)
      }
      window.addEventListener("scroll", handleScroll)
      return () => window.removeEventListener("scroll", handleScroll)
    }
  }, [location])

  const isHome = location.pathname === "/"

  const navbarStyle = isHome
    ? scrolled
      ? "bg-gradient-to-r from-emerald-800 to-emerald-700 shadow-lg backdrop-blur-md"
      : "bg-transparent"
    : "bg-emerald-800 shadow-md"

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${navbarStyle} text-white`}
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-12 py-4">

        {/* LEFT */}
        <h1
          className="text-xl font-semibold tracking-wide cursor-pointer hover:opacity-90 transition -ml-30"
          onClick={() => navigate("/")}
        >
          IN Farmer Support Portal
        </h1>

        {/* RIGHT */}
        <div className="flex gap-8 items-center text-sm font-medium">

          <LanguageToggle />

          <button
            onClick={() => navigate("/")}
            className="hover:text-emerald-300 transition"
          >
            Schemes
          </button>

          <button className="hover:text-emerald-300 transition">
            Help
          </button>

          <button
            onClick={() => {
              if (user) logout()
              else navigate("/login")
            }}
            className="px-4 py-1.5 rounded-lg border border-white/30 hover:bg-white hover:text-emerald-800 transition -mr-20"
          >
            {!user ? "Login" : "Logout"}
          </button>

        </div>
      </div>
    </nav>
  )
}
