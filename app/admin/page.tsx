'use client'

import { useState } from 'react'
import { Plus, Store, Package, Edit2, Trash2, ChevronDown, ChevronUp, Flame } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { formatPrice } from '@/lib/utils'
import shopsData from '@/data/shops.json'
import productsData from '@/data/products.json'
import type { Shop, Product } from '@/lib/types'

type Tab = 'shops' | 'products'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('shops')
  const [shops, setShops] = useState<Shop[]>(shopsData as Shop[])
  const [products, setProducts] = useState<Product[]>(productsData as Product[])
  const [expandedShop, setExpandedShop] = useState<string | null>(null)
  const [showShopForm, setShowShopForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)

  const [shopForm, setShopForm] = useState<Partial<Shop>>({
    name: '', area: '', whatsapp: '', rating: 4.5,
    deliveryTime: '20–30 min', categories: [],
  })
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', description: '', price: 0, category: '', shopId: '',
  })

  const handleAddShop = () => {
    if (!shopForm.name || !shopForm.whatsapp) return
    const newShop: Shop = {
      id: shopForm.name.toLowerCase().replace(/\s+/g, '-'),
      name: shopForm.name!,
      area: shopForm.area ?? '',
      whatsapp: shopForm.whatsapp!,
      rating: shopForm.rating ?? 4.5,
      deliveryTime: shopForm.deliveryTime ?? '20–30 min',
      categories: shopForm.categories ?? [],
      bannerUrl: shopForm.bannerUrl,
      riderName: shopForm.riderName,
      riderPhone: shopForm.riderPhone,
    }
    setShops([...shops, newShop])
    setShopForm({ name: '', area: '', whatsapp: '', rating: 4.5, deliveryTime: '20–30 min', categories: [] })
    setShowShopForm(false)
  }

  const handleAddProduct = () => {
    if (!productForm.name || !productForm.shopId || !productForm.price) return
    const newProduct: Product = {
      id: `${productForm.shopId}-${Date.now()}`,
      shopId: productForm.shopId!,
      name: productForm.name!,
      description: productForm.description,
      price: productForm.price!,
      category: productForm.category ?? 'Other',
    }
    setProducts([...products, newProduct])
    setProductForm({ name: '', description: '', price: 0, category: '', shopId: '' })
    setShowProductForm(false)
  }

  const deleteShop = (id: string) => {
    setShops(shops.filter((s) => s.id !== id))
    setProducts(products.filter((p) => p.shopId !== id))
  }

  const deleteProduct = (id: string) => setProducts(products.filter((p) => p.id !== id))

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-white/10">
        <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-app-primary flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-700 text-app-text">Admin Panel</span>
              <span className="hidden sm:inline text-app-muted text-xs ml-2">Kacha Khuh</span>
            </div>
          </div>
          <Link
            href="/"
            className="text-xs text-app-muted hover:text-app-text transition-colors px-3 py-1.5 glass-light rounded-lg border border-white/10"
          >
            ← Back to App
          </Link>
        </div>
      </header>

      <main className="max-w-screen-md mx-auto px-4 py-6 pb-20">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass rounded-2xl p-4">
            <p className="text-app-muted text-xs font-medium">Total Shops</p>
            <p className="text-app-primary font-700 text-3xl mt-1">{shops.length}</p>
          </div>
          <div className="glass rounded-2xl p-4">
            <p className="text-app-muted text-xs font-medium">Total Products</p>
            <p className="text-app-secondary font-700 text-3xl mt-1">{products.length}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 glass rounded-2xl">
          {(['shops', 'products'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                tab === t
                  ? 'bg-app-primary text-white shadow-glow-orange'
                  : 'text-app-muted hover:text-app-text'
              }`}
            >
              {t === 'shops' ? <Store className="w-4 h-4" /> : <Package className="w-4 h-4" />}
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Shops tab */}
        {tab === 'shops' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-app-text font-semibold">Shops ({shops.length})</h2>
              <Button size="sm" onClick={() => setShowShopForm(!showShopForm)}>
                <Plus className="w-4 h-4" />
                Add Shop
              </Button>
            </div>

            {/* Add shop form */}
            {showShopForm && (
              <div className="glass rounded-2xl p-5 space-y-4 border border-app-primary/20">
                <h3 className="text-app-text font-semibold text-sm">New Shop</h3>
                <Input label="Shop Name *" placeholder="e.g. Lahori Chaska" value={shopForm.name} onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })} />
                <Input label="Area" placeholder="e.g. DHA Phase 5" value={shopForm.area} onChange={(e) => setShopForm({ ...shopForm, area: e.target.value })} />
                <Input label="WhatsApp Number *" placeholder="923001234567" value={shopForm.whatsapp} onChange={(e) => setShopForm({ ...shopForm, whatsapp: e.target.value })} />
                <Input label="Banner Image URL" placeholder="https://..." value={shopForm.bannerUrl} onChange={(e) => setShopForm({ ...shopForm, bannerUrl: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Rider Name" placeholder="Ahmed" value={shopForm.riderName} onChange={(e) => setShopForm({ ...shopForm, riderName: e.target.value })} />
                  <Input label="Rider Phone" placeholder="0300..." value={shopForm.riderPhone} onChange={(e) => setShopForm({ ...shopForm, riderPhone: e.target.value })} />
                </div>
                <Input label="Delivery Time" placeholder="20–30 min" value={shopForm.deliveryTime} onChange={(e) => setShopForm({ ...shopForm, deliveryTime: e.target.value })} />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={handleAddShop}>Save Shop</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowShopForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {/* Shop list */}
            {shops.map((shop) => {
              const shopProducts = products.filter((p) => p.shopId === shop.id)
              const isExpanded = expandedShop === shop.id
              return (
                <div key={shop.id} className="glass rounded-2xl overflow-hidden">
                  <div className="flex items-start justify-between p-4">
                    <div className="flex-1">
                      <p className="text-app-text font-semibold text-sm">{shop.name}</p>
                      <p className="text-app-muted text-xs mt-0.5">{shop.area} · ⭐ {shop.rating}</p>
                      <p className="text-app-muted text-xs">📞 +{shop.whatsapp}</p>
                      <p className="text-app-muted text-xs mt-1">
                        {shopProducts.length} products
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setExpandedShop(isExpanded ? null : shop.id)}
                        className="w-8 h-8 rounded-lg glass-light flex items-center justify-center text-app-muted hover:text-app-text transition-colors"
                      >
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => deleteShop(shop.id)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {isExpanded && shopProducts.length > 0 && (
                    <div className="border-t border-white/10 px-4 py-3 space-y-2">
                      <p className="text-app-muted text-xs font-medium mb-2">Products</p>
                      {shopProducts.map((p) => (
                        <div key={p.id} className="flex items-center justify-between">
                          <div>
                            <p className="text-app-text text-xs font-medium">{p.name}</p>
                            <p className="text-app-primary text-xs">{formatPrice(p.price)}</p>
                          </div>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Products tab */}
        {tab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-app-text font-semibold">Products ({products.length})</h2>
              <Button size="sm" onClick={() => setShowProductForm(!showProductForm)}>
                <Plus className="w-4 h-4" />
                Add Product
              </Button>
            </div>

            {/* Add product form */}
            {showProductForm && (
              <div className="glass rounded-2xl p-5 space-y-4 border border-app-primary/20">
                <h3 className="text-app-text font-semibold text-sm">New Product</h3>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-app-muted">Shop *</label>
                  <select
                    value={productForm.shopId}
                    onChange={(e) => setProductForm({ ...productForm, shopId: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-app-text text-sm focus:ring-2 focus:ring-app-primary/40 focus:border-app-primary/60 transition-all"
                  >
                    <option value="">Select a shop...</option>
                    {shops.map((s) => (
                      <option key={s.id} value={s.id} className="bg-app-surface">{s.name}</option>
                    ))}
                  </select>
                </div>
                <Input label="Product Name *" placeholder="e.g. Smash Burger" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} />
                <Textarea label="Description" placeholder="Short description..." rows={2} value={productForm.description} onChange={(e) => setProductForm({ ...productForm, description: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Price (PKR) *" type="number" placeholder="650" value={productForm.price || ''} onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })} />
                  <Input label="Category" placeholder="e.g. Burgers" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
                </div>
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={handleAddProduct}>Save Product</Button>
                  <Button variant="ghost" size="sm" onClick={() => setShowProductForm(false)}>Cancel</Button>
                </div>
              </div>
            )}

            {/* Products list grouped by shop */}
            {shops.map((shop) => {
              const shopProducts = products.filter((p) => p.shopId === shop.id)
              if (shopProducts.length === 0) return null
              return (
                <div key={shop.id}>
                  <h3 className="text-app-muted text-xs font-semibold uppercase tracking-wider mb-2">
                    {shop.name}
                  </h3>
                  <div className="glass rounded-2xl overflow-hidden">
                    {shopProducts.map((p, idx) => (
                      <div
                        key={p.id}
                        className={`flex items-start justify-between p-4 ${idx < shopProducts.length - 1 ? 'border-b border-white/5' : ''}`}
                      >
                        <div className="flex-1">
                          <p className="text-app-text text-sm font-semibold">{p.name}</p>
                          {p.description && (
                            <p className="text-app-muted text-xs mt-0.5 line-clamp-1">{p.description}</p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-app-primary text-sm font-700">{formatPrice(p.price)}</span>
                            <span className="text-app-muted/60 text-xs border border-white/10 px-2 py-0.5 rounded-full">{p.category}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-3">
                          <button className="w-8 h-8 rounded-lg glass-light flex items-center justify-center text-app-muted hover:text-app-text transition-colors">
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-400 hover:bg-red-500/20 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
