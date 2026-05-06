'use client'

import { useState, useEffect } from 'react'
import { X, Plus, Minus, Trash2, MessageCircle, ShoppingBag } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import { generateWhatsAppMessage, openWhatsApp } from '@/lib/whatsapp'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'

export function CartDrawer() {
  const {
    items,
    customerInfo,
    isCartOpen,
    subtotal,
    itemCount,
    updateQty,
    removeItem,
    clearCart,
    setCartOpen,
    setCustomerInfo,
    showToast,
  } = useCartStore()

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  const count = itemCount()
  const total = subtotal()

  const validate = () => {
    const e: Record<string, string> = {}
    if (!customerInfo.name.trim()) e.name = 'Name is required'
    if (!customerInfo.phone.trim()) e.phone = 'Phone number is required'
    if (!customerInfo.address.trim()) e.address = 'Delivery address is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleOrder = () => {
    if (items.length === 0) {
      showToast('Your cart is empty')
      return
    }
    if (!validate()) return

    const shopPhone = items[0]?.shopWhatsapp
    if (!shopPhone) return

    const message = generateWhatsAppMessage(items, customerInfo, total)
    openWhatsApp(shopPhone, message)
  }

  return (
    <>
      {/* Overlay */}
      {isCartOpen && (
        <div
          className="drawer-overlay"
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-[420px] z-50
          glass border-l border-white/10
          flex flex-col
          transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
          <div>
            <h2 className="text-app-text font-700 text-lg">Your Cart</h2>
            <p className="text-app-muted text-xs mt-0.5">
              {count > 0 ? `${count} ${count === 1 ? 'item' : 'items'}` : 'Empty'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {count > 0 && (
              <button
                onClick={clearCart}
                className="text-xs text-red-400 hover:text-red-300 transition-colors px-2 py-1"
              >
                Clear all
              </button>
            )}
            <button
              onClick={() => setCartOpen(false)}
              className="w-8 h-8 rounded-lg glass-light flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4 text-app-muted" />
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Empty state */}
          {items.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 text-app-muted/40" />
              </div>
              <p className="text-app-muted text-sm">Your cart is empty</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setCartOpen(false)}
              >
                Browse shops
              </Button>
            </div>
          )}

          {/* Cart items */}
          {items.length > 0 && (
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 glass-light rounded-xl p-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-app-text text-sm font-semibold leading-tight">
                      {item.name}
                    </p>
                    <p className="text-app-primary text-sm font-700 mt-1">
                      {formatPrice(item.price * item.qty)}
                    </p>
                    <p className="text-app-muted text-xs mt-0.5">
                      {formatPrice(item.price)} each
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      className="w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
                    >
                      <Minus className="w-3 h-3 text-app-muted" />
                    </button>
                    <span className="w-6 text-center text-sm font-semibold text-app-text">
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      className="w-7 h-7 rounded-lg bg-app-primary/15 border border-app-primary/30 flex items-center justify-center hover:bg-app-primary/25 transition-colors"
                    >
                      <Plus className="w-3 h-3 text-app-primary" />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-colors ml-1"
                    >
                      <Trash2 className="w-3 h-3 text-red-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Order summary */}
          {items.length > 0 && (
            <div className="glass-light rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm text-app-muted">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div className="flex justify-between text-sm text-app-muted">
                <span>Delivery</span>
                <span className="text-app-secondary font-medium">Ask on WhatsApp</span>
              </div>
              <div className="border-t border-white/10 pt-2 flex justify-between font-700 text-app-text">
                <span>Total</span>
                <span className="text-app-primary text-lg">{formatPrice(total)}</span>
              </div>
            </div>
          )}

          {/* Customer info form */}
          {items.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-app-text font-semibold text-sm">
                Your Details
              </h3>
              <Input
                label="Full Name *"
                placeholder="e.g. Ahmed Khan"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ name: e.target.value })}
                error={errors.name}
              />
              <Input
                label="Phone Number *"
                placeholder="03XX-XXXXXXX"
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ phone: e.target.value })}
                error={errors.phone}
              />
              <Textarea
                label="Delivery Address *"
                placeholder="House #, Street, Area, City"
                rows={3}
                value={customerInfo.address}
                onChange={(e) => setCustomerInfo({ address: e.target.value })}
                error={errors.address}
              />
            </div>
          )}

          {/* Spacer for bottom button */}
          <div className="h-4" />
        </div>

        {/* Sticky bottom CTA */}
        {items.length > 0 && (
          <div className="px-5 pb-6 pt-3 border-t border-white/10">
            <Button
              variant="secondary"
              size="lg"
              className="w-full text-base font-700"
              onClick={handleOrder}
            >
              <MessageCircle className="w-5 h-5" />
              Order on WhatsApp
            </Button>
            <p className="text-center text-app-muted text-[11px] mt-2">
              You'll be redirected to WhatsApp with your order details
            </p>
          </div>
        )}
      </div>
    </>
  )
}
