import { lazy, Suspense, useLayoutEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useTranslation } from "react-i18next"
import Home from "./pages/Home"
import LandingPage from "./pages/LandingPage"

import { AuthProvider } from "./context/AuthContext"
import { BookmarkProvider } from "./context/BookmarkContext"
import SpeakOnSelect from "./Components/SpeakOnSelect"
import Chatbot from "./Components/chatbot"
import Navbar from "./Components/Navbar"
import SiteFooter from "./Components/SiteFooter"

const LoginPage = lazy(() => import("./pages/LoginPage"))
const SchemeDetails = lazy(() => import("./pages/SchemeDetails"))

function ScrollOnNavigation() {
  const { pathname, search, hash } = useLocation()

  useLayoutEffect(() => {
    if (!hash) window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname, search, hash])

  return null
}

export default function App() {
  const { t } = useTranslation()
  return (
    <AuthProvider>
      <BookmarkProvider>
        <BrowserRouter>
          <ScrollOnNavigation />
          <Navbar />
          <Suspense fallback={<main id="main-content" tabIndex={-1} className="kc-shell kc-route-status"><p role="status">{t("schemeDetail.loading")}</p></main>}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/schemes/:id" element={<SchemeDetails />} />
            </Routes>
          </Suspense>
          <SiteFooter />
          <SpeakOnSelect />
          <Chatbot />
        </BrowserRouter>
      </BookmarkProvider>
    </AuthProvider>
  )
}
