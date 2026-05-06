'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

const CATEGORIES = [
  { label: 'All', emoji: '🍽️' },
  { label: 'Burgers', emoji: '🍔' },
  { label: 'BBQ', emoji: '🔥' },
  { label: 'Biryani', emoji: '🍛' },
  { label: 'Pizza', emoji: '🍕' },
  { label: 'Desi', emoji: '🫕' },
  { label: 'Chai', emoji: '☕' },
  { label: 'Rolls', emoji: '🌯' },
  { label: 'Desserts', emoji: '🍰' },
]

interface CategoryChipsProps {
  onSelect?: (category: string) => void
}

export function CategoryChips({ onSelect }: CategoryChipsProps) {
  const [active, setActive] = useState('All')

  const handleSelect = (label: string) => {
    setActive(label)
    onSelect?.(label)
  }

  return (
    <div className="scroll-x flex gap-2 py-1">
      {CATEGORIES.map(({ label, emoji }) => (
        <button
          key={label}
          onClick={() => handleSelect(label)}
          className={cn(
            'flex-shrink-0 flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-medium',
            'transition-all duration-200 border',
            active === label
              ? 'bg-app-primary text-white border-app-primary shadow-glow-orange scale-105'
              : 'glass-light text-app-muted border-white/10 hover:text-app-text hover:border-white/20'
          )}
        >
          <span>{emoji}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
