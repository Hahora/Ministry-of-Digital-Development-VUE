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

export const auth = {
  login(login: string, password: string): AuthUser | null {
    const found = MOCK_USERS.find(u => u.login === login && u.password === password)
    if (!found) return null
    const { login: _l, password: _p, ...user } = found
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user))
    return user
  },

  logout() {
    sessionStorage.removeItem(SESSION_KEY)
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
