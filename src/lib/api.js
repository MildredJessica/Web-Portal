const API_BASE = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

let isRedirectingToLogin = false

async function request(path, options = {}) {
  console.log("path, ", path)
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Version': '1',
      ...options.headers,
    },
    ...options,
  })

  // Silent token refresh on 401 — skip for /auth/refresh to avoid infinite loop
  if (res.status === 401 && !options._retry && path !== '/auth/refresh') {
    try {
      const refreshed = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })

      if (refreshed.ok) {
        // Tokens rotated — retry original request
        return request(path, { ...options, _retry: true })
      }
    } catch {
      // Network error during refresh — fall through to session expired
    }

    // Both tokens expired — throw so AuthContext can redirect cleanly
    throw new ApiError('Session expired', 401)
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(body.message || `Request failed: ${res.status}`, res.status)
  }

  return res.json()
}

// ── Auth ──────────────────────────────────────────────────────────────────────
export const auth = {
  // loginUrl is a browser redirect — needs full backend URL, not Vite proxy
  loginUrl: () => `${import.meta.env.VITE_API_URL}/auth/github`,
  me: () => request('/auth/me'),
  logout: () => request('/auth/logout', { method: 'POST' }),
}

// ── Profiles ──────────────────────────────────────────────────────────────────
export const profiles = {
  list: (params = {}) => request(`/api/profiles?${new URLSearchParams(params)}`),
  get: (id) => request(`/api/profiles/${id}`),
  search: (q, params = {}) =>
    request(`/api/profiles/search?${new URLSearchParams({ q, ...params })}`),
  create: (name) =>
    request('/api/profiles', { method: 'POST', body: JSON.stringify({ name }) }),
  remove: (id) => request(`/api/profiles/${id}`, { method: 'DELETE' }),
  // exportUrl is a browser redirect — needs full backend URL
  exportUrl: (params = {}) =>
    `${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/profiles/export?${new URLSearchParams({ format: 'csv', ...params })}`,
}