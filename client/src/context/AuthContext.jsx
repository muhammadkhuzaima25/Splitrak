import { createContext, useContext, useState, useEffect } from 'react'
import api from '../api/axios'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('splitrak_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      const stored = localStorage.getItem('splitrak_user')
      if (stored) {
        setUser(JSON.parse(stored))
      }
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password })
    const { _id, name, email: userEmail, token: jwtToken } = res.data
    const userData = { _id, name, email: userEmail }

    localStorage.setItem('splitrak_token', jwtToken)
    localStorage.setItem('splitrak_user', JSON.stringify(userData))
    setToken(jwtToken)
    setUser(userData)
    return res.data
  }

  const register = async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password })
    const { _id, token: jwtToken } = res.data
    const userData = { _id, name, email }

    localStorage.setItem('splitrak_token', jwtToken)
    localStorage.setItem('splitrak_user', JSON.stringify(userData))
    setToken(jwtToken)
    setUser(userData)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('splitrak_token')
    localStorage.removeItem('splitrak_user')
    setToken(null)
    setUser(null)
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
