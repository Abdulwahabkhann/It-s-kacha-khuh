'use client'

import { useState } from 'react'
import { Plus, Check, Video, Image as ImageIcon } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { formatPrice } from '@/lib/utils'
import type { Product, Shop } from '@/lib/types'

interface MenuItemProps {
  product: Product
  shop: Shop
}

export function MenuItem({ product, shop }: MenuItemProps) {
  const { addItem, items } = useCartStore()
  const [justAdded, setJustAdded] = useState(false)

  const cartItem = items.find((i) => i.id === product.id)
  const qtyInCart = cartItem?.qty ?? 0

  const isOutOfStock = product.isAvailable === false || product.quantity === 0

  const handleAdd = () => {
    if (isOutOfStock) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      shopId: shop.id,
      shopName: shop.name,
      shopWhatsapp: shop.whatsapp,
    })
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 1200)
  }

  return (
    <div className={`flex items-start gap-4 py-4 border-b border-white/5 last:border-0 group ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}>
      
      {/* Media Thumbnail */}
      {product.mediaUrl && (
        <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-black/40 relative border border-white/10 shadow-lg">
          {product.mediaType === 'video' ? (
            <video src={product.mediaUrl} className="w-full h-full object-cover" muted loop playsInline autoPlay />
          ) : (
            <img src={product.mediaUrl} alt={product.name} className="w-full h-full object-cover" />
          )}
          <div className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-md rounded px-1 py-0.5 flex items-center">
            {product.mediaType === 'video' ? <Video className="w-3 h-3 text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
          </div>
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <h4 className="text-app-text font-semibold text-base leading-tight group-hover:text-app-primary transition-colors">
              {product.name}
            </h4>
            {qtyInCart > 0 && (
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-app-primary/20 border border-app-primary/40 text-app-primary text-[10px] font-bold flex items-center justify-center">
                {qtyInCart}
              </span>
            )}
          </div>
          {isOutOfStock && (
            <span className="text-[10px] font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded-full inline-block w-fit">
              OUT OF STOCK
            </span>
          )}
        </div>
        
        {product.description && (
          <p className="mt-1 text-xs text-app-muted leading-relaxed line-clamp-2">
            {product.description}
          </p>
        )}
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <p className="text-sm font-700 text-app-primary">
              {formatPrice(product.price)}
            </p>
            {product.quantity !== undefined && !isOutOfStock && (
              <span className="text-[10px] text-app-muted mt-0.5">
                {product.quantity} remaining
              </span>
            )}
          </div>

          {/* Add button */}
          <button
            onClick={handleAdd}
            disabled={isOutOfStock}
            className={`
              flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center font-bold text-lg
              transition-all duration-200 active:scale-90
              ${
                isOutOfStock
                  ? 'bg-white/5 border border-white/10 text-app-muted cursor-not-allowed'
                  : justAdded
                  ? 'bg-app-secondary/20 border border-app-secondary/50 text-app-secondary scale-110'
                  : 'bg-app-primary/15 border border-app-primary/30 text-app-primary hover:bg-app-primary hover:text-white hover:shadow-glow-orange hover:scale-105'
              }
            `}
            aria-label={`Add ${product.name} to cart`}
          >
            {justAdded ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
