import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <span className="text-6xl mb-4">🍽️</span>
      <h1 className="text-app-text font-700 text-2xl mb-2">Page Not Found</h1>
      <p className="text-app-muted text-sm mb-6">
        This page doesn&apos;t exist. Maybe the food was too good and someone ate the page.
      </p>
      <Link
        href="/"
        className="bg-app-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#ff8050] transition-colors shadow-glow-orange"
      >
        Back to Home
      </Link>
    </div>
  )
}
