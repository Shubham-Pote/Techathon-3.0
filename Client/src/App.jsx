import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"

import { AuthProvider } from "./context/AuthContext"
import { LanguageProvider } from "./context/LanguageContext"
import SchemeDetails from "./pages/SchemeDetails"
export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>

        <BrowserRouter>

          <Routes>

            {/* Home */}
            <Route path="/" element={<Home />} />

            {/* Login Page */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/schemes/:id" element={<SchemeDetails />} />

          </Routes>

        </BrowserRouter>

      </AuthProvider>
    </LanguageProvider>
  )
}