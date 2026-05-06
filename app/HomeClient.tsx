'use client'

import { useState, useMemo } from 'react'
import { SearchBar } from '@/components/SearchBar'
import { CategoryChips } from '@/components/CategoryChips'
import { ShopCard } from '@/components/ShopCard'
import type { Shop } from '@/lib/types'
import { useAppStore } from '@/lib/app-store'

interface HomeClientProps {
  shops: Shop[]
}

export function HomeClient({ shops }: HomeClientProps) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const { shopRankings, customShops } = useAppStore()

  // Sort by CEO rank first
  const rankedShops = useMemo(() => {
    const combinedShops = [...shops, ...customShops]
    return combinedShops.sort((a, b) => {
      const rankA = shopRankings[a.id] ?? 99
      const rankB = shopRankings[b.id] ?? 99
      return rankA - rankB
    })
  }, [shops, customShops, shopRankings])

  const filtered = useMemo(() => {
    return rankedShops.filter((shop) => {
      const matchesSearch =
        query.trim() === '' ||
        shop.name.toLowerCase().includes(query.toLowerCase()) ||
        shop.area.toLowerCase().includes(query.toLowerCase()) ||
        shop.categories.some((c) =>
          c.toLowerCase().includes(query.toLowerCase())
        )

      const matchesCategory =
        category === 'All' ||
        shop.categories.some((c) =>
          c.toLowerCase() === category.toLowerCase()
        )

      return matchesSearch && matchesCategory
    })
  }, [rankedShops, query, category])

  // Build rank map for display
  const rankMap = useMemo(() => {
    const combinedShops = [...shops, ...customShops]
    const sorted = combinedShops.sort((a, b) => (shopRankings[a.id] ?? 99) - (shopRankings[b.id] ?? 99))
    const map: Record<string, number> = {}
    sorted.forEach((s, i) => { map[s.id] = i + 1 })
    return map
  }, [shops, customShops, shopRankings])

  return (
    <>
      <SearchBar
        onSearch={setQuery}
        className="mb-5"
        placeholder="Search shops, dishes, areas..."
      />

      <div className="mb-6">
        <CategoryChips onSelect={setCategory} />
      </div>

      {/* Shop grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-app-text font-semibold text-base">
            {category === 'All' ? 'All Shops' : category}
          </h2>
          <span className="text-app-muted text-xs">
            {filtered.length} {filtered.length === 1 ? 'shop' : 'shops'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <span className="text-4xl">🔍</span>
            <p className="text-app-muted text-sm">No shops found</p>
            <p className="text-app-muted/60 text-xs">
              Try a different search or category
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {filtered.map((shop) => (
              <ShopCard key={shop.id} shop={shop} rank={rankMap[shop.id]} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
