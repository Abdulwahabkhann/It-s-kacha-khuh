'use client'

import { ShoppingBag, ChevronRight } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'

export function FloatingCartBar() {
  const { items, subtotal, itemCount, setCartOpen } = useCartStore()
  const count = itemCount()
  const total = subtotal()

  if (count === 0) return null

  return (
    <div className="fixed bottom-20 left-0 right-0 z-20 px-4 pointer-events-none">
      <div className="max-w-screen-md mx-auto">
        <button
          onClick={() => setCartOpen(true)}
          className="pointer-events-auto w-full flex items-center justify-between bg-app-primary rounded-2xl px-4 py-3.5 shadow-[0_8px_32px_rgba(255,107,44,0.45)] hover:bg-[#ff8050] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-white/80 text-xs font-medium">
                {count} {count === 1 ? 'item' : 'items'} in cart
              </p>
              <p className="text-white font-700 text-base leading-tight">
                {formatPrice(total)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-white font-semibold text-sm">
            View Cart
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>
      </div>
    </div>
  )
}
