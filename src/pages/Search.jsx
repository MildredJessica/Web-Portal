// Search.jsx
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { profiles as profilesApi } from '../lib/api.js'

export function Search() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  const doSearch = async () => {
    if (!query.trim()) return
    setLoading(true)
    try {
      const data = await profilesApi.search(query)
      setResults(data)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1a1a1a', marginBottom: 4 }}>Search</h1>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
        Describe what you're looking for in plain language
      </p>

      <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && doSearch()}
          placeholder='e.g. "young females from Ghana" or "adult males in the US"'
          style={{ flex: 1, padding: '10px 16px', border: '1px solid #ddd', borderRadius: 10, fontSize: 14, outline: 'none' }}
        />
        <button
          onClick={doSearch}
          disabled={loading}
          style={{ padding: '10px 20px', background: '#6c5ce7', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14 }}
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </div>

      {results && (
        <div>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>{results.total} results</p>
          {results.data.length === 0 ? (
            <div style={{ color: '#888', padding: 40, textAlign: 'center' }}>No profiles matched your query.</div>
          ) : (
            results.data.map((p) => (
              <Link key={p.id} to={`/profiles/${p.id}`} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: '#fff',
                border: '1px solid #ebebeb',
                borderRadius: 10,
                padding: '14px 20px',
                marginBottom: 8,
                textDecoration: 'none',
                transition: 'box-shadow 0.15s',
              }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.06)'}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>{p.name}</span>
                <span style={{ fontSize: 13, color: '#888' }}>
                  {p.gender} · {p.age}y · {p.country_name}
                </span>
              </Link>
            ))
          )}
        </div>
      )}
    </div>
  )
}

export default Search