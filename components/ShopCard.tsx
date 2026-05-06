'use client'

import Link from 'next/link'
import { Star, Clock, MessageCircle, MapPin, Heart } from 'lucide-react'
import type { Shop } from '@/lib/types'
import { useAppStore } from '@/lib/app-store'
import { cn } from '@/lib/utils'

interface ShopCardProps {
  shop: Shop
  rank?: number
}

export function ShopCard({ shop, rank }: ShopCardProps) {
  const { toggleSaveShop, isShopSaved, getShopOverride } = useAppStore()
  const saved = isShopSaved(shop.id)

  const override = getShopOverride(shop.id)
  const bannerUrl = override?.bannerUrl || shop.bannerUrl
  const deliveryTime = override?.deliveryTime || shop.deliveryTime

  const handleSave = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleSaveShop(shop.id)
  }

  return (
    <Link href={`/shop/${shop.id}`}>
      <div className="group glass rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 cursor-pointer">
        {/* Banner */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-app-surface">
          {bannerUrl ? (
            <img
              src={bannerUrl}
              alt={shop.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-app-primary/20 to-app-surface flex items-center justify-center">
              <span className="text-4xl">🍽️</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* CEO rank badge */}
          {rank && rank <= 3 && (
            <div className="absolute top-3 left-3 flex items-center gap-1 bg-yellow-400/90 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="text-[10px] font-bold text-black">
                {rank === 1 ? '🥇 #1 Ranked' : rank === 2 ? '🥈 #2 Ranked' : '🥉 #3 Ranked'}
              </span>
            </div>
          )}

          {/* WhatsApp badge */}
          <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-app-secondary/90 backdrop-blur-sm rounded-full px-2.5 py-1">
            <MessageCircle className="w-3 h-3 text-white" />
            <span className="text-white text-[10px] font-semibold">WhatsApp Order</span>
          </div>

          {/* Rating — bottom left over image */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm rounded-full px-2.5 py-1">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-white text-xs font-semibold">{shop.rating}</span>
          </div>

          {/* Save button */}
          <button
            onClick={handleSave}
            aria-label={saved ? 'Remove from saved' : 'Save shop'}
            className={cn(
              'absolute bottom-3 right-3 w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all duration-200',
              saved
                ? 'bg-app-primary/90 text-white'
                : 'bg-black/50 text-white/70 hover:bg-app-primary/70 hover:text-white'
            )}
          >
            <Heart className={cn('w-3.5 h-3.5', saved && 'fill-white')} />
          </button>
        </div>

        {/* Info */}
        <div className="p-4">
          <h3 className="text-app-text font-semibold text-base leading-tight group-hover:text-app-primary transition-colors">
            {shop.name}
          </h3>

          <div className="mt-1.5 flex items-center gap-3 text-app-muted text-xs">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {shop.area}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {deliveryTime}
            </span>
          </div>

          {/* Categories */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {shop.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white/5 text-app-muted border border-white/10"
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}
