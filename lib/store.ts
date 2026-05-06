'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, CustomerInfo } from './types'

interface ToastState {
  message: string
  visible: boolean
}

interface CartStore {
  items: CartItem[]
  customerInfo: CustomerInfo
  isCartOpen: boolean
  toast: ToastState

  addItem: (item: Omit<CartItem, 'qty'>) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  setCustomerInfo: (info: Partial<CustomerInfo>) => void
  setCartOpen: (open: boolean) => void
  showToast: (message: string) => void

  subtotal: () => number
  itemCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      customerInfo: { name: '', phone: '', address: '' },
      isCartOpen: false,
      toast: { message: '', visible: false },

      addItem: (item) => {
        const items = get().items
        const existing = items.find((i) => i.id === item.id)
        if (existing) {
          set({
            items: items.map((i) =>
              i.id === item.id ? { ...i, qty: i.qty + 1 } : i
            ),
          })
        } else {
          set({ items: [...items, { ...item, qty: 1 }] })
        }
        get().showToast(`${item.name} added to cart`)
      },

      removeItem: (id) =>
        set({ items: get().items.filter((i) => i.id !== id) }),

      updateQty: (id, qty) => {
        if (qty <= 0) {
          get().removeItem(id)
        } else {
          set({
            items: get().items.map((i) => (i.id === id ? { ...i, qty } : i)),
          })
        }
      },

      clearCart: () => set({ items: [] }),

      setCustomerInfo: (info) =>
        set({ customerInfo: { ...get().customerInfo, ...info } }),

      setCartOpen: (open) => set({ isCartOpen: open }),

      showToast: (message) => {
        set({ toast: { message, visible: true } })
        setTimeout(() => set({ toast: { message: '', visible: false } }), 2800)
      },

      subtotal: () =>
        get().items.reduce((s, i) => s + i.price * i.qty, 0),

      itemCount: () =>
        get().items.reduce((s, i) => s + i.qty, 0),
    }),
    {
      name: 'kacha-khuh-cart',
      partialize: (state) => ({
        items: state.items,
        customerInfo: state.customerInfo,
      }),
    }
  )
)
