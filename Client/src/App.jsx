import Home from "./pages/Home"
import { AuthProvider } from "./context/AuthContext"
import { LanguageProvider } from "./context/LanguageContext"

export default function App() {
  return (<>
    <LanguageProvider>
      <AuthProvider>
        <p>hiiii</p>
        <Home />
      </AuthProvider>
    </LanguageProvider>
    </>
  )
}
