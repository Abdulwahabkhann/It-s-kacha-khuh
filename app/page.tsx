import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { HomeClient } from './HomeClient'
import shopsData from '@/data/shops.json'
import type { Shop } from '@/lib/types'
import Link from 'next/link'
import { MessageCircle, Mail } from 'lucide-react'

export default function HomePage() {
  const shops = shopsData as Shop[]

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-screen-md mx-auto w-full px-4 pb-28 pt-6">
        {/* Hero header */}
        <div className="mb-6">
          <p className="text-app-muted text-sm font-medium mb-1">
            🌟 Good food, right to your door
          </p>
          <h1 className="text-app-text font-700 text-2xl leading-tight text-balance">
            What are you craving
            <br />
            <span className="text-app-primary">today?</span>
          </h1>
        </div>

        {/* Interactive search + filter (client) */}
        <HomeClient shops={shops} />

        {/* Footer links */}
        <div className="mt-10 pt-6 border-t border-white/5">
          <div className="flex flex-col gap-3">
            <Link
              href="/contact"
              className="flex items-center gap-3 glass rounded-xl px-4 py-3 hover:bg-white/5 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-app-primary/10 flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-4 h-4 text-app-primary" />
              </div>
              <div>
                <p className="text-app-text text-sm font-semibold group-hover:text-app-primary transition-colors">Contact Us</p>
                <p className="text-app-muted text-xs">Reach shops or platform support</p>
              </div>
            </Link>

            <Link
              href="/auth"
              className="flex items-center gap-3 glass rounded-xl px-4 py-3 hover:bg-white/5 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <span className="text-base">🔐</span>
              </div>
              <div>
                <p className="text-app-text text-sm font-semibold group-hover:text-app-primary transition-colors">Sign In / Sign Up</p>
                <p className="text-app-muted text-xs">CEO, Shopkeeper, or Customer</p>
              </div>
            </Link>
          </div>

          <p className="text-center text-app-muted/40 text-xs mt-6">
            © 2024 Kacha Khuh · Local Food on WhatsApp
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
