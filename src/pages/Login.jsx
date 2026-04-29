import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { auth } from '../lib/api.js'

export default function Login() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) navigate('/dashboard', { replace: true })
  }, [user, loading, navigate])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
    }}>
      <div style={{
        background: '#1e1e2e',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 16,
        padding: '48px 40px',
        width: 360,
        textAlign: 'center',
      }}>
        <div style={{ marginBottom: 8 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>Insighta</span>
          <span style={{
            fontSize: 13, fontWeight: 600, background: '#6c5ce7',
            color: '#fff', padding: '3px 8px', borderRadius: 20, marginLeft: 8
          }}>Labs+</span>
        </div>

        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, margin: '8px 0 36px' }}>
          Profile Intelligence Platform
        </p>

        <a
          href={auth.loginUrl()}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            background: '#24292e',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: 10,
            padding: '13px 20px',
            textDecoration: 'none',
            fontSize: 15,
            fontWeight: 500,
            transition: 'background 0.15s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#383e47'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#24292e'}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          Continue with GitHub
        </a>

        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, marginTop: 24 }}>
          Internal use only · Insighta Labs+
        </p>
      </div>
    </div>
  )
}