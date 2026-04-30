// import { useAuth } from '../context/AuthContext.jsx'
import { useAuth } from '../hooks/useAuth.js'

export default function Account() {
  const { user, logout } = useAuth()

  const Field = ({ label, value }) => (
    <div style={{ display: 'flex', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
      <span style={{ width: 180, fontSize: 13, color: '#888', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 500 }}>{value ?? '—'}</span>
    </div>
  )

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 28 }}>Account</h1>

      {user && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '8px 24px', marginBottom: 24 }}>
          <Field label="Username" value={`@${user.username}`} />
          <Field label="Email" value={user.email} />
          <Field label="Role" value={user.role} />
          <Field label="User ID" value={user.id} />
        </div>
      )}

      <button
        onClick={logout}
        style={{
          padding: '10px 20px',
          background: '#fff',
          color: '#e17055',
          border: '1px solid #e17055',
          borderRadius: 8,
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: 14,
        }}
      >
        Sign out
      </button>
    </div>
  )
}