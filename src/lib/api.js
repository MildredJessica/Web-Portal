const API_BASE = import.meta.env.VITE_API_URL

export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, options = {}) {
  const token = localStorage.getItem('access_token')

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Version': '1',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  })

  if (res.status === 401 && !options._retry && path !== '/auth/refresh') {
    try {
      const refreshToken = localStorage.getItem('refresh_token')
      const refreshed = await fetch(`${API_BASE}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken }),
      })

      if (refreshed.ok) {
        const data = await refreshed.json()
        localStorage.setItem('access_token', data.access_token)
        localStorage.setItem('refresh_token', data.refresh_token)
        return request(path, { ...options, _retry: true })
      }
    } catch {
      // fall through
    }

    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    throw new ApiError('Session expired', 401)
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new ApiError(body.message || `Request failed: ${res.status}`, res.status)
  }

  return res.json()
}

// update logout to clear localStorage
export const auth = {
  loginUrl: () => `${import.meta.env.VITE_API_URL}/auth/github`,
  me: () => request('/auth/me'),
  logout: async () => {
    await request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: localStorage.getItem('refresh_token') }),
    })
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  },
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