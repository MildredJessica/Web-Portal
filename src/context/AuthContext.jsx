import { createContext, useContext, useEffect, useState } from 'react'
import { auth, ApiError } from '../lib/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const fetchUser = async () => {
    try {
      const data = await auth.me()
      setUser(data?.data ?? null)
    } catch (err) {
      setUser(null)
      // Only redirect if session is explicitly expired (401)
      // Not on every error (e.g. network hiccup)
      if (err instanceof ApiError && err.status === 401) {
        // Only redirect if not already on login page
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login'
        }
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUser()
  }, [])

  const logout = async () => {
    await auth.logout().catch(() => null)
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <AuthContext.Provider value={{ user, loading, logout, setUser, refetchUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)


