import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
// import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { useAuth } from './hooks/useAuth.js'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import ProfileList from './pages/ProfileList.jsx'
import ProfileDetail from './pages/ProfileDetail.jsx'
import Search from './pages/Search.jsx'
import Account from './pages/Account.jsx'
import Layout from './components/layout/Layout.jsx'
import AuthCallback from './pages/AuthCallback.jsx'


function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="loading">Loading…</div>
  if (!user) return <Navigate to="/login" replace />
  return children
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profiles" element={<ProfileList />} />
            <Route path="profiles/:id" element={<ProfileDetail />} />
            <Route path="search" element={<Search />} />
            <Route path="account" element={<Account />} />
          </Route>
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}