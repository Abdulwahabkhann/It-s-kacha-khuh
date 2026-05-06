'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Star, Clock, MapPin, MessageCircle, Phone, Video, Image as ImageIcon } from 'lucide-react'
import { useAppStore } from '@/lib/app-store'
import { FloatingCartBar } from '@/components/FloatingCartBar'
import { BottomNav } from '@/components/BottomNav'
import { Navbar } from '@/components/Navbar'
import { MenuItem } from '@/components/MenuItem'
import type { Shop, Product } from '@/lib/types'
import { groupBy, cn } from '@/lib/utils'

interface ShopPageClientProps {
  initialShop: Shop
  initialProducts: Product[]
}

export function ShopPageClient({ initialShop, initialProducts }: ShopPageClientProps) {
  const { getShopOverride, shopProducts, customShops } = useAppStore()

  // First, check if this is a custom shop from the store
  const actualShopData = customShops.find(s => s.id === initialShop.id) || initialShop

  // Apply overrides to shop details
  const override = getShopOverride(actualShopData.id)
  const shop = {
    ...actualShopData,
    riderName: override?.riderName || actualShopData.riderName,
    riderPhone: override?.riderPhone || actualShopData.riderPhone,
    deliveryTime: override?.deliveryTime || actualShopData.deliveryTime,
    bannerUrl: override?.bannerUrl || actualShopData.bannerUrl,
  }

  // Combine static products with custom shop products
  const customProducts = shopProducts.filter((p) => p.shopId === shop.id && p.isAvailable)
  const allProducts = [...initialProducts, ...customProducts]
  const grouped = groupBy(allProducts, 'category')
  const categories = Object.keys(grouped)
  
  const [activeCategory, setActiveCategory] = useState(categories[0] ?? '')
  const activeProducts = grouped[activeCategory] ?? []

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-screen-md mx-auto w-full pb-36">
        {/* Hero banner */}
        <div className="relative w-full aspect-[16/7] overflow-hidden">
          {shop.bannerUrl ? (
            <img
              src={shop.bannerUrl}
              alt={shop.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-app-primary/20 to-app-surface" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-app-bg via-app-bg/40 to-transparent" />

          {/* Back button */}
          <Link
            href="/"
            className="absolute top-4 left-4 w-9 h-9 glass rounded-xl flex items-center justify-center hover:bg-white/15 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-white" />
          </Link>

          {/* Shop name over banner */}
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-white font-700 text-2xl leading-tight drop-shadow-lg">
              {shop.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5">
              <span className="flex items-center gap-1 text-white/80 text-xs">
                <MapPin className="w-3 h-3" />
                {shop.area}
              </span>
              <span className="flex items-center gap-1 text-white/80 text-xs">
                <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                {shop.rating}
              </span>
              <span className="flex items-center gap-1 text-white/80 text-xs">
                <Clock className="w-3 h-3" />
                {shop.deliveryTime}
              </span>
            </div>
          </div>
        </div>

        {/* Shop info bar */}
        <div className="mx-4 -mt-4 relative z-10">
          <div className="glass rounded-2xl px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-app-muted text-xs">Delivery via WhatsApp</p>
              {shop.riderName && (
                <p className="text-app-text text-sm font-medium mt-0.5">
                  🛵 Rider: {shop.riderName}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {shop.riderPhone && (
                <a
                  href={`tel:${shop.riderPhone}`}
                  className="w-9 h-9 rounded-xl glass-light flex items-center justify-center hover:bg-white/10 transition-colors border border-white/10"
                >
                  <Phone className="w-4 h-4 text-app-muted" />
                </a>
              )}
              <a
                href={`https://wa.me/${shop.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-app-secondary/20 border border-app-secondary/30 text-app-secondary rounded-xl px-3 py-2 text-xs font-semibold hover:bg-app-secondary/30 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                Chat
              </a>
            </div>
          </div>
        </div>

        {/* Menu Section */}
        <div className="px-4 mt-6">
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
          {activeCategory && (
            <>
              <h2 className="text-app-text font-700 text-lg mb-1">{activeCategory}</h2>
              <p className="text-app-muted text-xs mb-4">
                {activeProducts.length} {activeProducts.length === 1 ? 'item' : 'items'}
              </p>

              {/* Menu items list */}
              <div className="grid grid-cols-1 gap-4">
                {activeProducts.map((product) => (
                  <MenuItem key={product.id} product={product} shop={shop} />
                ))}
              </div>
            </>
          )}
        </div>
      </main>

      <FloatingCartBar />
      <BottomNav />
    </div>
  )
}
