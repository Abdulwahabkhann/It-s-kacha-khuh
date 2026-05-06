'use client'

import { useState } from 'react'
import { MessageCircle, Phone, Mail, MapPin, Store, Crown, Send, ChevronDown } from 'lucide-react'
import { Navbar } from '@/components/Navbar'
import { BottomNav } from '@/components/BottomNav'
import { useAuthStore } from '@/lib/auth-store'
import shopsData from '@/data/shops.json'
import type { Shop } from '@/lib/types'
import Link from 'next/link'

const shops = shopsData as Shop[]

const CEO_CONTACT = {
  name: 'Abdul Wahab Khan',
  email: 'ceo@kacakhuh.pk',
  phone: '03001234567',
  whatsapp: '923001234567',
}

export default function ContactPage() {
  const { currentUser } = useAuthStore()
  const [selectedShop, setSelectedShop] = useState<string>('')
  const [form, setForm] = useState({ name: currentUser?.name ?? '', email: currentUser?.email ?? '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  const shop = shops.find((s) => s.id === selectedShop)

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-screen-md mx-auto w-full px-4 pb-28 pt-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-app-text">
            Contact <span className="text-app-primary">Us</span>
          </h1>
          <p className="text-app-muted text-sm mt-1">Reach out to shops or platform support</p>
        </div>

        {/* CEO / Platform Support Card */}
        <div className="glass rounded-2xl p-5 border border-yellow-400/20 mb-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center flex-shrink-0">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-app-text font-bold">Platform Support (CEO)</h2>
              <p className="text-app-muted text-xs">For app issues, complaints, or partnerships</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span className="text-app-text">{CEO_CONTACT.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-yellow-400 flex-shrink-0" />
              <span className="text-app-text">{CEO_CONTACT.phone}</span>
            </div>
          </div>
          <a
            href={`https://wa.me/${CEO_CONTACT.whatsapp}?text=Hi, I need help with Kacha Khuh app...`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500/10 text-green-400 border border-green-500/20 py-3 rounded-xl text-sm font-semibold hover:bg-green-500/20 transition-colors"
          >
            <MessageCircle className="w-4 h-4" /> WhatsApp Support
          </a>
        </div>

        {/* Contact Specific Shop */}
        <div className="glass rounded-2xl p-5 border border-app-primary/20 mb-5">
          <h2 className="text-app-text font-bold mb-1 flex items-center gap-2">
            <Store className="w-4 h-4 text-app-primary" /> Contact a Shop
          </h2>
          <p className="text-app-muted text-xs mb-4">For order issues, menu inquiries, or delivery problems</p>

          <div className="relative mb-4">
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-app-muted pointer-events-none" />
            <select
              value={selectedShop}
              onChange={(e) => setSelectedShop(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-app-text text-sm appearance-none focus:outline-none focus:border-app-primary/60 focus:ring-2 focus:ring-app-primary/20"
            >
              <option value="">Select a shop...</option>
              {shops.map((s) => (
                <option key={s.id} value={s.id} className="bg-app-surface">{s.name} — {s.area}</option>
              ))}
            </select>
          </div>

          {shop ? (
            <div className="space-y-3">
              <div className="bg-white/3 rounded-xl p-4">
                <p className="text-app-text font-semibold mb-2">{shop.name}</p>
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 text-xs">
                    <MapPin className="w-3.5 h-3.5 text-app-primary flex-shrink-0" />
                    <span className="text-app-muted">{shop.area}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="w-3.5 h-3.5 text-app-primary flex-shrink-0" />
                    <span className="text-app-muted">+{shop.whatsapp}</span>
                  </div>
                  {shop.riderName && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-app-muted ml-5">Rider: {shop.riderName} (+{shop.riderPhone})</span>
                    </div>
                  )}
                </div>
              </div>
              <a
                href={`https://wa.me/${shop.whatsapp}?text=Hi, I have a question about my order from ${shop.name}...`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500/10 text-green-400 border border-green-500/20 py-3 rounded-xl text-sm font-semibold hover:bg-green-500/20 transition-colors"
              >
                <MessageCircle className="w-4 h-4" /> WhatsApp {shop.name}
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3">
              {shops.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelectedShop(s.id)}
                  className="flex items-center gap-3 p-3 glass-light rounded-xl border border-white/5 hover:border-white/15 hover:bg-white/5 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-app-primary/10 flex items-center justify-center flex-shrink-0">
                    <Store className="w-4 h-4 text-app-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-app-text text-sm font-semibold">{s.name}</p>
                    <p className="text-app-muted text-xs">{s.area}</p>
                  </div>
                  <MessageCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* General feedback form */}
        <div className="glass rounded-2xl p-5 border border-white/10">
          <h2 className="text-app-text font-bold mb-1">Send Feedback</h2>
          <p className="text-app-muted text-xs mb-4">Tell us how we can improve the platform</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Your Name"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-app-text text-sm placeholder:text-app-muted/50 focus:outline-none focus:border-app-primary/60 transition-all"
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-app-text text-sm placeholder:text-app-muted/50 focus:outline-none focus:border-app-primary/60 transition-all"
              />
            </div>
            <input
              type="text"
              placeholder="Subject"
              value={form.subject}
              onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-app-text text-sm placeholder:text-app-muted/50 focus:outline-none focus:border-app-primary/60 transition-all"
            />
            <textarea
              placeholder="Your message..."
              value={form.message}
              onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-app-text text-sm placeholder:text-app-muted/50 focus:outline-none focus:border-app-primary/60 transition-all resize-none"
            />
            {sent ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-green-400 text-sm text-center">
                ✓ Feedback sent! We'll get back to you soon.
              </div>
            ) : (
              <button
                type="submit"
                className="w-full bg-app-primary text-white font-bold py-3 rounded-xl hover:bg-app-primary/90 transition-colors shadow-glow-orange flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Feedback
              </button>
            )}
          </form>
        </div>
      </main>

      <BottomNav />
    </div>
  )
}
