import { notFound } from 'next/navigation'
import shopsData from '@/data/shops.json'
import productsData from '@/data/products.json'
import type { Shop, Product } from '@/lib/types'
import { ShopPageClient } from './ShopPageClient'

interface PageProps {
  params: { id: string }
}

export async function generateStaticParams() {
  return (shopsData as Shop[]).map((shop) => ({ id: shop.id }))
}

export default function ShopPage({ params }: PageProps) {
  let shop = (shopsData as Shop[]).find((s) => s.id === params.id)
  
  if (!shop) {
    // If not found in JSON, it might be a custom shop in localStorage.
    // Provide a dummy initial shape. The client component will overwrite it from Zustand.
    shop = {
      id: params.id,
      name: 'Loading Shop...',
      area: '',
      whatsapp: '',
      rating: 0,
      deliveryTime: '',
      categories: [],
    }
  }

  const products = (productsData as Product[]).filter(
    (p) => p.shopId === params.id
  )

  return <ShopPageClient initialShop={shop} initialProducts={products} />
}
