import { createContext, useContext, useState, useEffect } from "react"
import axios from "axios"

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setAdmin({ token })
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const base = import.meta.env.VITE_API_URL
      ? `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/api/auth`
      : "http://localhost:5000/api/auth"
    const res = await axios.post(`${base}/login`, { email, password })
    const { token } = res.data
    localStorage.setItem("adminToken", token)
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
    setAdmin({ token })
    return res.data
  }

  const logout = () => {
    localStorage.removeItem("adminToken")
    delete axios.defaults.headers.common["Authorization"]
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
