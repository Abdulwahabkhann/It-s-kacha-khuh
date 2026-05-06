'use client'

import { Search, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ onSearch, placeholder = 'Search shops or food...', className }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)

  const handleChange = (value: string) => {
    setQuery(value)
    onSearch?.(value)
  }

  return (
    <div
      className={cn(
        'relative flex items-center glass rounded-2xl border transition-all duration-200',
        focused
          ? 'border-app-primary/50 ring-2 ring-app-primary/20 shadow-glow-orange'
          : 'border-white/10',
        className
      )}
    >
      <Search
        className={cn(
          'absolute left-4 w-4 h-4 transition-colors duration-200',
          focused ? 'text-app-primary' : 'text-app-muted'
        )}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => handleChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        className="w-full bg-transparent pl-11 pr-10 py-3.5 text-app-text text-sm placeholder:text-app-muted/60 focus:outline-none"
      />
      {query && (
        <button
          onClick={() => handleChange('')}
          className="absolute right-3 w-6 h-6 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
        >
          <X className="w-3 h-3 text-app-muted" />
        </button>
      )}
    </div>
  )
}
