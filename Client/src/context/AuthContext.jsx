import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  // ✅ keep login persistent after refresh
  useEffect(() => {
    const saved = localStorage.getItem("farmer_user")
    if (saved) setUser(JSON.parse(saved))
  }, [])

  // ✅ store FULL user + profile
  const login = (userData) => {
    setUser(userData)
    localStorage.setItem("farmer_user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("farmer_user")
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
