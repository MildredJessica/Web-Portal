// import { createContext, useContext, useEffect, useState } from 'react'
// import { auth, ApiError } from '../lib/api.js'

// export const AuthContext = createContext(null)

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)

//   const fetchUser = async () => {
//     try {
//       const data = await auth.me()
//       setUser(res.data.data)
//     } catch (err) {
//       setUser(null)
//       // Only redirect if session is explicitly expired (401)
//       // Not on every error (e.g. network hiccup)
//       if (err instanceof ApiError && err.status === 401) {
//         // Only redirect if not already on login page
//         if (!window.location.pathname.startsWith('/login')) {
//           window.location.href = '/login'
//         }
//       }
//     } finally {
//       setLoading(false)
//     }
//   }
//   // useEffect(() => {
//   //   api.get('/auth/me')
//   //     .then(res => setUser(res.data.data))
//   //     .catch(() => setUser(null))
//   //     .finally(() => setLoading(false))
//   // }, [])

//   useEffect(() => {
//     fetchUser()
//   }, [])

//   const logout = async () => {
//     await auth.logout().catch(() => null)
//     setUser(null)
//     window.location.href = '/login'
//   }

//   return (
//     <AuthContext.Provider value={{ user, loading, logout, setUser, refetchUser: fetchUser }}>
//      {/* <AuthContext.Provider value={{ user, loading, logout}}> */}
//       {children}
//     </AuthContext.Provider>
//   )
// }
// // export const useAuth = () => useContext(AuthContext)

// src/context/AuthContext.jsx
import { createContext, useState, useEffect } from 'react'
import { auth } from '../lib/api.js'

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