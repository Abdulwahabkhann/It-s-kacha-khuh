'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/lib/auth-store'
import { X, TrendingUp, Gift, Crown } from 'lucide-react'

export function ShopkeeperBonusPopup() {
  const { currentUser, popupShown, setPopupShown } = useAuthStore()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show for shopkeepers who haven't seen it this session
    if (currentUser?.role === 'shopkeeper' && !popupShown) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 15000) // 15 seconds

      return () => clearTimeout(timer)
    }
  }, [currentUser, popupShown])

  const handleClose = () => {
    setIsVisible(false)
    setPopupShown(true)
  }

  if (!isVisible) return null

  return (
    <div className="fixed bottom-20 right-4 z-50 animate-slide-in-right w-full max-w-[320px]">
      <div className="glass-light p-5 rounded-2xl shadow-card-hover border border-app-primary/30 relative overflow-hidden group">
        {/* Background Glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-app-primary/10 rounded-full blur-3xl group-hover:bg-app-primary/20 transition-colors" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 p-1.5 rounded-full hover:bg-white/10 transition-colors text-app-muted"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-app-primary/20 flex items-center justify-center shadow-glow-emerald">
              <TrendingUp className="w-5 h-5 text-app-primary" />
            </div>
            <div>
              <h3 className="text-app-text font-700 text-sm">Growth Strategy</h3>
              <p className="text-app-muted text-[10px] uppercase tracking-wider font-semibold">Message from CEO</p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-app-text/90 text-xs leading-relaxed">
              Jitne zeyada customer app per active hogy or order karygy, utna chance hai aap ki shop ko <span className="text-app-primary font-bold">TOP per dekhane ka!</span>
            </p>
            
            <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-app-secondary/20 shadow-glow-gold/10">
              <Gift className="w-4 h-4 text-app-secondary flex-shrink-0 mt-0.5" />
              <p className="text-app-text/80 text-[11px]">
                Behtareen performance per CEO ki taraf se <span className="text-app-secondary font-semibold">Special Bonus</span> bhi diya jayga.
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="w-full py-2.5 bg-app-primary hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all shadow-glow-emerald"
          >
            I'm Ready!
          </button>
        </div>
      </div>
    </div>
  )
}
