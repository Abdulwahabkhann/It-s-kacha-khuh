'use client'

import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { useCartStore } from '@/lib/store'

export function ToastNotification() {
  const { toast } = useCartStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <div
      className={`
        fixed bottom-24 left-1/2 -translate-x-1/2 z-[60]
        transition-all duration-300 ease-out pointer-events-none
        ${toast.visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}
      `}
    >
      {toast.message && (
        <div className="glass flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-card max-w-[280px]">
          <CheckCircle className="w-4 h-4 text-app-secondary flex-shrink-0" />
          <p className="text-app-text text-sm font-medium truncate">{toast.message}</p>
        </div>
      )}
    </div>
  )
}
