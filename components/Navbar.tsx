'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ShoppingBag, Sparkles, User, Crown, Store, LogIn } from 'lucide-react'
import { useCartStore } from '@/lib/store'
import { useAuthStore } from '@/lib/auth-store'

export function Navbar() {
  const { itemCount, setCartOpen } = useCartStore()
  const { currentUser } = useAuthStore()
  const count = itemCount()
  const router = useRouter()

  const handleUserClick = () => {
    if (!currentUser) {
      router.push('/auth')
    } else if (currentUser.role === 'ceo') {
      router.push('/ceo')
    } else if (currentUser.role === 'shopkeeper') {
      router.push('/shop-dashboard')
    } else {
      router.push('/profile')
    }
  }

  return (
    <header className="sticky top-0 z-30 glass border-b border-white/10">
      <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-app-primary to-emerald-700 flex items-center justify-center shadow-glow-emerald transform group-hover:scale-110 transition-transform duration-300 ring-2 ring-white/10">
            <Sparkles className="w-5 h-5 text-app-secondary animate-pulse" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-xl font-800 tracking-tighter bg-gradient-to-r from-emerald-400 via-app-secondary to-emerald-500 bg-clip-text text-transparent drop-shadow-sm">
              Shandaar
            </span>
            <span className="text-[10px] text-app-muted font-bold tracking-widest uppercase flex items-center gap-1">
              <span>Premium</span>
              <span className="w-1 h-1 rounded-full bg-app-secondary" />
              <span>Trustworthy</span>
            </span>
          </div>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative flex items-center gap-2 glass-light rounded-xl px-3 py-2 hover:bg-white/10 transition-all duration-200 group"
            aria-label="Open cart"
          >
            <ShoppingBag className="w-5 h-5 text-app-muted group-hover:text-app-primary transition-colors" />
            {count > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-app-primary rounded-full text-white text-[10px] font-bold flex items-center justify-center animate-badge-pop shadow-glow-emerald">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          {/* User button */}
          <button
            onClick={handleUserClick}
            className="relative flex items-center gap-2 glass-light rounded-xl px-3 py-2 hover:bg-white/10 transition-all duration-200 group"
            aria-label="User account"
          >
            {!currentUser ? (
              <LogIn className="w-5 h-5 text-app-muted group-hover:text-app-primary transition-colors" />
            ) : currentUser.role === 'ceo' ? (
              <Crown className="w-5 h-5 text-yellow-400" />
            ) : currentUser.role === 'shopkeeper' ? (
              <Store className="w-5 h-5 text-app-primary" />
            ) : (
              <div className="w-5 h-5 rounded-full bg-app-primary text-white text-[10px] font-bold flex items-center justify-center">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
