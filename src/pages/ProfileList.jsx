import { useEffect, useState, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { profiles as profilesApi } from '../lib/api.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function ProfileList() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const page = parseInt(searchParams.get('page') || '1')
  const gender = searchParams.get('gender') || ''
  const country_id = searchParams.get('country_id') || ''
  const age_group = searchParams.get('age_group') || ''

  const load = useCallback(() => {
    setLoading(true)
    const params = { page, limit: 20 }
    if (gender) params.gender = gender
    if (country_id) params.country_id = country_id
    if (age_group) params.age_group = age_group

    profilesApi.list(params)
      .then(setData)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [page, gender, country_id, age_group])

  useEffect(() => { load() }, [load])

  const setFilter = (key, val) => {
    const next = new URLSearchParams(searchParams)
    if (val) next.set(key, val); else next.delete(key)
    next.set('page', '1')
    setSearchParams(next)
  }

  const handleCreate = async () => {
    if (!newName.trim()) return
    setCreating(true)
    try {
      await profilesApi.create(newName.trim())
      setNewName('')
      load()
    } catch (e) {
      alert(e.message)
    } finally {
      setCreating(false)
    }
  }

  const handleExport = () => {
    const params = {}
    if (gender) params.gender = gender
    if (country_id) params.country_id = country_id
    if (age_group) params.age_group = age_group
    window.location.href = profilesApi.exportUrl(params)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Profiles</h1>
          {data && <p style={{ fontSize: 13, color: '#888' }}>{data.total.toLocaleString()} total</p>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={handleExport} style={btnStyle('#fff', '#1a1a1a', '#ddd')}>Export CSV</button>
          {user?.role === 'admin' && (
            <button onClick={() => setCreating(true)} style={btnStyle('#6c5ce7', '#fff', '#6c5ce7')}>
              + New profile
            </button>
          )}
        </div>
      </div>

      {/* Create form (admin) */}
      {creating && user?.role === 'admin' && (
        <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 10, padding: 16, marginBottom: 20, display: 'flex', gap: 10 }}>
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Full name (e.g. Harriet Tubman)"
            style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 14 }}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
          />
          <button onClick={handleCreate} style={btnStyle('#6c5ce7', '#fff', '#6c5ce7')}>Create</button>
          <button onClick={() => setCreating(false)} style={btnStyle('#fff', '#888', '#ddd')}>Cancel</button>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <select value={gender} onChange={(e) => setFilter('gender', e.target.value)} style={selectStyle}>
          <option value="">All genders</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
        <select value={age_group} onChange={(e) => setFilter('age_group', e.target.value)} style={selectStyle}>
          <option value="">All age groups</option>
          <option value="child">Child</option>
          <option value="teenager">Teenager</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>
        <input
          value={country_id}
          onChange={(e) => setFilter('country_id', e.target.value.toUpperCase())}
          placeholder="Country code (NG, US…)"
          maxLength={2}
          style={{ ...selectStyle, width: 160 }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div style={{ color: '#888', padding: 40, textAlign: 'center' }}>Loading…</div>
      ) : (
        <>
          <div style={{ background: '#fff', border: '1px solid #ebebeb', borderRadius: 12, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
              <thead>
                <tr style={{ background: '#f9f9f8', borderBottom: '1px solid #ebebeb' }}>
                  {['Name','Gender','Age','Group','Country','Created'].map((h) => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#666', fontSize: 12 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data?.data?.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <Link to={`/profiles/${p.id}`} style={{ color: '#6c5ce7', fontWeight: 500, textDecoration: 'none' }}>
                        {p.name}
                      </Link>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{p.gender}</td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{p.age}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={ageBadge(p.age_group)}>{p.age_group}</span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#555' }}>{p.country_name}</td>
                    <td style={{ padding: '12px 16px', color: '#999', fontSize: 12 }}>
                      {new Date(p.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data && data.total_pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
              <button
                disabled={page === 1}
                onClick={() => setFilter('page', String(page - 1))}
                style={pagBtn(page === 1)}
              >← Prev</button>
              <span style={{ padding: '6px 12px', fontSize: 13, color: '#888' }}>
                {page} / {data.total_pages}
              </span>
              <button
                disabled={page >= data.total_pages}
                onClick={() => setFilter('page', String(page + 1))}
                style={pagBtn(page >= data.total_pages)}
              >Next →</button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

const selectStyle = { padding: '8px 12px', border: '1px solid #ddd', borderRadius: 8, fontSize: 13, background: '#fff' }
const btnStyle = (bg, color, border) => ({ padding: '8px 16px', background: bg, color, border: `1px solid ${border}`, borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 500 })
const pagBtn = (disabled) => ({ padding: '6px 14px', background: disabled ? '#f5f5f5' : '#fff', color: disabled ? '#ccc' : '#1a1a1a', border: '1px solid #ddd', borderRadius: 8, cursor: disabled ? 'default' : 'pointer', fontSize: 13 })
const ageBadge = (group) => {
  const colors = { child: '#00b894', teenager: '#0984e3', adult: '#6c5ce7', senior: '#e17055' }
  const c = colors[group] || '#888'
  return { background: c + '18', color: c, padding: '2px 8px', borderRadius: 20, fontSize: 11, fontWeight: 600 }
}