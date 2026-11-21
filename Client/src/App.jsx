import { useLayoutEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import LandingPage from "./pages/LandingPage"

import { AuthProvider } from "./context/AuthContext"
import { BookmarkProvider } from "./context/BookmarkContext"
import { LanguageProvider } from "./context/LanguageContext"
import SchemeDetails from "./pages/SchemeDetails"
import SpeakOnSelect from "./Components/SpeakOnSelect"
import Chatbot from "./Components/chatbot"

function ScrollOnNavigation() {
  const { pathname, search, hash } = useLocation()

  useLayoutEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname, search, hash])

  return null
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookmarkProvider>
        <BrowserRouter>
          <ScrollOnNavigation />
          <SpeakOnSelect />

          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Home (Dashboard) */}
            <Route path="/home" element={<Home />} />

            {/* Login Page */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/schemes/:id" element={<SchemeDetails />} />
          </Routes>
          <Chatbot />
        </BrowserRouter>
        </BookmarkProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}
