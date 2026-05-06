'use client'

import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, variant = 'primary', size = 'md', loading, children, disabled, ...props },
    ref
  ) => {
    const base =
      'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed select-none'

    const variants = {
      primary:
        'bg-app-primary text-white hover:bg-[#ff8050] hover:scale-[1.03] shadow-[0_4px_16px_rgba(255,107,44,0.35)] hover:shadow-glow-orange',
      secondary:
        'bg-app-secondary text-white hover:bg-[#4ade80] hover:scale-[1.03] shadow-[0_4px_16px_rgba(34,197,94,0.35)] hover:shadow-glow-green',
      ghost:
        'bg-white/5 text-app-text hover:bg-white/10 border border-white/10 hover:border-white/20',
      danger:
        'bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30',
    }

    const sizes = {
      sm: 'text-sm px-3 py-1.5 gap-1.5',
      md: 'text-sm px-4 py-2.5 gap-2',
      lg: 'text-base px-6 py-3.5 gap-2',
    }

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
export { Button }
