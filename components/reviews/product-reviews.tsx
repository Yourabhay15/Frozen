"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, ThumbsUp, MessageSquare } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import type { ProductReview } from "@/lib/types"
import ReviewForm from "./review-form"

interface ProductReviewsProps {
  productId: string
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<ProductReview[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    fetchReviews()
  }, [productId])

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}`)
      const data = await response.json()
      if (data.success) {
        setReviews(data.data)
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReviewAdded = () => {
    setShowForm(false)
    fetchReviews()
  }

  const markHelpful = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}/helpful`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment: true }),
      })

      if (response.ok) {
        fetchReviews()
      }
    } catch (error) {
      console.error("Failed to mark review as helpful:", error)
    }
  }

  const averageRating =
    reviews.length > 0 ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0

  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((review) => review.rating === rating).length,
    percentage:
      reviews.length > 0 ? (reviews.filter((review) => review.rating === rating).length / reviews.length) * 100 : 0,
  }))

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="glass border-white/10 bg-black/50">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Customer Reviews ({reviews.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Rating Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-white mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${star <= averageRating ? "text-yellow-400 fill-current" : "text-gray-600"}`}
                  />
                ))}
              </div>
              <p className="text-gray-400">Based on {reviews.length} reviews</p>
            </div>

            <div className="space-y-2">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-2 text-sm">
                  <span className="text-white w-8">{rating}★</span>
                  <div className="flex-1 bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }} />
                  </div>
                  <span className="text-gray-400 w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Write Review Button */}
          {user && !showForm && (
            <div className="text-center">
              <Button onClick={() => setShowForm(true)} className="bg-white text-black hover:bg-gray-200">
                Write a Review
              </Button>
            </div>
          )}

          {/* Review Form */}
          {showForm && (
            <ReviewForm productId={productId} onReviewAdded={handleReviewAdded} onCancel={() => setShowForm(false)} />
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <Card key={review.id} className="glass border-white/10 bg-black/50">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-semibold text-white">{review.userName}</span>
                    {review.verified && <Badge className="bg-green-600 text-white text-xs">Verified Purchase</Badge>}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= review.rating ? "text-yellow-400 fill-current" : "text-gray-600"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-gray-400 text-sm">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-white mb-2">{review.title}</h4>
              <p className="text-gray-300 mb-4">{review.comment}</p>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markHelpful(review.id)}
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Helpful ({review.helpful})
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {reviews.length === 0 && (
        <Card className="glass border-white/10 bg-black/50">
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No reviews yet</p>
            <p className="text-gray-500 text-sm">Be the first to review this product!</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
