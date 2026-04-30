import { createContext, useState, useEffect } from 'react'
import { auth } from '../api'

export const AuthContext = createContext(null)

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    
    if (token) {
      const payload = parseJwt(token)
      // Check if token is still valid
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser({ id: payload.sub, role: payload.role })
        setLoading(false)
        return
      }
    }

    // No token or expired — try /auth/me (will trigger refresh if needed)
    auth.me()
      .then(res => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  )
}