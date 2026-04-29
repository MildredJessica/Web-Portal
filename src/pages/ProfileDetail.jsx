// ── ProfileDetail ────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { profiles as profilesApi } from '../lib/api.js'

export default function ProfileDetail() {
  const { id } = useParams()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    profilesApi.get(id)
      .then((d) => setProfile(d.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ color: '#888', padding: 40 }}>Loading…</div>
  if (!profile) return <div style={{ color: '#e17055', padding: 40 }}>Profile not found.</div>

  const Field = ({ label, value }) => (
    <div style={{ display: 'flex', padding: '14px 0', borderBottom: '1px solid #f0f0f0' }}>
      <span style={{ width: 200, fontSize: 13, color: '#888', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 14, color: '#1a1a1a', fontWeight: 500 }}>{value}</span>
    </div>
  )

  return (
    <div>
      <Link to="/profiles" style={{ fontSize: 13, color: '#6c5ce7', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 20 }}>
        ← Back to profiles
      </Link>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>{profile.name}</h1>
      <p style={{ fontSize: 13, color: '#aaa', marginBottom: 28 }}>ID: {profile.id}</p>

      <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, padding: '8px 24px' }}>
        <Field label="Gender" value={`${profile.gender} · ${(profile.gender_probability * 100).toFixed(1)}% confidence`} />
        <Field label="Age" value={`${profile.age} years old`} />
        <Field label="Age group" value={profile.age_group} />
        <Field label="Country" value={`${profile.country_name} (${profile.country_id}) · ${(profile.country_probability * 100).toFixed(1)}% confidence`} />
        <Field label="Created" value={new Date(profile.created_at).toLocaleString()} />
      </div>
    </div>
  )
}