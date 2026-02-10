import { useAuth } from "../context/AuthContext"
import { useLang } from "../context/LanguageContext"
import LanguageToggle from "./LanguageToggle"

export default function Navbar() {
  const { login, logout, user } = useAuth()
  const { t } = useLang()

  return (
    <>
        <nav className="bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <h1 className="text-lg font-bold">🇮🇳 Farmer Support Portal</h1>
       
      <div className="flex gap-4 items-center">
        <LanguageToggle />
        <button className="hover:underline">Schemes</button>
        <button className="hover:underline">Help</button>
        <div className="bg-white text-blue-900 px-4 py-1 rounded-lg">
           {!user ? (
          <button onClick={login}>{t.login}</button>
        ) : (
          <button onClick={logout}>Logout</button>
        )}
        </div>
      </div>
    </nav>
    </>
   
  )
}
