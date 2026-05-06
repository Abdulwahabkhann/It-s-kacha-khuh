'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, Flame, Mail, Lock, User, Phone, Store, Shield, ChevronDown } from 'lucide-react'
import { useAuthStore, UserRole } from '@/lib/auth-store'

type Mode = 'login' | 'signup'

const ROLE_OPTIONS: { value: UserRole; label: string; icon: string; desc: string }[] = [
  { value: 'customer', label: 'Customer', icon: '🛍️', desc: 'Order food from shops' },
  { value: 'shopkeeper', label: 'Shopkeeper', icon: '🏪', desc: 'Manage your shop & menu' },
  { value: 'ceo', label: 'CEO', icon: '👑', desc: 'Platform administration' },
]

const SHOP_OPTIONS = [
  { id: 'karachi-grill', name: 'Karachi Grill House' },
  { id: 'lahori-chaska', name: 'Lahori Chaska' },
  { id: 'pizza-corner', name: 'Pizza Corner' },
  { id: 'chai-wala', name: 'Chai Wala Express' },
  { id: 'desi-dawat', name: 'Desi Dawat' },
]

export default function AuthPage() {
  const router = useRouter()
  const { login, signup, currentUser } = useAuthStore()

  const [mode, setMode] = useState<Mode>('login')
  const [role, setRole] = useState<UserRole>('customer')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    shopName: '',
    ceoCode: '',
  })

  // If already logged in, redirect
  if (currentUser) {
    if (currentUser.role === 'ceo') router.replace('/ceo')
    else if (currentUser.role === 'shopkeeper') router.replace('/shop-dashboard')
    else router.replace('/')
  }

  const upd = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    await new Promise((r) => setTimeout(r, 600))

    if (mode === 'login') {
      const res = login(form.email, form.password)
      if (!res.success) {
        setError(res.message)
        setLoading(false)
        return
      }
      setSuccess(res.message)
      setTimeout(() => {
        const user = useAuthStore.getState().currentUser
        if (user?.role === 'ceo') router.replace('/ceo')
        else if (user?.role === 'shopkeeper') router.replace('/shop-dashboard')
        else router.replace('/')
      }, 800)
    } else {
      if (!form.name.trim()) { setError('Name is required.'); setLoading(false); return }
      if (!form.email.trim()) { setError('Email is required.'); setLoading(false); return }
      if (!form.phone.trim()) { setError('Phone number is required.'); setLoading(false); return }
      if (form.password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return }
      if (role === 'shopkeeper' && !form.shopName.trim()) { setError('Please enter your shop name.'); setLoading(false); return }

      // Generate shop ID for shopkeepers
      const newShopId = role === 'shopkeeper' 
        ? `shop-${Date.now()}-${form.shopName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
        : undefined

      const res = signup({
        name: form.name,
        email: form.email,
        password: form.password,
        role,
        phone: form.phone,
        shopId: newShopId,
        ceoCode: form.ceoCode,
      })
      
      if (!res.success) {
        setError(res.message)
        setLoading(false)
        return
      }

      // If shopkeeper, register the custom shop in app-store
      if (role === 'shopkeeper' && newShopId) {
        const { useAppStore } = await import('@/lib/app-store')
        useAppStore.getState().addCustomShop({
          id: newShopId,
          name: form.shopName,
          area: 'New Area', // Default area
          whatsapp: form.phone, // Default whatsapp
          rating: 0,
          deliveryTime: '30 min',
          categories: ['General'],
        })
      }

      setSuccess(res.message)
      setTimeout(() => {
        const user = useAuthStore.getState().currentUser
        if (user?.role === 'ceo') router.replace('/ceo')
        else if (user?.role === 'shopkeeper') router.replace('/shop-dashboard')
        else router.replace('/')
      }, 800)
    }
    setLoading(false)
  }

  const inputCls = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-11 text-app-text text-sm placeholder:text-app-muted/50 focus:outline-none focus:border-app-primary/60 focus:ring-2 focus:ring-app-primary/20 transition-all'

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex w-16 h-16 rounded-2xl bg-app-primary items-center justify-center shadow-glow-orange mb-4">
            <Flame className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-app-text tracking-tight">
            {mode === 'login' ? 'Welcome Back!' : 'Join Kacha Khuh'}
          </h1>
          <p className="text-app-muted text-sm mt-1">
            {mode === 'login' ? 'Sign in to your account' : 'Create your account to get started'}
          </p>
        </div>

        {/* Card */}
        <div className="glass rounded-3xl p-6 border border-white/10">
          {/* Mode toggle */}
          <div className="flex gap-1 p-1 glass rounded-2xl mb-6">
            {(['login', 'signup'] as Mode[]).map((m) => (
              <button
                key={m}
                onClick={() => { setMode(m); setError(''); setSuccess('') }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  mode === m ? 'bg-app-primary text-white shadow-glow-orange' : 'text-app-muted hover:text-app-text'
                }`}
              >
                {m === 'login' ? 'Sign In' : 'Sign Up'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector (signup only) */}
            {mode === 'signup' && (
              <div className="grid grid-cols-3 gap-2 mb-2">
                {ROLE_OPTIONS.map((r) => (
                  <button
                    key={r.value}
                    type="button"
                    onClick={() => setRole(r.value)}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl border transition-all text-center ${
                      role === r.value
                        ? 'border-app-primary/60 bg-app-primary/10 text-app-primary'
                        : 'border-white/10 text-app-muted hover:border-white/20 hover:text-app-text'
                    }`}
                  >
                    <span className="text-xl">{r.icon}</span>
                    <span className="text-[11px] font-semibold">{r.label}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Name (signup) */}
            {mode === 'signup' && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => upd('name', e.target.value)}
                  className={inputCls}
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
              <input
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => upd('email', e.target.value)}
                className={inputCls}
              />
            </div>

            {/* Phone (signup) */}
            {mode === 'signup' && (
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  onChange={(e) => upd('phone', e.target.value)}
                  className={inputCls}
                />
              </div>
            )}

            {/* Shop Name (shopkeeper signup) */}
            {mode === 'signup' && role === 'shopkeeper' && (
              <div className="relative">
                <Store className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                <input
                  type="text"
                  placeholder="Shop Name"
                  value={form.shopName}
                  onChange={(e) => upd('shopName', e.target.value)}
                  className={inputCls}
                />
              </div>
            )}

            {/* CEO Code (CEO signup) */}
            {mode === 'signup' && role === 'ceo' && (
              <div className="relative">
                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
                <input
                  type="text"
                  placeholder="CEO Authorization Code"
                  value={form.ceoCode}
                  onChange={(e) => upd('ceoCode', e.target.value)}
                  className={inputCls}
                />
                <p className="text-app-muted/60 text-xs mt-1 pl-1">Contact platform admin for the code</p>
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted" />
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password"
                value={form.password}
                onChange={(e) => upd('password', e.target.value)}
                className={`${inputCls} pr-12`}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-app-muted hover:text-app-text transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {/* Error / Success */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm">
                ✓ {success}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-app-primary hover:bg-app-primary/90 text-white font-bold py-3.5 rounded-xl transition-all shadow-glow-orange disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Test credentials hint */}
          {mode === 'login' && (
            <div className="mt-5 p-3 rounded-xl bg-white/3 border border-white/5">
              <p className="text-app-muted text-xs font-semibold mb-2 text-center">🧪 Test Credentials</p>
              <div className="space-y-1 text-xs text-app-muted/80">
                <div className="flex justify-between"><span>👑 CEO:</span><span>ceo@kacakhuh.pk / ceo123</span></div>
                <div className="flex justify-between"><span>🏪 Shop:</span><span>karachi@grill.pk / shop123</span></div>
                <div className="flex justify-between"><span>🛍️ Customer:</span><span>ali@gmail.com / pass123</span></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
