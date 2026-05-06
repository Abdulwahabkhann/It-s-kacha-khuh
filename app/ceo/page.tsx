'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Crown, TrendingUp, Store, ShoppingBag, Users, Star, Phone, User,
  BarChart2, Award, LogOut, MessageCircle,
  Flame, Mail, Clock
} from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'
import { useAppStore } from '@/lib/app-store'
import shopsData from '@/data/shops.json'
import type { Shop } from '@/lib/types'
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid } from 'recharts'

const shops = shopsData as Shop[]

export default function CeoDashboard() {
  const router = useRouter()
  const { currentUser, logout } = useAuthStore()
  const { orders, shopRankings, setShopRank, getShopStats, customShops } = useAppStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'rankings' | 'orders' | 'contact'>('overview')
  const [rankInput, setRankInput] = useState<Record<string, string>>({})

  // Date Filtering State
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0],
  })

  useEffect(() => {
    const u = useAuthStore.getState().currentUser
    if (!u) router.replace('/auth')
    else if (u.role !== 'ceo') router.replace('/')
  }, [router])

  if (!currentUser || currentUser.role !== 'ceo') return null

  const handleLogout = () => { logout(); router.replace('/auth') }

  const allShops = [...shops, ...customShops]

  // Filter orders based on dateRange
  const filteredOrders = orders.filter((o) => {
    if (o.status === 'cancelled') return false
    const oDate = new Date(o.createdAt).toISOString().split('T')[0]
    return oDate >= dateRange.start && oDate <= dateRange.end
  })

  // Generate chart data grouping revenue by date
  const chartDataMap = filteredOrders.reduce((acc, o) => {
    const date = new Date(o.createdAt).toLocaleDateString('en-PK', { month: 'short', day: 'numeric' })
    acc[date] = (acc[date] || 0) + o.total
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(chartDataMap).map(([date, revenue]) => ({ date, revenue }))

  const shopStats = allShops.map((shop) => {
    const stats = getShopStats(shop.id)
    const rank = shopRankings[shop.id] ?? 99
    return { ...shop, stats, rank }
  }).sort((a, b) => {
    // Sort by CEO rank first, then by total orders
    const rankA = shopRankings[a.id] ?? 99
    const rankB = shopRankings[b.id] ?? 99
    if (rankA !== rankB) return rankA - rankB
    return b.stats.total - a.stats.total
  })

  const totalOrders = filteredOrders.length
  const totalRevenue = filteredOrders.reduce((s, o) => s + o.total, 0)
  const totalCustomers = Array.from(new Set(filteredOrders.map(o => o.customerId))).length
  const activeShops = allShops.length

  const MEDAL = ['🥇', '🥈', '🥉']

  const statCards = [
    { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'from-orange-500 to-orange-600' },
    { label: 'Revenue (PKR)', value: `${(totalRevenue / 1000).toFixed(1)}K`, icon: TrendingUp, color: 'from-green-500 to-green-600' },
    { label: 'Active Shops', value: activeShops, icon: Store, color: 'from-blue-500 to-blue-600' },
    { label: 'Customers', value: totalCustomers, icon: Users, color: 'from-purple-500 to-purple-600' },
  ]

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-white/10">
        <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-glow-orange">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-app-muted font-medium">CEO Dashboard</p>
              <p className="text-sm font-bold text-app-text leading-none">{currentUser.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-app-muted hover:text-red-400 transition-colors glass-light px-3 py-2 rounded-xl border border-white/10"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout
          </button>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto px-4 py-6 pb-28">
        {/* Welcome */}
        <div className="mb-6">
          <p className="text-app-muted text-sm">Welcome back, CEO 👋</p>
          <h1 className="text-2xl font-bold text-app-text mt-0.5">
            Platform <span className="text-app-primary">Overview</span>
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 glass rounded-2xl mb-6 overflow-x-auto scroll-x">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart2 },
            { id: 'rankings', label: 'Rankings', icon: Award },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'contact', label: 'Contact', icon: Mail },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as typeof activeTab)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === id ? 'bg-app-primary text-white shadow-glow-orange' : 'text-app-muted hover:text-app-text'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* Date Filters */}
            <div className="glass rounded-2xl p-4 border border-white/5 flex flex-wrap items-center gap-4 justify-between">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-app-primary" />
                <h2 className="text-app-text font-semibold">Analytics Dashboard</h2>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange((p) => ({ ...p, start: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-app-text text-xs focus:outline-none focus:border-app-primary/60"
                />
                <span className="text-app-muted text-xs">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange((p) => ({ ...p, end: e.target.value }))}
                  className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-app-text text-xs focus:outline-none focus:border-app-primary/60"
                />
              </div>
            </div>

            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              {statCards.map((card) => (
                <div key={card.label} className="glass rounded-2xl p-4">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                    <card.icon className="w-4.5 h-4.5 text-white w-5 h-5" />
                  </div>
                  <p className="text-app-muted text-xs font-medium">{card.label}</p>
                  <p className="text-app-text font-bold text-2xl mt-0.5">{card.value}</p>
                </div>
              ))}
            </div>

            {/* Revenue Chart */}
            <div className="glass rounded-2xl p-5 border border-white/5">
              <h2 className="text-app-text font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-400" /> Revenue Trend
              </h2>
              {chartData.length > 0 ? (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#ff6b00" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                      <XAxis 
                        dataKey="date" 
                        stroke="rgba(255,255,255,0.4)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        dy={10}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.4)" 
                        fontSize={10} 
                        tickLine={false} 
                        axisLine={false}
                        tickFormatter={(value) => `₨${value / 1000}k`}
                        dx={-10}
                      />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1a1a1a', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}
                        itemStyle={{ color: '#ff6b00', fontWeight: 'bold' }}
                        formatter={(value: any) => [`PKR ${Number(value).toLocaleString()}`, 'Revenue']}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#ff6b00" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-40 flex items-center justify-center text-app-muted text-sm border border-dashed border-white/10 rounded-xl">
                  No orders in the selected date range.
                </div>
              )}
            </div>

            {/* Top Performers */}
            <div>
              <h2 className="text-app-text font-semibold mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" /> Top Performers
              </h2>
              <div className="space-y-3">
                {shopStats.slice(0, 3).map((shop, idx) => (
                  <div key={shop.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <span className="text-2xl">{MEDAL[idx] || '🏅'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-app-text font-semibold text-sm">{shop.name}</p>
                      <p className="text-app-muted text-xs">{shop.area}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-app-primary font-bold text-sm">{shop.stats.total} orders</p>
                      <p className="text-app-muted text-xs">PKR {(shop.stats.revenue / 1000).toFixed(1)}K</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div>
              <h2 className="text-app-text font-semibold mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4 text-app-primary" /> Recent Orders
              </h2>
              <div className="space-y-2">
                {[...orders].reverse().slice(0, 5).map((order) => (
                  <div key={order.id} className="glass rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-app-text text-sm font-medium">{order.customerName}</p>
                      <p className="text-app-muted text-xs">{order.shopName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-app-primary text-sm font-bold">PKR {order.total.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        order.status === 'delivered' ? 'bg-green-500/10 text-green-400' :
                        order.status === 'confirmed' ? 'bg-blue-500/10 text-blue-400' :
                        order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-400' :
                        'bg-red-500/10 text-red-400'
                      }`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rankings Tab */}
        {activeTab === 'rankings' && (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-4 border border-yellow-400/20">
              <h2 className="text-app-text font-semibold flex items-center gap-2 mb-1">
                <Crown className="w-4 h-4 text-yellow-400" /> Shop Rankings Control
              </h2>
              <p className="text-app-muted text-xs">Set rank numbers to promote shops on the home page. Lower rank = higher on list.</p>
            </div>

            {shopStats.map((shop, idx) => {
              const stats = shop.stats
              return (
                <div key={shop.id} className="glass rounded-2xl p-4 border border-white/5">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-app-primary/20 to-app-primary/5 border border-app-primary/20 flex items-center justify-center">
                      <span className="text-lg">{MEDAL[idx] || '🏅'}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-app-text font-semibold text-sm">{shop.name}</p>
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="1"
                            max="99"
                            placeholder={String(shopRankings[shop.id] ?? idx + 1)}
                            value={rankInput[shop.id] ?? ''}
                            onChange={(e) => setRankInput((p) => ({ ...p, [shop.id]: e.target.value }))}
                            className="w-14 bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 text-app-text text-xs text-center focus:outline-none focus:border-app-primary/60"
                          />
                          <button
                            onClick={() => {
                              const v = parseInt(rankInput[shop.id] || '')
                              if (!isNaN(v) && v > 0) {
                                setShopRank(shop.id, v)
                                setRankInput((p) => ({ ...p, [shop.id]: '' }))
                              }
                            }}
                            className="text-xs bg-app-primary/10 text-app-primary border border-app-primary/20 px-2 py-1.5 rounded-lg hover:bg-app-primary/20 transition-colors font-semibold"
                          >
                            Set
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <div className="bg-white/3 rounded-lg p-2 text-center">
                          <p className="text-app-primary font-bold text-sm">{stats.daily}</p>
                          <p className="text-app-muted text-[10px]">Today</p>
                        </div>
                        <div className="bg-white/3 rounded-lg p-2 text-center">
                          <p className="text-app-primary font-bold text-sm">{stats.weekly}</p>
                          <p className="text-app-muted text-[10px]">This Week</p>
                        </div>
                        <div className="bg-white/3 rounded-lg p-2 text-center">
                          <p className="text-app-primary font-bold text-sm">{stats.total}</p>
                          <p className="text-app-muted text-[10px]">All Time</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                          <span className="text-app-muted text-xs">{shop.rating}</span>
                        </div>
                        <span className="text-green-400 text-xs font-semibold">
                          PKR {stats.revenue.toLocaleString()} total
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-app-text font-semibold">All Orders ({orders.length})</h2>
              <span className="text-app-muted text-xs">{totalOrders} completed</span>
            </div>
            {[...orders].reverse().map((order) => (
              <div key={order.id} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-app-text font-semibold text-sm">{order.customerName}</p>
                    <p className="text-app-muted text-xs">{order.customerPhone}</p>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                    order.status === 'delivered' ? 'bg-green-500/15 text-green-400 border border-green-500/20' :
                    order.status === 'confirmed' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                    order.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/20' :
                    'bg-red-500/15 text-red-400 border border-red-500/20'
                  }`}>{order.status}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-app-muted text-xs">📍 {order.shopName}</p>
                    <p className="text-app-muted text-xs mt-0.5">
                      {order.items.map(i => `${i.name} ×${i.qty}`).join(', ')}
                    </p>
                  </div>
                  <p className="text-app-primary font-bold text-sm">PKR {order.total.toLocaleString()}</p>
                </div>
                <p className="text-app-muted/50 text-[10px] mt-2">
                  {new Date(order.createdAt).toLocaleString('en-PK')}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="space-y-4">
            <div className="glass rounded-2xl p-5 border border-app-primary/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-app-text font-bold">CEO Contact Info</h2>
                  <p className="text-app-muted text-xs">Your contact details visible to shopkeepers</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-3 bg-white/3 rounded-xl p-3">
                  <User className="w-4 h-4 text-app-primary flex-shrink-0" />
                  <div>
                    <p className="text-app-muted text-xs">Name</p>
                    <p className="text-app-text text-sm font-semibold">{currentUser.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-white/3 rounded-xl p-3">
                  <Mail className="w-4 h-4 text-app-primary flex-shrink-0" />
                  <div>
                    <p className="text-app-muted text-xs">Email</p>
                    <p className="text-app-text text-sm font-semibold">{currentUser.email}</p>
                  </div>
                </div>
                {currentUser.phone && (
                  <div className="flex items-center gap-3 bg-white/3 rounded-xl p-3">
                    <Phone className="w-4 h-4 text-app-primary flex-shrink-0" />
                    <div>
                      <p className="text-app-muted text-xs">Phone / WhatsApp</p>
                      <p className="text-app-text text-sm font-semibold">{currentUser.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Shopkeeper contacts */}
            <h3 className="text-app-text font-semibold mt-2 flex items-center gap-2">
              <Store className="w-4 h-4 text-app-primary" /> Shopkeeper Contacts
            </h3>
            {shops.map((shop) => (
              <div key={shop.id} className="glass rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-app-primary/10 border border-app-primary/20 flex items-center justify-center">
                    <Store className="w-5 h-5 text-app-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-app-text font-semibold text-sm">{shop.name}</p>
                    <p className="text-app-muted text-xs">{shop.area}</p>
                    <p className="text-app-muted text-xs mt-0.5">📞 +{shop.whatsapp}</p>
                  </div>
                  <a
                    href={`https://wa.me/${shop.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-2 rounded-xl text-xs font-semibold hover:bg-green-500/20 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}


