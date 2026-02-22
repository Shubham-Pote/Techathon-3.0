import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import LandingPage from "./pages/LandingPage"

import { AuthProvider } from "./context/AuthContext"
import { BookmarkProvider } from "./context/BookmarkContext"
import { LanguageProvider } from "./context/LanguageContext"
import SchemeDetails from "./pages/SchemeDetails"
import SpeakOnSelect from "./Components/SpeakOnSelect"
import Chatbot from "./Components/chatbot"
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BookmarkProvider>
        <BrowserRouter>
          <SpeakOnSelect />
          <Chatbot />

          <Routes>
            {/* Landing Page */}
            <Route path="/" element={<LandingPage />} />

            {/* Home (Dashboard) */}
            <Route path="/home" element={<Home />} />

            {/* Login Page */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/schemes/:id" element={<SchemeDetails />} />
          </Routes>
        </BrowserRouter>
        </BookmarkProvider>
      </AuthProvider>
    </LanguageProvider>
  )
}