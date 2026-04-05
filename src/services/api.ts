const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

function getToken(): string | null {
  try {
    const raw = sessionStorage.getItem('madrigal_user')
    if (!raw) return null
    const data = JSON.parse(raw)
    return data.token || null
  } catch {
    return null
  }
}

async function request<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 204) return null as T
  if (res.status === 401) {
    sessionStorage.removeItem('madrigal_user')
    localStorage.removeItem('madrigal_refresh')
    window.location.href = '/login'
    throw new Error('Unauthorized')
  }
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.detail || `HTTP ${res.status}`)
  }
  return res.json()
}

export const api = {
  get: <T = any>(path: string) => request<T>(path),
  post: <T = any>(path: string, body?: any) => request<T>(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T = any>(path: string, body?: any) => request<T>(path, { method: 'PUT', body: JSON.stringify(body) }),
  patch: <T = any>(path: string, body?: any) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path: string) => request(path, { method: 'DELETE' }),
}

// --- Auth ---
export async function login(username: string, password: string) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  })
  sessionStorage.setItem('madrigal_user', JSON.stringify(data))
  return data
}

export async function logout() {
  await request('/auth/logout', { method: 'POST' }).catch(() => {})
  sessionStorage.removeItem('madrigal_user')
  localStorage.removeItem('madrigal_refresh')
}

// --- Dashboard ---
export const dashboard = {
  summary: () => api.get('/dashboard/summary'),
  mentionsDaily: (days = 7) => api.get(`/dashboard/mentions/daily?days=${days}`),
  categories: () => api.get('/dashboard/categories'),
}

// --- Topics ---
function mapTopic(t: any) {
  return {
    ...t,
    mentionsCount: t.mentions_count ?? 0,
    mentionsDelta: t.mentions_delta ?? 0,
    sourcesCount: t.sources_count ?? 0,
    trendData: t.trend_data ?? [],
    commentSentiments: t.comment_sentiments ?? {},
    createdAt: t.created_at,
    updatedAt: t.updated_at,
    whyInTop: t.why_in_top,
  }
}

export const topics = {
  list: async (params?: Record<string, any>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : ''
    const data = await api.get(`/topics${qs}`)
    return Array.isArray(data) ? data.map(mapTopic) : []
  },
  top: async (limit = 10) => {
    const data = await api.get(`/topics/top?limit=${limit}`)
    return Array.isArray(data) ? data.map(mapTopic) : []
  },
  detail: async (id: string) => {
    const data = await api.get(`/topics/${id}`)
    return data ? mapTopic(data) : null
  },
}

// --- Analytics ---
export const analytics = {
  unified: (period = '7d') => api.get(`/analytics?period=${period}`),
  categories: () => api.get('/analytics/categories'),
  geo: () => api.get('/analytics/geo'),
  trends: (days = 7) => api.get(`/analytics/trends?days=${days}`),
}

// --- Sources ---
export const sources = {
  list: (type?: string) => api.get(`/sources${type ? `?type=${type}` : ''}`),
  add: (urls: string[]) => api.post('/sources', { sources: urls.map(url => ({ url })) }),
  remove: (id: string) => api.delete(`/sources/${id}`),
  toggle: (id: string, active: boolean) => api.patch(`/sources/${id}`, { active }),
  exportAll: () => fetch(`${BASE_URL}/sources/export`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  }).then(r => r.text()),
}

// --- Reports ---
function mapReport(r: any) {
  return {
    ...r,
    mentionsTotal: r.mentions_total ?? 0,
    topicsCount: r.topics_count ?? 0,
    sourcesCount: r.sources_count ?? 0,
    typeLabel: r.typeLabel ?? r.type,
  }
}

export const reports = {
  list: async () => {
    const data = await api.get('/reports')
    return { data: (data.data || []).map(mapReport) }
  },
  detail: async (id: string) => {
    const data = await api.get(`/reports/${id}`)
    return data ? mapReport(data) : null
  },
  generate: (body: any) => api.post('/reports/generate', body),
  download: (id: string) => `${BASE_URL}/reports/${id}/download`,
}

// --- Chat ---
export const chat = {
  send: (message: string, sessionId?: string) =>
    api.post('/chat/message', { message, session_id: sessionId }),
}
