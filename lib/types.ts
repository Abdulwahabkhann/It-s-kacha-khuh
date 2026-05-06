export type Shop = {
  id: string
  name: string
  area: string
  whatsapp: string
  riderName?: string
  riderPhone?: string
  bannerUrl?: string
  rating: number
  deliveryTime: string
  categories: string[]
}

export type Product = {
  id: string
  shopId: string
  name: string
  description?: string
  price: number
  category: string
  imageUrl?: string       // optional product image
  mediaUrl?: string       // image or video URL
  mediaType?: string      // e.g. 'video/mp4', 'image/jpeg'
  quantity?: number       // optional stock count
  isAvailable?: boolean   // toggle availability
}

export type ShopOverride = {
  shopId: string
  riderName?: string
  riderPhone?: string
  deliveryTime?: string
  bannerUrl?: string
  whatsapp?: string
  customProducts: Product[]   // products added/edited by shopkeeper (extends JSON data)
}

export type CartItem = {
  id: string
  name: string
  price: number
  qty: number
  shopId: string
  shopName: string
  shopWhatsapp: string
  imageUrl?: string
}

export type CustomerInfo = {
  name: string
  phone: string
  address: string
}
