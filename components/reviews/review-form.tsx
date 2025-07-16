"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Star } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface ReviewFormProps {
  productId: string
  onReviewAdded: () => void
  onCancel: () => void
}

export default function ReviewForm({ productId, onReviewAdded, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [title, setTitle] = useState("")
  const [comment, setComment] = useState("")
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to write a review",
        variant: "destructive",
      })
      return
    }

    if (rating === 0) {
      toast({
        title: "Please select a rating",
        description: "Rating is required to submit a review",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          userId: user.id,
          userName: user.name,
          rating,
          title,
          comment,
          verified: true, // In a real app, this would be based on purchase history
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Review submitted! ⭐",
          description: "Thank you for your feedback",
        })
        onReviewAdded()
      } else {
        throw new Error(data.error)
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit review",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="glass border-white/10 bg-black/50">
      <CardHeader>
        <CardTitle className="text-white">Write a Review</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Rating */}
          <div>
            <Label className="text-white">Rating *</Label>
            <div className="flex gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1"
                >
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-600 hover:text-yellow-400"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title" className="text-white">
              Review Title *
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="glass border-white/20 text-white"
              placeholder="Summarize your review"
              required
            />
          </div>

          {/* Comment */}
          <div>
            <Label htmlFor="comment" className="text-white">
              Your Review *
            </Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="glass border-white/20 text-white"
              placeholder="Tell others about your experience with this product"
              rows={4}
              required
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <Button type="submit" disabled={loading || rating === 0} className="bg-white text-black hover:bg-gray-200">
              {loading ? "Submitting..." : "Submit Review"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="glass border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
