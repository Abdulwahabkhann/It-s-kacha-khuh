'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Home, Search, ShoppingBag, Heart, User } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth-store'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { itemCount, setCartOpen } = useCartStore()
  const { currentUser } = useAuthStore()
  const count = itemCount()

  const NAV_ITEMS = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/search', icon: Search, label: 'Search' },
    { href: '#cart', icon: ShoppingBag, label: 'Cart', isCart: true },
    { href: '/favorites', icon: Heart, label: 'Saved' },
    { href: currentUser ? '/profile' : '/auth', icon: User, label: currentUser ? 'Profile' : 'Login' },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 glass border-t border-white/10 safe-area-inset-bottom">
      <div className="max-w-screen-md mx-auto px-2 h-16 flex items-center justify-around">
        {NAV_ITEMS.map(({ href, icon: Icon, label, isCart }) => {
          const isActive = !isCart && pathname === href
          return (
            <button
              key={label}
              onClick={isCart ? () => setCartOpen(true) : () => router.push(href)}
              className={cn(
                'flex flex-col items-center gap-1 min-w-[52px] py-2 rounded-xl transition-all duration-200',
                isActive
                  ? 'text-app-primary'
                  : 'text-app-muted hover:text-app-text'
              )}
            >
              {isCart ? (
                <div className="relative">
                  <Icon className={cn('w-5 h-5', isActive && 'text-app-primary')} />
                  {count > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-app-primary rounded-full text-white text-[9px] font-bold flex items-center justify-center">
                      {count > 9 ? '9+' : count}
                    </span>
                  )}
                </div>
              ) : (
                <Icon className="w-5 h-5" />
              )}
              <span className="text-[10px] font-medium">{label}</span>
              {isActive && (
                <span className="absolute bottom-1.5 w-1 h-1 rounded-full bg-app-primary" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}
