// ── Моковая аутентификация ────────────────────────────────────────────────────
// Чтобы заменить на реальный API: удали этот файл и замени вызовы
// auth.login / auth.logout / auth.currentUser на реальные запросы.

export interface AuthUser {
  id: string
  name: string
  role: string
  initials: string
  avatar?: string
}

// Моковые пользователи — заменить на API
const MOCK_USERS: Array<AuthUser & { login: string; password: string }> = [
  { id: '1', login: 'admin', password: 'admin123', name: 'Администратор', role: 'Руководитель', initials: 'АД' },
  { id: '2', login: 'analyst', password: 'analyst123', name: 'Иванов А.П.', role: 'Аналитик', initials: 'ИА' },
  { id: '3', login: 'governor', password: 'gov2026', name: 'Губернатор', role: 'Губернатор', initials: 'ГУ' },
]

const SESSION_KEY = 'madrigal_user'
const REFRESH_KEY = 'madrigal_refresh'

function generateToken(prefix: string) {
  return `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`
}

export const auth = {
  login(login: string, password: string): (AuthUser & { token: string; refresh_token: string; expires_in: number }) | null {
    const found = MOCK_USERS.find(u => u.login === login && u.password === password)
    if (!found) return null
    const { login: _l, password: _p, ...user } = found
    const token = generateToken('tok')
    const refreshToken = generateToken('ref')
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...user, token, expiresAt: Date.now() + 3600_000 }))
    localStorage.setItem(REFRESH_KEY, refreshToken)
    return { ...user, token, refresh_token: refreshToken, expires_in: 3600 }
  },

  refreshToken(): (AuthUser & { token: string; expires_in: number }) | null {
    const stored = localStorage.getItem(REFRESH_KEY)
    if (!stored) return null
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      const user = JSON.parse(raw) as AuthUser & { token: string; expiresAt: number }
      const newToken = generateToken('tok')
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({ ...user, token: newToken, expiresAt: Date.now() + 3600_000 }))
      return { ...user, token: newToken, expires_in: 3600 }
    } catch { return null }
  },

  logout() {
    sessionStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },

  currentUser(): AuthUser | null {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try { return JSON.parse(raw) } catch { return null }
  },

  isLoggedIn(): boolean {
    return !!this.currentUser()
  },
}
