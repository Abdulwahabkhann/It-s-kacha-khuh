'use client'

import { Heart, Trash2 } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { ShopCard } from '@/components/ShopCard'
import { useAppStore } from '@/lib/app-store'
import shopsData from '@/data/shops.json'
import type { Shop } from '@/lib/types'

const allShops = shopsData as Shop[]

export default function FavoritesPage() {
  const { savedShops, toggleSaveShop } = useAppStore()

  const favShops = savedShops
    .map((s) => allShops.find((sh) => sh.id === s.shopId))
    .filter(Boolean) as Shop[]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-screen-md mx-auto w-full px-4 pb-28 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-app-text flex items-center gap-2">
            <Heart className="w-6 h-6 text-app-primary fill-app-primary" />
            Saved Shops
          </h1>
          <p className="text-app-muted text-sm mt-1">Your favourite places to eat</p>
        </div>

        {favShops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-20 h-20 rounded-3xl bg-app-primary/10 border border-app-primary/20 flex items-center justify-center">
              <Heart className="w-10 h-10 text-app-primary opacity-50" />
            </div>
            <div className="text-center">
              <p className="text-app-text font-semibold text-lg">No saved shops yet</p>
              <p className="text-app-muted text-sm mt-1">
                Tap the ❤️ on any shop to save it here
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-app-muted text-sm">{favShops.length} saved</span>
              <button
                onClick={() => savedShops.forEach((s) => toggleSaveShop(s.shopId))}
                className="text-xs text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            </div>
            {favShops.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
