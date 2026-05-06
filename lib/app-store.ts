'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Shop } from '@/lib/types'

export interface OrderRecord {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  shopId: string
  shopName: string
  items: Array<{ name: string; qty: number; price: number }>
  total: number
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  createdAt: string
}

export interface SavedShop {
  shopId: string
  savedAt: string
}

export interface ShopProduct {
  id: string
  shopId: string
  name: string
  description?: string
  price: number
  category: string
  imageUrl?: string
  mediaUrl?: string
  mediaType?: string
  quantity?: number       // optional stock count
  isAvailable: boolean
  createdAt: string
}

export interface ShopOverride {
  shopId: string
  riderName?: string
  riderPhone?: string
  deliveryTime?: string
  bannerUrl?: string
  whatsapp?: string
}

interface AppStore {
  orders: OrderRecord[]
  savedShops: SavedShop[]
  shopRankings: Record<string, number>
  shopProducts: ShopProduct[]
  shopOverrides: ShopOverride[]
  customShops: Shop[]

  addOrder: (order: Omit<OrderRecord, 'id' | 'createdAt' | 'status'>) => void
  updateOrderStatus: (orderId: string, status: OrderRecord['status']) => void
  toggleSaveShop: (shopId: string) => void
  isShopSaved: (shopId: string) => boolean
  getOrdersByShop: (shopId: string) => OrderRecord[]
  getOrdersByCustomer: (customerId: string) => OrderRecord[]
  addCustomShop: (shop: Shop) => void
  setShopRank: (shopId: string, rank: number) => void
  getShopStats: (shopId: string) => {
    daily: number; weekly: number; monthly: number; yearly: number; total: number; revenue: number
  }
  addShopProduct: (product: Omit<ShopProduct, 'id' | 'createdAt'>) => void
  updateShopProduct: (id: string, updates: Partial<ShopProduct>) => void
  deleteShopProduct: (id: string) => void
  getShopProducts: (shopId: string) => ShopProduct[]
  toggleProductAvailability: (id: string) => void
  updateShopOverride: (shopId: string, data: Partial<ShopOverride>) => void
  getShopOverride: (shopId: string) => ShopOverride | undefined
}

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      orders: [
        {
          id: 'ord-001', customerId: 'cust-001', customerName: 'Ali Hassan', customerPhone: '03001111111',
          shopId: 'karachi-grill', shopName: 'Karachi Grill House',
          items: [{ name: 'Smash Burger', qty: 2, price: 480 }, { name: 'Fries', qty: 1, price: 150 }],
          total: 1110, status: 'delivered', createdAt: new Date(Date.now() - 1 * 86400000).toISOString(),
        },
        {
          id: 'ord-002', customerId: 'cust-001', customerName: 'Ali Hassan', customerPhone: '03001111111',
          shopId: 'lahori-chaska', shopName: 'Lahori Chaska',
          items: [{ name: 'Chicken Biryani', qty: 2, price: 350 }],
          total: 700, status: 'delivered', createdAt: new Date(Date.now() - 3 * 86400000).toISOString(),
        },
        {
          id: 'ord-003', customerId: 'cust-002', customerName: 'Sara Malik', customerPhone: '03002222222',
          shopId: 'karachi-grill', shopName: 'Karachi Grill House',
          items: [{ name: 'BBQ Platter', qty: 1, price: 1200 }],
          total: 1200, status: 'delivered', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(),
        },
        {
          id: 'ord-004', customerId: 'cust-003', customerName: 'Omar Khan', customerPhone: '03003333333',
          shopId: 'chai-wala', shopName: 'Chai Wala Express',
          items: [{ name: 'Doodh Patti x4', qty: 4, price: 60 }, { name: 'Paratha', qty: 2, price: 80 }],
          total: 400, status: 'confirmed', createdAt: new Date(Date.now() - 4 * 3600000).toISOString(),
        },
        {
          id: 'ord-005', customerId: 'cust-001', customerName: 'Ali Hassan', customerPhone: '03001111111',
          shopId: 'karachi-grill', shopName: 'Karachi Grill House',
          items: [{ name: 'Zinger Burger', qty: 1, price: 350 }],
          total: 350, status: 'delivered', createdAt: new Date(Date.now() - 7 * 86400000).toISOString(),
        },
        {
          id: 'ord-006', customerId: 'cust-002', customerName: 'Sara Malik', customerPhone: '03002222222',
          shopId: 'desi-dawat', shopName: 'Desi Dawat',
          items: [{ name: 'Nihari', qty: 2, price: 450 }],
          total: 900, status: 'delivered', createdAt: new Date(Date.now() - 5 * 86400000).toISOString(),
        },
        {
          id: 'ord-007', customerId: 'cust-003', customerName: 'Omar Khan', customerPhone: '03003333333',
          shopId: 'pizza-corner', shopName: 'Pizza Corner',
          items: [{ name: 'Margarita Pizza', qty: 1, price: 750 }],
          total: 750, status: 'delivered', createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
        },
        {
          id: 'ord-008', customerId: 'cust-001', customerName: 'Ali Hassan', customerPhone: '03001111111',
          shopId: 'lahori-chaska', shopName: 'Lahori Chaska',
          items: [{ name: 'Mutton Karahi', qty: 1, price: 1200 }],
          total: 1200, status: 'delivered', createdAt: new Date(Date.now() - 15 * 86400000).toISOString(),
        },
      ],
      savedShops: [],
      shopRankings: {
        'karachi-grill': 1,
        'chai-wala': 2,
        'lahori-chaska': 3,
        'desi-dawat': 4,
        'pizza-corner': 5,
      },
      shopProducts: [],
      shopOverrides: [],
      customShops: [],

      addOrder: (orderData) => {
        set({ orders: [...get().orders, { ...orderData, id: `ord-${Date.now()}`, status: 'pending', createdAt: new Date().toISOString() }] })
      },

      updateOrderStatus: (orderId, status) => {
        set({ orders: get().orders.map((o) => o.id === orderId ? { ...o, status } : o) })
      },

      toggleSaveShop: (shopId) => {
        const saved = get().savedShops
        const exists = saved.find((s) => s.shopId === shopId)
        if (exists) {
          set({ savedShops: saved.filter((s) => s.shopId !== shopId) })
        } else {
          set({ savedShops: [...saved, { shopId, savedAt: new Date().toISOString() }] })
        }
      },

      isShopSaved: (shopId) => !!get().savedShops.find((s) => s.shopId === shopId),
      getOrdersByShop: (shopId) => get().orders.filter((o) => o.shopId === shopId),
      getOrdersByCustomer: (customerId) => get().orders.filter((o) => o.customerId === customerId),

      addCustomShop: (shop) => {
        set({ customShops: [...get().customShops, shop] })
      },

      setShopRank: (shopId, rank) => {
        set({ shopRankings: { ...get().shopRankings, [shopId]: rank } })
      },

      getShopStats: (shopId) => {
        const orders = get().orders.filter((o) => o.shopId === shopId && o.status !== 'cancelled')
        const now = new Date()
        const inRange = (date: string, from: Date) => new Date(date) >= from
        return {
          daily: orders.filter((o) => inRange(o.createdAt, new Date(now.getTime() - 86400000))).length,
          weekly: orders.filter((o) => inRange(o.createdAt, new Date(now.getTime() - 7 * 86400000))).length,
          monthly: orders.filter((o) => inRange(o.createdAt, new Date(now.getTime() - 30 * 86400000))).length,
          yearly: orders.filter((o) => inRange(o.createdAt, new Date(now.getTime() - 365 * 86400000))).length,
          total: orders.length,
          revenue: orders.reduce((s, o) => s + o.total, 0),
        }
      },

      addShopProduct: (product) => {
        set({
          shopProducts: [...get().shopProducts, {
            ...product,
            id: `sp-${Date.now()}`,
            createdAt: new Date().toISOString(),
          }],
        })
      },

      updateShopProduct: (id, updates) => {
        set({ shopProducts: get().shopProducts.map((p) => p.id === id ? { ...p, ...updates } : p) })
      },

      deleteShopProduct: (id) => {
        set({ shopProducts: get().shopProducts.filter((p) => p.id !== id) })
      },

      getShopProducts: (shopId) => get().shopProducts.filter((p) => p.shopId === shopId),

      toggleProductAvailability: (id) => {
        set({ shopProducts: get().shopProducts.map((p) => p.id === id ? { ...p, isAvailable: !p.isAvailable } : p) })
      },

      updateShopOverride: (shopId, data) => {
        const overrides = get().shopOverrides
        const exists = overrides.find((o) => o.shopId === shopId)
        if (exists) {
          set({ shopOverrides: overrides.map((o) => o.shopId === shopId ? { ...o, ...data } : o) })
        } else {
          set({ shopOverrides: [...overrides, { shopId, ...data }] })
        }
      },

      getShopOverride: (shopId) => get().shopOverrides.find((o) => o.shopId === shopId),
    }),
    {
      name: 'kacha-khuh-app-data',
      partialize: (state) => ({
        orders: state.orders,
        savedShops: state.savedShops,
        shopRankings: state.shopRankings,
        shopProducts: state.shopProducts,
        shopOverrides: state.shopOverrides,
        customShops: state.customShops,
      }),
    }
  )
)
