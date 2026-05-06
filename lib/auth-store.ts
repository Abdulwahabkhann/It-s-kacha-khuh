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
  createdAt: string
}

export interface RegisteredUser extends User {
  password: string
}

interface AuthStore {
  currentUser: User | null
  users: RegisteredUser[]
  login: (email: string, password: string) => { success: boolean; message: string }
  signup: (data: {
    name: string
    email: string
    password: string
    role: UserRole
    phone?: string
    shopId?: string
    ceoCode?: string
  }) => { success: boolean; message: string }
  logout: () => void
  updateProfile: (data: Partial<User>) => void
}

// Pre-seeded accounts for testing
const SEED_USERS: RegisteredUser[] = [
  {
    id: 'ceo-001',
    name: 'Abdul Wahab Khan',
    email: 'ceo@kacakhuh.pk',
    password: 'ceo123',
    role: 'ceo',
    phone: '03001234567',
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'shop-001',
    name: 'Ahmed Raza',
    email: 'karachi@grill.pk',
    password: 'shop123',
    role: 'shopkeeper',
    shopId: 'karachi-grill',
    phone: '03001234567',
    createdAt: '2024-01-10T00:00:00Z',
  },
  {
    id: 'shop-002',
    name: 'Bilal Khan',
    email: 'lahori@chaska.pk',
    password: 'shop123',
    role: 'shopkeeper',
    shopId: 'lahori-chaska',
    phone: '03009876543',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'shop-003',
    name: 'Usman Ali',
    email: 'pizza@corner.pk',
    password: 'shop123',
    role: 'shopkeeper',
    shopId: 'pizza-corner',
    phone: '03003456789',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'shop-004',
    name: 'Hamza Malik',
    email: 'chai@express.pk',
    password: 'shop123',
    role: 'shopkeeper',
    shopId: 'chai-wala',
    phone: '03008765432',
    createdAt: '2024-02-10T00:00:00Z',
  },
  {
    id: 'shop-005',
    name: 'Farhan Siddiqui',
    email: 'desi@dawat.pk',
    password: 'shop123',
    role: 'shopkeeper',
    shopId: 'desi-dawat',
    phone: '03006789012',
    createdAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 'cust-001',
    name: 'Ali Hassan',
    email: 'ali@gmail.com',
    password: 'pass123',
    role: 'customer',
    phone: '03001111111',
    createdAt: '2024-03-01T00:00:00Z',
  },
]

const CEO_SECRET_CODE = 'KACAKHUH2024CEO'

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: SEED_USERS,

      login: (email, password) => {
        const users = get().users
        const found = users.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        )
        if (!found) return { success: false, message: 'Invalid email or password.' }
        const { password: _pw, ...user } = found
        set({ currentUser: user })
        return { success: true, message: `Welcome back, ${user.name}!` }
      },

      signup: (data) => {
        const users = get().users
        if (users.find((u) => u.email.toLowerCase() === data.email.toLowerCase())) {
          return { success: false, message: 'An account with this email already exists.' }
        }
        if (data.role === 'ceo' && data.ceoCode !== CEO_SECRET_CODE) {
          return { success: false, message: 'Invalid CEO authorization code.' }
        }
        const newUser: RegisteredUser = {
          id: `user-${Date.now()}`,
          name: data.name,
          email: data.email,
          password: data.password,
          role: data.role,
          shopId: data.shopId,
          phone: data.phone,
          createdAt: new Date().toISOString(),
        }
        set({ users: [...users, newUser] })
        const { password: _pw, ...user } = newUser
        set({ currentUser: user })
        return { success: true, message: `Account created! Welcome, ${data.name}!` }
      },

      logout: () => set({ currentUser: null }),

      updateProfile: (data) => {
        const current = get().currentUser
        if (!current) return
        const updated = { ...current, ...data }
        set({ currentUser: updated })
        set({
          users: get().users.map((u) =>
            u.id === current.id ? { ...u, ...data } : u
          ),
        })
      },
    }),
    {
      name: 'kacha-khuh-auth',
      partialize: (state) => ({
        currentUser: state.currentUser,
        users: state.users,
      }),
    }
  )
)
