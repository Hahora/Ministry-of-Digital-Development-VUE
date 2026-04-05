import { login as apiLogin, logout as apiLogout } from '../services/api'

export interface AuthUser {
  id: string
  username: string
  role: string
  initials: string
}

const SESSION_KEY = 'madrigal_user'
const REFRESH_KEY = 'madrigal_refresh'

export const auth = {
  async login(login: string, password: string): Promise<(AuthUser & { token: string; expires_in: number }) | null> {
    try {
      const data = await apiLogin(login, password)
      return {
        id: data.user.id,
        username: data.user.username,
        role: data.user.role,
        initials: data.user.initials,
        token: data.token,
        expires_in: data.expires_in,
      }
    } catch {
      return null
    }
  },

  async logout() {
    await apiLogout()
  },

  currentUser(): AuthUser | null {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    try {
      const data = JSON.parse(raw)
      return { id: data.user?.id || data.id, username: data.user?.username || data.username, role: data.user?.role || data.role, initials: data.user?.initials || data.initials }
    } catch { return null }
  },

  isLoggedIn(): boolean {
    return !!this.currentUser()
  },
}
