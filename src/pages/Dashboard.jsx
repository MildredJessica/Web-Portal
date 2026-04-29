import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { profiles as profilesApi } from '../lib/api.js'

function StatCard({ label, value, color }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #ebebeb',
      borderRadius: 12,
      padding: '24px 28px',
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a' }}>{value ?? '…'}</div>
      <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>{label}</div>
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      profilesApi.list({ limit: 1 }),
      profilesApi.list({ limit: 1, gender: 'male' }),
      profilesApi.list({ limit: 1, gender: 'female' }),
      profilesApi.list({ limit: 1, country_id: 'NG' }),
    ]).then(([all, male, female, ng]) => {
      setStats({
        total: all.total,
        male: male.total,
        female: female.total,
        nigeria: ng.total,
      })
    }).catch(console.error).finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>
        Dashboard
      </h1>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>
        Profile Intelligence · Insighta Labs+
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 40 }}>
        <StatCard label="Total profiles" value={loading ? '…' : stats?.total?.toLocaleString()} color="#6c5ce7" />
        <StatCard label="Male profiles" value={loading ? '…' : stats?.male?.toLocaleString()} color="#0984e3" />
        <StatCard label="Female profiles" value={loading ? '…' : stats?.female?.toLocaleString()} color="#e84393" />
        <StatCard label="From Nigeria" value={loading ? '…' : stats?.nigeria?.toLocaleString()} color="#00b894" />
      </div>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <QuickAction to="/profiles" label="Browse profiles" desc="Filter, sort and paginate all profiles" />
        <QuickAction to="/search" label="Search" desc="Natural language profile search" />
      </div>
    </div>
  )
}

function QuickAction({ to, label, desc }) {
  return (
    <Link to={to} style={{
      background: '#fff',
      border: '1px solid #ebebeb',
      borderRadius: 12,
      padding: '20px 24px',
      textDecoration: 'none',
      minWidth: 200,
      transition: 'box-shadow 0.15s',
    }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.08)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
    >
      <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 13, color: '#888' }}>{desc}</div>
    </Link>
  )
}