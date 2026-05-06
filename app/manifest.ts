import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "It's Kacha Khuh",
    short_name: 'Kacha Khuh',
    description: 'Local Food on WhatsApp - Multi-vendor E-commerce',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1a1a',
    theme_color: '#ff6b00',
    icons: [
      {
        src: '/icon?size=192x192',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon?size=512x512',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
