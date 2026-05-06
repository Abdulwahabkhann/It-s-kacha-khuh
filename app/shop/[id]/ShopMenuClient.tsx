'use client'

import { useState } from 'react'
import { MenuItem } from '@/components/MenuItem'
import { cn } from '@/lib/utils'
import type { Product, Shop } from '@/lib/types'

interface ShopMenuClientProps {
  grouped: Record<string, Product[]>
  shop: Shop
}

export function ShopMenuClient({ grouped, shop }: ShopMenuClientProps) {
  const categories = Object.keys(grouped)
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? '')

  const activeProducts = grouped[activeCategory] ?? []

  return (
    <div>
      {/* Category tabs */}
      <div className="scroll-x flex gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border',
              activeCategory === cat
                ? 'bg-app-primary text-white border-app-primary shadow-glow-orange'
                : 'glass-light text-app-muted border-white/10 hover:text-app-text'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Category heading */}
      <h2 className="text-app-text font-700 text-lg mb-1">{activeCategory}</h2>
      <p className="text-app-muted text-xs mb-4">
        {activeProducts.length} {activeProducts.length === 1 ? 'item' : 'items'}
      </p>

      {/* Menu items */}
      <div className="glass rounded-2xl px-4 divide-y divide-white/5">
        {activeProducts.map((product) => (
          <MenuItem key={product.id} product={product} shop={shop} />
        ))}
      </div>
    </div>
  )
}
