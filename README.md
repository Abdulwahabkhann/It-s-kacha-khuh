# 🔥 It's Kacha Khuh — WhatsApp Food Ordering App

A mobile-first web app where users browse local food shops, add items to cart, and place orders via WhatsApp. No API, no payment gateway — just clean UX and a prefilled WhatsApp message.

## Stack

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS (dark premium glass theme)
- **Animations**: Framer Motion (via class transitions)
- **State**: Zustand + localStorage persistence
- **Icons**: Lucide React
- **Data**: Static JSON (MVP)
- **Orders**: `wa.me` WhatsApp deep links

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — shop listing, search, category filter |
| `/shop/[id]` | Shop detail — menu sections, add to cart |
| `/admin` | Admin panel — manage shops & products |

## How to Customise

### Add a Shop
Edit `data/shops.json` and add a new shop object:

```json
{
  "id": "my-shop",
  "name": "My Shop",
  "area": "Gulshan",
  "whatsapp": "923001234567",
  "riderName": "Rider Name",
  "riderPhone": "923007654321",
  "bannerUrl": "https://...",
  "rating": 4.5,
  "deliveryTime": "20–30 min",
  "categories": ["Burgers", "Drinks"]
}
```

### Add Products
Edit `data/products.json`:

```json
{
  "id": "my-shop-burger-1",
  "shopId": "my-shop",
  "name": "Smash Burger",
  "description": "Double patty, special sauce",
  "price": 650,
  "category": "Burgers"
}
```

### WhatsApp Number Format
Use international format without `+` or spaces:
- Pakistan: `923001234567` (92 = country code)

## WhatsApp Message Format

When a user places an order, they're redirected to WhatsApp with:

```
Hi! I'd like to place an order 🛵

• Smash Burger x2 = PKR 1,300
• Mango Lassi x1 = PKR 220

💰 *Total: PKR 1,520*

---
👤 Name: Ahmed Khan
📞 Phone: 0300-1234567
📍 Address: House 12, Street 5, Gulshan
```

## Deployment

```bash
npm run build
npm start
```

Or deploy to **Vercel** (zero config with Next.js):

```bash
npx vercel
```

## Design System

| Token | Value |
|-------|-------|
| Background | `#0F172A` |
| Surface/Card | `#1E293B` |
| Primary (Orange) | `#FF6B2C` |
| Secondary (WhatsApp Green) | `#22C55E` |
| Text | `#F8FAFC` |
| Muted | `#94A3B8` |

## Project Structure

```
its-kacha-khuh/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Home page (server)
│   ├── HomeClient.tsx      # Search + filter (client)
│   ├── not-found.tsx       # 404 page
│   ├── globals.css         # Global styles
│   ├── shop/[id]/
│   │   ├── page.tsx        # Shop detail (server)
│   │   └── ShopMenuClient.tsx  # Menu tabs (client)
│   └── admin/
│       └── page.tsx        # Admin panel (client)
├── components/
│   ├── Navbar.tsx
│   ├── BottomNav.tsx
│   ├── ShopCard.tsx
│   ├── MenuItem.tsx
│   ├── CartDrawer.tsx      # Slide-in cart + form
│   ├── FloatingCartBar.tsx
│   ├── CategoryChips.tsx
│   ├── SearchBar.tsx
│   ├── Toast.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Card.tsx
├── lib/
│   ├── types.ts            # TypeScript types
│   ├── store.ts            # Zustand cart store
│   ├── utils.ts            # cn, formatPrice, groupBy
│   └── whatsapp.ts         # Message generator
└── data/
    ├── shops.json          # Shop data
    └── products.json       # Product data
```

---

Built with ❤️ — Order local, support local 🛵
