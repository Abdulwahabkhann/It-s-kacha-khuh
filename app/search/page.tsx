'use client'

import { useState, useMemo } from 'react'
import { Search, X, SlidersHorizontal } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { ShopCard } from '@/components/ShopCard'
import shopsData from '@/data/shops.json'
import type { Shop } from '@/lib/types'

const shops = shopsData as Shop[]
const ALL_CATEGORIES = ['All', ...Array.from(new Set(shops.flatMap((s) => s.categories)))]

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    return shops.filter((shop) => {
      const matchesSearch =
        query.trim() === '' ||
        shop.name.toLowerCase().includes(query.toLowerCase()) ||
        shop.area.toLowerCase().includes(query.toLowerCase()) ||
        shop.categories.some((c) => c.toLowerCase().includes(query.toLowerCase()))

      const matchesCategory =
        category === 'All' || shop.categories.some((c) => c.toLowerCase() === category.toLowerCase())

      return matchesSearch && matchesCategory
    })
  }, [query, category])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-screen-md mx-auto w-full px-4 pb-28 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-app-text">
            Find <span className="text-app-primary">Food</span>
          </h1>
          <p className="text-app-muted text-sm mt-1">Search shops, cuisines, or areas</p>
        </div>

        {/* Search input */}
        <div
          className={`relative flex items-center glass rounded-2xl border transition-all duration-200 mb-5 ${
            focused ? 'border-app-primary/50 ring-2 ring-app-primary/20 shadow-glow-orange' : 'border-white/10'
          }`}
        >
          <Search
            className={`absolute left-4 w-4 h-4 transition-colors duration-200 ${
              focused ? 'text-app-primary' : 'text-app-muted'
            }`}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Search shops, dishes, areas..."
            className="w-full bg-transparent pl-11 pr-10 py-4 text-app-text text-sm placeholder:text-app-muted/60 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-app-muted" />
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto scroll-x pb-1 mb-6">
          {ALL_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                category === cat
                  ? 'bg-app-primary text-white border-app-primary shadow-glow-orange'
                  : 'bg-white/5 text-app-muted border-white/10 hover:border-white/20 hover:text-app-text'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-app-text font-semibold text-sm">
            {query || category !== 'All' ? 'Search Results' : 'All Shops'}
          </h2>
          <span className="text-app-muted text-xs">
            {filtered.length} {filtered.length === 1 ? 'shop' : 'shops'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <span className="text-5xl">🔍</span>
            <p className="text-app-muted text-base font-semibold">No results found</p>
            <p className="text-app-muted/60 text-sm text-center">
              Try searching with different keywords<br />or select a different category
            </p>
            <button
              onClick={() => { setQuery(''); setCategory('All') }}
              className="mt-2 px-5 py-2.5 bg-app-primary/10 text-app-primary border border-app-primary/20 rounded-xl text-sm font-semibold hover:bg-app-primary/20 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {filtered.map((shop) => (
              <ShopCard key={shop.id} shop={shop} />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
