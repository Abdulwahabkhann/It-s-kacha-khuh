import type { Metadata, Viewport } from 'next'
import './globals.css'
import { CartDrawer } from '@/components/CartDrawer'
import { ToastNotification } from '@/components/Toast'

export const metadata: Metadata = {
  title: "It's Kacha Khuh — Local Food on WhatsApp",
  description: 'Browse local food shops and order directly on WhatsApp. Fast, simple, delicious.',
  keywords: 'food delivery, WhatsApp order, local food, Pakistan food',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "It's Kacha Khuh",
  },
  formatDetection: {
    telephone: false,
  },
}

export const viewport: Viewport = {
  themeColor: '#ff6b00',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="relative z-10">
          {children}
        </div>
        <CartDrawer />
        <ToastNotification />
      </body>
    </html>
  )
}
