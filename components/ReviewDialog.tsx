'use client'

import { useState } from 'react'
import { Star, X, CheckCircle2, MessageSquare, Utensils, User as UserIcon, Truck, Bike } from 'lucide-react'
import { useAppStore, Review } from '@/lib/app-store'
import { useAuthStore } from '@/lib/auth-store'

interface ReviewDialogProps {
  orderId: string
  shopId: string
  shopName: string
  onClose: () => void
}

export function ReviewDialog({ orderId, shopId, shopName, onClose }: ReviewDialogProps) {
  const { addReview } = useAppStore()
  const { currentUser, addPoints } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [comment, setComment] = useState('')

  const [ratings, setRatings] = useState({
    taste: 0,
    food: 0,
    serving: 0,
    delivery: 0,
    rider: 0,
  })

  const categories = [
    { id: 'taste', label: 'Food Taste', icon: Utensils },
    { id: 'food', label: 'Food Quality', icon: Utensils },
    { id: 'serving', label: 'Waiter Serving', icon: UserIcon },
    { id: 'delivery', label: 'Delivery Speed', icon: Truck },
    { id: 'rider', label: 'Rider Behavior', icon: Bike },
  ]

  const handleRate = (catId: string, val: number) => {
    setRatings(prev => ({ ...prev, [catId]: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (Object.values(ratings).some(r => r === 0)) {
      alert('Please rate all categories!')
      return
    }

    setLoading(true)
    const reviewData = {
      orderId,
      shopId,
      shopName,
      customerId: currentUser?.id || 'guest',
      customerName: currentUser?.name || 'Guest User',
      ratings,
      comment,
    }

    // Logic for points
    const isPerfect = Object.values(ratings).every(r => r === 5)
    const pointsToAdd = isPerfect ? 0.10 : 0.001

    // Add to store
    addReview(reviewData)
    // Add points to customer
    addPoints(pointsToAdd)

    await new Promise(r => setTimeout(r, 1000))
    setLoading(false)
    setSuccess(true)
    setTimeout(onClose, 2000)
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="glass rounded-3xl p-8 max-w-sm w-full text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-app-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-glow-emerald">
            <CheckCircle2 className="w-10 h-10 text-app-primary" />
          </div>
          <h3 className="text-2xl font-bold text-app-text mb-2">Review Submitted!</h3>
          <p className="text-app-muted text-sm">
            Thank you for your feedback. You've earned <span className="text-app-primary font-bold">{Object.values(ratings).every(r => r === 5) ? '0.10' : '0.001'} points</span>!
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="glass rounded-3xl p-6 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-app-text">Review {shopName}</h3>
            <p className="text-app-muted text-xs">Help us improve your experience</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <X className="w-5 h-5 text-app-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/5 rounded-lg group-hover:bg-app-primary/10 transition-colors">
                    <cat.icon className="w-4 h-4 text-app-primary" />
                  </div>
                  <span className="text-sm font-medium text-app-text">{cat.label}</span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRate(cat.id, star)}
                      className="p-0.5 focus:outline-none transition-transform hover:scale-110 active:scale-95"
                    >
                      <Star
                        className={`w-5 h-5 ${
                          ratings[cat.id as keyof typeof ratings] >= star
                            ? 'fill-app-secondary text-app-secondary drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]'
                            : 'text-white/10'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-app-muted uppercase tracking-widest pl-1">
              <MessageSquare className="w-3 h-3" />
              Write a Comment
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="What did you like or dislike?"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-app-text text-sm placeholder:text-app-muted/30 focus:outline-none focus:border-app-primary/60 transition-all min-h-[100px] resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-app-primary hover:bg-emerald-600 text-white font-bold py-4 rounded-2xl transition-all shadow-glow-emerald disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Submit Review & Earn Points'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
