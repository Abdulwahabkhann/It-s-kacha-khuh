'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type UserRole = 'ceo' | 'shopkeeper' | 'customer'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  shopId?: string       // for shopkeepers
  phone?: string
  avatar?: string
  gender?: string
  points?: number       // Reward points for reviews/loyalty
  createdAt: string
}

export interface RegisteredUser extends User {
  password: string
}

interface AuthStore {
  currentUser: User | null
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  signup: (data: any) => Promise<{ success: boolean; message: string }>
  socialLogin: (data: { email: string; name: string; avatar: string; provider: string; providerId: string }) => Promise<{ success: boolean; message: string; user?: User }>
  logout: () => void
  updateProfile: (userId: string, updates: Partial<RegisteredUser>) => Promise<{ success: boolean; message: string }>
  addPoints: (amount: number) => void
  popupShown: boolean
  setPopupShown: (shown: boolean) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      popupShown: false,

      setPopupShown: (shown) => set({ popupShown: shown }),

      login: async (email, password) => {
        try {
          const res = await fetch('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
          })
          const data = await res.json()
          if (data.success) {
            set({ currentUser: data.user, popupShown: false })
            return { success: true, message: `Welcome back, ${data.user.name}!` }
          }
          return { success: false, message: data.message }
        } catch (err) {
          return { success: false, message: 'Login failed' }
        }
      },

      signup: async (userData) => {
        try {
          const res = await fetch('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData),
          })
          const data = await res.json()
          if (data.success) {
            set({ currentUser: data.user, popupShown: false })
            return { success: true, message: `Welcome, ${data.user.name}!` }
          }
          return { success: false, message: data.message }
        } catch (err) {
          return { success: false, message: 'Signup failed' }
        }
      },

      socialLogin: async (data) => {
        try {
          const res = await fetch('/api/auth/social', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
          })
          const result = await res.json()
          if (result.success) {
            set({ currentUser: result.user })
          }
          return result
        } catch (error) {
          return { success: false, message: 'Connection error' }
        }
      },

      logout: () => set({ currentUser: null, popupShown: false }),

      updateProfile: async (userId, updates) => {
        try {
          const res = await fetch('/api/auth/update', {
            method: 'POST',
            body: JSON.stringify({ userId, updates }),
          })
          const data = await res.json()
          if (data.success) {
            set({ currentUser: data.user })
            return { success: true, message: 'Profile updated successfully' }
          }
          return { success: false, message: data.message }
        } catch (err) {
          return { success: false, message: 'Update failed' }
        }
      },

      addPoints: (amount) => {
        const user = get().currentUser
        if (user) {
          set({ currentUser: { ...user, points: (user.points || 0) + amount } })
        }
      },
    }),
    {
      name: 'shandaar-auth-v2',
      partialize: (state) => ({
        currentUser: state.currentUser,
        popupShown: state.popupShown,
      }),
    }
  )
)
