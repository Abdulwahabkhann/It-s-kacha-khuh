'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  Store, ShoppingBag, TrendingUp, Star, Phone, LogOut,
  Plus, Edit2, Trash2, Clock, MessageCircle, BarChart2,
  Package, Settings, Image as ImageIcon, Video, X
} from 'lucide-react'
import { useAuthStore } from '@/lib/auth-store'
import { useAppStore, ShopProduct, ShopOverride } from '@/lib/app-store'
import shopsData from '@/data/shops.json'
import type { Shop } from '@/lib/types'

const allShops = shopsData as Shop[]

export default function ShopDashboard() {
  const router = useRouter()
  const { currentUser, logout } = useAuthStore()
  const {
    getShopStats, getOrdersByShop, shopProducts, addShopProduct,
    updateShopProduct, deleteShopProduct, toggleProductAvailability,
    getShopOverride, updateShopOverride
  } = useAppStore()

  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'settings'>('overview')
  const [isEditingProduct, setIsEditingProduct] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Product Form State
  const [productForm, setProductForm] = useState({
    name: '', price: '', category: 'General', description: '', quantity: '',
    mediaUrl: '', mediaType: ''
  })
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    riderName: '', riderPhone: '', deliveryTime: '', bannerUrl: ''
  })
  const settingsInputRef = useRef<HTMLInputElement>(null)
  const [isSettingsUploading, setIsSettingsUploading] = useState(false)

  const shopId = currentUser?.shopId || ''
  const baseShop = allShops.find((s) => s.id === shopId)
  const override = getShopOverride(shopId)
  const shopName = baseShop?.name || 'My Shop'
  
  const stats = getShopStats(shopId)
  const myOrders = getOrdersByShop(shopId)
  const myProducts = shopProducts.filter(p => p.shopId === shopId)

  // Authentication Check
  useEffect(() => {
    const u = useAuthStore.getState().currentUser
    if (!u) router.replace('/auth')
    else if (u.role !== 'shopkeeper') router.replace('/')
  }, [router])

  // Settings Load Effect
  useEffect(() => {
    if (activeTab === 'settings') {
      setSettingsForm({
        riderName: override?.riderName || baseShop?.riderName || '',
        riderPhone: override?.riderPhone || baseShop?.riderPhone || '',
        deliveryTime: override?.deliveryTime || baseShop?.deliveryTime || '',
        bannerUrl: override?.bannerUrl || baseShop?.bannerUrl || ''
      })
    }
  }, [activeTab, override, baseShop])

  const handleLogout = () => { logout(); router.replace('/auth') }

  // ── Media Upload Handler ──────────────────────────────────────────────
  const handleFileUpload = async (file: File, isBanner: boolean = false) => {
    const formData = new FormData()
    formData.append('file', file)
    
    if (isBanner) setIsSettingsUploading(true)
    else setIsUploading(true)

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      
      if (res.ok) {
        if (isBanner) {
          setSettingsForm(prev => ({ ...prev, bannerUrl: data.url }))
        } else {
          setProductForm(prev => ({ 
            ...prev, 
            mediaUrl: data.url, 
            mediaType: data.type.startsWith('video') ? 'video' : 'image' 
          }))
        }
      } else {
        alert(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setIsUploading(false)
      setIsSettingsUploading(false)
    }
  }

  // ── Product Management ────────────────────────────────────────────────
  const openProductForm = (product?: ShopProduct) => {
    if (product) {
      setEditingId(product.id)
      setProductForm({
        name: product.name,
        price: String(product.price),
        category: product.category,
        description: product.description || '',
        quantity: product.quantity !== undefined ? String(product.quantity) : '',
        mediaUrl: product.mediaUrl || '',
        mediaType: product.mediaType || ''
      })
    } else {
      setEditingId(null)
      setProductForm({ name: '', price: '', category: 'General', description: '', quantity: '', mediaUrl: '', mediaType: '' })
    }
    setIsEditingProduct(true)
  }

  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productForm.name || !productForm.price) return

    const productData = {
      shopId,
      name: productForm.name,
      price: Number(productForm.price),
      category: productForm.category,
      description: productForm.description,
      quantity: productForm.quantity ? Number(productForm.quantity) : undefined,
      mediaUrl: productForm.mediaUrl,
      mediaType: productForm.mediaType,
      isAvailable: true
    }

    if (editingId) {
      updateShopProduct(editingId, productData)
    } else {
      addShopProduct(productData)
    }
    setIsEditingProduct(false)
  }

  // ── Settings Management ───────────────────────────────────────────────
  const saveSettings = (e: React.FormEvent) => {
    e.preventDefault()
    updateShopOverride(shopId, settingsForm)
    alert('Shop settings saved successfully!')
  }

  if (!currentUser || currentUser.role !== 'shopkeeper') return null

  // ──────────────────────────────────────────────────────────────────────


  return (
    <div className="min-h-screen pb-28">
      {/* Header */}
      <header className="sticky top-0 z-30 glass border-b border-white/10">
        <div className="max-w-screen-md mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-app-primary to-orange-500 flex items-center justify-center shadow-glow-orange">
              <Store className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-app-muted font-medium">Shop Dashboard</p>
              <p className="text-sm font-bold text-app-text leading-none">{shopName}</p>
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

      <main className="max-w-screen-md mx-auto px-4 py-6">
        {/* Navigation Tabs */}
        <div className="flex gap-1 p-1 glass rounded-2xl mb-6 overflow-x-auto scroll-x">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart2 },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'settings', label: 'Settings', icon: Settings },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === id ? 'bg-app-primary text-white shadow-glow-orange' : 'text-app-muted hover:text-app-text'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </button>
          ))}
        </div>

        {/* ── Overview Tab ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Today\'s Orders', value: stats.daily, icon: Clock, color: 'from-blue-500 to-blue-600' },
                { label: 'Weekly Orders', value: stats.weekly, icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
                { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'from-orange-500 to-orange-600' },
                { label: 'Total Revenue', value: `${(stats.revenue / 1000).toFixed(1)}K`, icon: Star, color: 'from-green-500 to-green-600' },
              ].map((card) => (
                <div key={card.label} className="glass rounded-2xl p-4">
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3`}>
                    <card.icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-app-muted text-xs font-medium">{card.label}</p>
                  <p className="text-app-text font-bold text-2xl mt-0.5">{card.value}</p>
                </div>
              ))}
            </div>

            <div className="glass rounded-2xl p-5 border border-yellow-400/20">
              <h2 className="text-app-text font-bold flex items-center gap-2 mb-2">
                <MessageCircle className="w-5 h-5 text-yellow-400" /> Platform Communication
              </h2>
              <p className="text-app-muted text-sm mb-4">Need help or want to boost your ranking? Contact the CEO directly.</p>
              <a
                href="https://wa.me/923001234567?text=Hi CEO, I am the manager of..."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500/10 text-green-400 border border-green-500/20 py-3 rounded-xl text-sm font-semibold hover:bg-green-500/20 transition-colors"
              >
                <Phone className="w-4 h-4" /> Message CEO
              </a>
            </div>
          </div>
        )}

        {/* ── Products Tab ── */}
        {activeTab === 'products' && !isEditingProduct && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-app-text font-bold text-lg">My Products</h2>
                <p className="text-app-muted text-xs">{myProducts.length} custom products added</p>
              </div>
              <button
                onClick={() => openProductForm()}
                className="bg-app-primary text-white flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold shadow-glow-orange hover:bg-app-primary/90 transition-colors"
              >
                <Plus className="w-4 h-4" /> Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {myProducts.length === 0 ? (
                <div className="col-span-full glass rounded-2xl p-10 flex flex-col items-center justify-center text-center">
                  <Package className="w-12 h-12 text-app-muted/40 mb-3" />
                  <p className="text-app-text font-semibold">No products added yet</p>
                  <p className="text-app-muted text-xs mt-1">Add products with photos/videos to attract more customers!</p>
                </div>
              ) : (
                myProducts.map((product) => (
                  <div key={product.id} className="glass rounded-2xl overflow-hidden flex flex-col">
                    {/* Media Preview */}
                    {product.mediaUrl && (
                      <div className="w-full aspect-video bg-black/40 relative">
                        {product.mediaType === 'video' ? (
                          <video src={product.mediaUrl} className="w-full h-full object-cover" muted loop playsInline />
                        ) : (
                          <img src={product.mediaUrl} alt={product.name} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md rounded-lg px-2 py-1 flex items-center gap-1">
                          {product.mediaType === 'video' ? <Video className="w-3 h-3 text-white" /> : <ImageIcon className="w-3 h-3 text-white" />}
                        </div>
                      </div>
                    )}

                    <div className="p-4 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-app-text font-semibold text-base">{product.name}</h3>
                          <span className="text-[10px] bg-app-primary/10 text-app-primary px-2 py-0.5 rounded-full mt-1 inline-block">
                            {product.category}
                          </span>
                        </div>
                        <p className="text-app-primary font-bold">PKR {product.price}</p>
                      </div>
                      
                      {product.description && <p className="text-app-muted text-xs mb-3 line-clamp-2">{product.description}</p>}
                      
                      <div className="mt-auto flex items-center justify-between pt-3 border-t border-white/5">
                        <div className="flex flex-col">
                          <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-10 h-5 rounded-full transition-colors relative ${product.isAvailable ? 'bg-app-primary' : 'bg-white/10'}`}>
                              <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${product.isAvailable ? 'translate-x-5' : 'translate-x-0'}`} />
                            </div>
                            <span className={`text-xs font-semibold ${product.isAvailable ? 'text-app-text' : 'text-app-muted'}`}>
                              {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                            </span>
                            <input type="checkbox" className="hidden" checked={product.isAvailable} onChange={() => toggleProductAvailability(product.id)} />
                          </label>
                          {product.quantity !== undefined && (
                            <span className="text-[10px] text-app-muted mt-1 ml-12">Qty: {product.quantity}</span>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => openProductForm(product)} className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/15 transition-colors">
                            <Edit2 className="w-4 h-4 text-app-text" />
                          </button>
                          <button onClick={() => { if(confirm('Delete product?')) deleteShopProduct(product.id) }} className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center hover:bg-red-500/20 transition-colors">
                            <Trash2 className="w-4 h-4 text-red-400" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── Add/Edit Product Modal ── */}
        {activeTab === 'products' && isEditingProduct && (
          <div className="glass rounded-2xl p-5 border border-app-primary/20">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-app-text font-bold">{editingId ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setIsEditingProduct(false)} className="text-app-muted hover:text-app-text">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={saveProduct} className="space-y-4">
              {/* Media Upload Area */}
              <div>
                <label className="block text-app-muted text-xs font-medium mb-1.5">Product Media (Photo/Video) <span className="text-app-primary text-[10px] ml-1">Unlimited size & format</span></label>
                
                {productForm.mediaUrl ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/40 border border-white/10 group">
                    {productForm.mediaType === 'video' ? (
                      <video src={productForm.mediaUrl} className="w-full h-full object-cover" controls />
                    ) : (
                      <img src={productForm.mediaUrl} alt="Preview" className="w-full h-full object-contain" />
                    )}
                    <button 
                      type="button"
                      onClick={() => setProductForm(p => ({ ...p, mediaUrl: '', mediaType: '' }))}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full aspect-[21/9] rounded-xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/5 hover:border-app-primary/50 transition-colors"
                  >
                    {isUploading ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-6 h-6 border-2 border-app-primary border-t-transparent rounded-full animate-spin" />
                        <span className="text-xs text-app-muted">Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex gap-3 text-app-muted">
                          <ImageIcon className="w-6 h-6" />
                          <Video className="w-6 h-6" />
                        </div>
                        <span className="text-xs text-app-muted">Tap to upload photo or video</span>
                      </>
                    )}
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], false)}
                  accept="image/*,video/*" 
                  className="hidden" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-app-muted text-xs font-medium mb-1.5">Product Name *</label>
                  <input required type="text" value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-app-text text-sm focus:border-app-primary/60 outline-none" placeholder="e.g. Zinger Burger" />
                </div>
                <div>
                  <label className="block text-app-muted text-xs font-medium mb-1.5">Price (PKR) *</label>
                  <input required type="number" value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-app-text text-sm focus:border-app-primary/60 outline-none" placeholder="e.g. 500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-app-muted text-xs font-medium mb-1.5">Category *</label>
                  <input required type="text" value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-app-text text-sm focus:border-app-primary/60 outline-none" placeholder="e.g. Fast Food" />
                </div>
                <div>
                  <label className="block text-app-muted text-xs font-medium mb-1.5">Stock Quantity (Optional)</label>
                  <input type="number" value={productForm.quantity} onChange={e => setProductForm(p => ({ ...p, quantity: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-app-text text-sm focus:border-app-primary/60 outline-none" placeholder="Leave blank for unlimited" />
                </div>
              </div>

              <div>
                <label className="block text-app-muted text-xs font-medium mb-1.5">Description (Optional)</label>
                <textarea rows={2} value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-app-text text-sm focus:border-app-primary/60 outline-none resize-none" placeholder="Brief details..." />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setIsEditingProduct(false)} className="flex-1 bg-white/10 text-app-text font-semibold py-3 rounded-xl hover:bg-white/15 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 bg-app-primary text-white font-bold py-3 rounded-xl shadow-glow-orange hover:bg-app-primary/90 transition-colors">Save Product</button>
              </div>
            </form>
          </div>
        )}

        {/* ── Orders Tab ── */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            <h2 className="text-app-text font-bold mb-4">Order History</h2>
            {myOrders.length === 0 ? (
              <p className="text-app-muted text-sm text-center py-10">No orders yet.</p>
            ) : (
              [...myOrders].reverse().map((order) => (
                <div key={order.id} className="glass rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <p className="text-app-text font-semibold text-sm">{order.customerName}</p>
                    <span className="text-app-primary font-bold text-sm">PKR {order.total.toLocaleString()}</span>
                  </div>
                  <p className="text-app-muted text-xs mb-2">📞 {order.customerPhone}</p>
                  <div className="bg-white/5 rounded-lg p-2 mb-2">
                    <p className="text-app-muted text-xs">{order.items.map(i => `${i.name} x${i.qty}`).join(', ')}</p>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-app-muted/60">
                    <span>{new Date(order.createdAt).toLocaleString('en-PK')}</span>
                    <span className="uppercase text-green-400 font-semibold">{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Settings Tab ── */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="glass rounded-2xl p-5 border border-white/10">
              <h2 className="text-app-text font-bold mb-4">Shop Settings</h2>
              
              <form onSubmit={saveSettings} className="space-y-4">
                
                {/* Shop Banner Upload */}
                <div>
                  <label className="block text-app-muted text-xs font-medium mb-1.5">Shop Banner Image</label>
                  <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden bg-black/40 border border-white/10 group cursor-pointer" onClick={() => settingsInputRef.current?.click()}>
                    {settingsForm.bannerUrl ? (
                      <>
                        <img src={settingsForm.bannerUrl} alt="Banner" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ImageIcon className="w-8 h-8 text-white" />
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-app-muted hover:text-white transition-colors">
                        {isSettingsUploading ? (
                          <div className="w-6 h-6 border-2 border-app-primary border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <>
                            <ImageIcon className="w-6 h-6" />
                            <span className="text-xs">Upload Banner Image</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <input type="file" ref={settingsInputRef} onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], true)} accept="image/*" className="hidden" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-app-muted text-xs font-medium mb-1.5">Rider Name</label>
                    <input type="text" value={settingsForm.riderName} onChange={e => setSettingsForm(p => ({ ...p, riderName: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-app-text text-sm focus:border-app-primary/60 outline-none" placeholder="e.g. Asif Ali" />
                  </div>
                  <div>
                    <label className="block text-app-muted text-xs font-medium mb-1.5">Rider Phone</label>
                    <input type="tel" value={settingsForm.riderPhone} onChange={e => setSettingsForm(p => ({ ...p, riderPhone: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-app-text text-sm focus:border-app-primary/60 outline-none" placeholder="e.g. 03001234567" />
                  </div>
                </div>

                <div>
                  <label className="block text-app-muted text-xs font-medium mb-1.5">Estimated Delivery Time</label>
                  <input type="text" value={settingsForm.deliveryTime} onChange={e => setSettingsForm(p => ({ ...p, deliveryTime: e.target.value }))} className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-app-text text-sm focus:border-app-primary/60 outline-none" placeholder="e.g. 30-45 min" />
                </div>

                <button type="submit" className="w-full bg-app-primary text-white font-bold py-3 rounded-xl shadow-glow-orange hover:bg-app-primary/90 transition-colors mt-2">
                  Save Settings
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
