'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  User, ShoppingBag, Heart, Star, Clock, TrendingUp, Calendar,
  LogOut, Settings, ChevronRight, Gift, Lock
} from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { useAuthStore } from '@/lib/auth-store'
import { useAppStore } from '@/lib/app-store'
import Link from 'next/link'

export default function ProfilePage() {
  const router = useRouter()
  const { currentUser, logout } = useAuthStore()
  const { orders, savedShops } = useAppStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'history' | 'rewards'>('overview')

  const myOrders = currentUser ? orders.filter((o) => o.customerId === currentUser.id) : []
  const totalSpent = myOrders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)

  const now = new Date()
  const dayAgo = new Date(now.getTime() - 86400000)
  const weekAgo = new Date(now.getTime() - 7 * 86400000)
  const monthAgo = new Date(now.getTime() - 30 * 86400000)

  const dailyOrders = myOrders.filter((o) => new Date(o.createdAt) >= dayAgo).length
  const weeklyOrders = myOrders.filter((o) => new Date(o.createdAt) >= weekAgo).length
  const monthlyOrders = myOrders.filter((o) => new Date(o.createdAt) >= monthAgo).length

  const handleLogout = () => { logout(); router.replace('/') }

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-screen-md mx-auto w-full px-4 pb-28 pt-12 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 rounded-3xl bg-app-primary/10 border border-app-primary/20 flex items-center justify-center mb-6">
            <User className="w-10 h-10 text-app-primary opacity-60" />
          </div>
          <h1 className="text-xl font-bold text-app-text mb-2">Sign In to Your Account</h1>
          <p className="text-app-muted text-sm mb-8">Create an account or sign in to track orders, save shops, and earn rewards.</p>
          <Link
            href="/auth"
            className="w-full max-w-xs bg-app-primary text-white font-bold py-3.5 rounded-xl text-center block shadow-glow-orange hover:bg-app-primary/90 transition-colors"
          >
            Sign In / Sign Up
          </Link>
        </main>
        <BottomNav />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-screen-md mx-auto w-full px-4 pb-28 pt-6">
        {/* Profile Header */}
        <div className="glass rounded-3xl p-5 mb-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-app-primary to-orange-400 flex items-center justify-center text-2xl font-bold text-white flex-shrink-0 shadow-glow-orange">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-app-text font-bold text-lg leading-none">{currentUser.name}</h1>
            <p className="text-app-muted text-xs mt-1">{currentUser.email}</p>
            {currentUser.phone && <p className="text-app-muted text-xs">{currentUser.phone}</p>}
            <span className="inline-block mt-1.5 text-xs px-2.5 py-0.5 rounded-full bg-app-primary/10 text-app-primary border border-app-primary/20 font-medium capitalize">
              {currentUser.role}
            </span>
          </div>
          <button onClick={handleLogout} className="text-app-muted hover:text-red-400 transition-colors">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass rounded-2xl mb-6">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'history', label: 'Order History' },
            { id: 'rewards', label: 'Rewards' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === id ? 'bg-app-primary text-white shadow-glow-orange' : 'text-app-muted hover:text-app-text'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Orders', value: myOrders.length, icon: '🛍️' },
                { label: 'Saved Shops', value: savedShops.length, icon: '❤️' },
                { label: 'Total Spent', value: `${(totalSpent / 1000).toFixed(1)}K`, icon: '💰' },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-3 text-center">
                  <span className="text-xl">{s.icon}</span>
                  <p className="text-app-text font-bold text-lg mt-1">{s.value}</p>
                  <p className="text-app-muted text-[10px] mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Order frequency */}
            <div className="glass rounded-2xl p-4">
              <h3 className="text-app-text font-semibold text-sm mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-app-primary" /> Order Frequency
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Today', value: dailyOrders, max: 5 },
                  { label: 'This Week', value: weeklyOrders, max: 20 },
                  { label: 'This Month', value: monthlyOrders, max: 50 },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-app-muted">{s.label}</span>
                      <span className="text-app-text font-semibold">{s.value} orders</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-app-primary to-orange-400 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min((s.value / s.max) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div className="glass rounded-2xl overflow-hidden">
              {[
                { label: 'Order History', icon: Clock, href: null, onClick: () => setActiveTab('history') },
                { label: 'Saved Shops', icon: Heart, href: '/favorites', onClick: undefined },
                { label: 'Contact Shop', icon: ShoppingBag, href: '/', onClick: undefined },
              ].map(({ label, icon: Icon, href, onClick }) => (
                <button
                  key={label}
                  onClick={onClick ?? (() => href && router.push(href))}
                  className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                >
                  <Icon className="w-4 h-4 text-app-primary" />
                  <span className="text-app-text text-sm flex-1 text-left">{label}</span>
                  <ChevronRight className="w-4 h-4 text-app-muted" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === 'history' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-app-text font-semibold">Order History</h2>
              <span className="text-app-muted text-xs">{myOrders.length} orders</span>
            </div>
            {myOrders.length === 0 ? (
              <div className="glass rounded-2xl p-12 text-center">
                <ShoppingBag className="w-12 h-12 text-app-muted mx-auto mb-3 opacity-30" />
                <p className="text-app-muted">No orders yet</p>
                <Link href="/" className="inline-block mt-4 px-5 py-2.5 bg-app-primary/10 text-app-primary text-sm font-semibold rounded-xl border border-app-primary/20">
                  Browse Shops
                </Link>
              </div>
            ) : (
              [...myOrders].reverse().map((order) => (
                <div key={order.id} className="glass rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-app-text font-semibold text-sm">{order.shopName}</p>
                      <p className="text-app-muted text-xs mt-0.5">
                        {order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                      order.status === 'delivered' ? 'bg-green-500/15 text-green-400 border border-green-500/20' :
                      order.status === 'confirmed' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                      'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20'
                    }`}>{order.status}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-app-muted/50 text-[10px]">{new Date(order.createdAt).toLocaleDateString('en-PK')}</p>
                    <p className="text-app-primary font-bold text-sm">PKR {order.total.toLocaleString()}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Rewards Tab - Coming Soon */}
        {activeTab === 'rewards' && (
          <div className="space-y-4">
            {/* Coming Soon Banner */}
            <div className="relative overflow-hidden glass rounded-3xl p-6 border border-yellow-400/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 rounded-full -translate-y-8 translate-x-8" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center">
                    <Gift className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-app-text font-bold text-lg">Loyalty Rewards</h2>
                      <span className="text-xs bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 px-2.5 py-0.5 rounded-full font-semibold">
                        Coming Soon
                      </span>
                    </div>
                    <p className="text-app-muted text-xs">Earn points on every order</p>
                  </div>
                </div>
                <p className="text-app-muted text-sm mb-4">
                  We're building an exciting rewards program! Your order history is being tracked and you'll be rewarded based on your loyalty.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { emoji: '🎁', title: 'Free Items', desc: 'Earn after 10 orders' },
                    { emoji: '💯', title: 'Discounts', desc: 'Up to 30% off' },
                    { emoji: '👑', title: 'VIP Status', desc: 'Priority ordering' },
                    { emoji: '🎉', title: 'Special Offers', desc: 'Exclusive deals' },
                  ].map((item) => (
                    <div key={item.title} className="bg-white/3 rounded-xl p-3 border border-white/5 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Lock className="w-6 h-6 text-white/5" />
                      </div>
                      <span className="text-2xl">{item.emoji}</span>
                      <p className="text-app-text text-xs font-semibold mt-1">{item.title}</p>
                      <p className="text-app-muted text-[10px]">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Current Points & Tier */}
            <div className="glass rounded-2xl p-5 relative">
              <div className="absolute top-4 right-4 group cursor-help">
                <div className="w-5 h-5 rounded-full bg-app-primary/20 text-app-primary border border-app-primary/40 flex items-center justify-center text-xs font-bold font-serif">i</div>
                <div className="absolute top-full mt-2 right-0 w-64 p-3 bg-black/90 border border-white/10 rounded-xl shadow-xl text-xs text-app-muted opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 pointer-events-none">
                  Note: This reward system or discount is paid directly by the CEO, not the Shopkeeper.
                </div>
              </div>

              <h3 className="text-app-text font-semibold mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400" /> Your Current Status
              </h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 text-6xl opacity-10">✨</div>
                  <p className="text-app-muted text-xs mb-1">Total Points</p>
                  <p className="text-3xl font-bold text-app-primary drop-shadow-md">
                    {Math.floor((totalSpent / 10) * 2.7).toLocaleString()}
                  </p>
                  <p className="text-[10px] text-app-muted/60 mt-1">2.7 pts per 10 PKR</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center relative overflow-hidden">
                  <div className="absolute -right-4 -bottom-4 text-6xl opacity-10">👑</div>
                  <p className="text-app-muted text-xs mb-1">Current Tier</p>
                  <p className="text-xl font-bold text-yellow-400 drop-shadow-md mt-1">
                    {totalSpent >= 100000 ? 'Tier 3 (VIP)' : totalSpent >= 25000 ? 'Tier 2 (Gold)' : totalSpent >= 10000 ? 'Tier 1 (Silver)' : 'Starter'}
                  </p>
                  <p className="text-[10px] text-app-muted/60 mt-2">
                    {totalSpent >= 100000 ? 'Max Tier Reached' : `Spent: ${(totalSpent / 1000).toFixed(1)}k PKR`}
                  </p>
                </div>
              </div>

              {/* Tier Progress */}
              <div className="space-y-4">
                <p className="text-xs font-semibold text-app-text mb-2">Tier Progress based on spending:</p>
                {[
                  { label: 'Tier 1 (10k PKR)', min: 10000, max: 25000 },
                  { label: 'Tier 2 (25k PKR)', min: 25000, max: 100000 },
                  { label: 'Tier 3 (100k PKR)', min: 100000, max: 100000 },
                ].map((tier, idx) => {
                  const isAchieved = totalSpent >= tier.min;
                  const progress = isAchieved ? 100 : Math.max(0, Math.min(100, (totalSpent / tier.min) * 100));
                  
                  return (
                    <div key={tier.label} className={isAchieved ? 'opacity-100' : 'opacity-50'}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className={`font-semibold ${isAchieved ? 'text-app-primary' : 'text-app-muted'}`}>
                          {tier.label}
                        </span>
                        <span className="text-app-muted">{isAchieved ? 'Achieved ✓' : `${progress.toFixed(0)}%`}</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-app-primary to-yellow-400 rounded-full transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div className="mt-5 p-3 rounded-xl bg-app-primary/5 border border-app-primary/10 text-center">
                <p className="text-app-muted text-xs leading-relaxed">
                  🌟 Your points are already being calculated. Hold tight! They will be redeemable as soon as the feature launches.
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  )
}
