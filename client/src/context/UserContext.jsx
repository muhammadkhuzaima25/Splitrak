import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { useAuth } from './AuthContext'
import api from '../api/axios'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const { user: authUser, token } = useAuth()
  const [user, setUser] = useState(authUser)

  useEffect(() => {
    setUser(authUser)
  }, [authUser])

  const updateUser = useCallback(async (updates) => {
    try {
      const { data } = await api.put('/auth/profile', updates)
      setUser(data.user || data)
      const stored = JSON.parse(localStorage.getItem('splitrak_user') || '{}')
      localStorage.setItem('splitrak_user', JSON.stringify({ ...stored, ...updates }))
      return data
    } catch (err) {
      throw err
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser, updateUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) throw new Error('useUser must be used within UserProvider')
  return context
}
