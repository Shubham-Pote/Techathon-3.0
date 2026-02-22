import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import LandingPage from "./pages/LandingPage"

import { AuthProvider } from "./context/AuthContext"
import { LanguageProvider } from "./context/LanguageContext"
import SchemeDetails from "./pages/SchemeDetails"
import SpeakOnSelect from "./Components/SpeakOnSelect"
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
<<<<<<< Updated upstream

        <BrowserRouter>
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

        </BrowserRouter>

=======
        
        <Home />
>>>>>>> Stashed changes
      </AuthProvider>
    </LanguageProvider>
  )
}