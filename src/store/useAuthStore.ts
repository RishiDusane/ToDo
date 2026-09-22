import { create } from 'zustand'
import { authApi, TOKEN_KEY } from '../api/client'
import type { AuthUser } from '../api/client'

interface AuthStore {
  user: AuthUser | null
  loading: boolean
  error: string | null
  restoreSession: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
}

function saveSession(token: string, user: AuthUser) {
  localStorage.setItem(TOKEN_KEY, token)
  return { user, loading: false, error: null }
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  error: null,
  restoreSession: async () => {
    if (!localStorage.getItem(TOKEN_KEY)) return set({ loading: false })
    try { const result = await authApi.me(); set({ user: result.user, loading: false, error: null }) } catch { localStorage.removeItem(TOKEN_KEY); set({ user: null, loading: false }) }
  },
  login: async (email, password) => {
    try { set({ loading: true, error: null }); const result = await authApi.login({ email, password }); set(saveSession(result.token, result.user)) } catch (error) { set({ loading: false, error: error instanceof Error ? error.message : 'Unable to log in' }); throw error }
  },
  register: async (name, email, password) => {
    try { set({ loading: true, error: null }); const result = await authApi.register({ name, email, password }); set(saveSession(result.token, result.user)) } catch (error) { set({ loading: false, error: error instanceof Error ? error.message : 'Unable to register' }); throw error }
  },
  logout: () => { localStorage.removeItem(TOKEN_KEY); set({ user: null, loading: false, error: null }) },
}))
