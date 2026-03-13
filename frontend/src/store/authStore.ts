import { create } from 'zustand'

interface User {
  _id: string
  name: string
  email: string
  phone?: string
  role: 'admin' | 'customer'
  addresses?: any[]
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isAdmin: boolean
  setAuth: (user: User, token: string) => void
  logout: () => void
  updateUser: (user: User) => void
}

// Load from localStorage
const savedUser = localStorage.getItem('swami_user')
const savedToken = localStorage.getItem('swami_token')

export const useAuthStore = create<AuthState>((set) => ({
  user: savedUser ? JSON.parse(savedUser) : null,
  token: savedToken || null,
  isAuthenticated: !!savedToken,
  isAdmin: savedUser ? JSON.parse(savedUser)?.role === 'admin' : false,

  setAuth: (user, token) => {
    localStorage.setItem('swami_token', token)
    localStorage.setItem('swami_user', JSON.stringify(user))
    set({
      user,
      token,
      isAuthenticated: true,
      isAdmin: user.role === 'admin',
    })
  },

  logout: () => {
    localStorage.removeItem('swami_token')
    localStorage.removeItem('swami_user')
    set({ user: null, token: null, isAuthenticated: false, isAdmin: false })
  },

  updateUser: (user) => {
    localStorage.setItem('swami_user', JSON.stringify(user))
    set({ user, isAdmin: user.role === 'admin' })
  },
}))
