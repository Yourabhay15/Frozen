"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

interface WishlistButtonProps {
  productId: string
  className?: string
  showText?: boolean
}

// Helper function to validate MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
  return typeof id === 'string' && id.trim().length > 0;
};

export default function WishlistButton({ productId, className, showText = false }: WishlistButtonProps) {
  const [isInWishlist, setIsInWishlist] = useState(false)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user && isValidObjectId(user.id)) { // Add validation here
      checkWishlistStatus()
    }
  }, [user, productId])

  const checkWishlistStatus = async () => {
    if (!user || !isValidObjectId(user.id)) { // Add validation here
      return
    }

    try {
      const response = await fetch(`/api/wishlist/${productId}?userId=${user.id}`)
      const data = await response.json()
      if (data.success) {
        setIsInWishlist(data.data.inWishlist)
      }
    } catch (error) {
      console.error("Failed to check wishlist status:", error)
    }
  }

  const toggleWishlist = async () => {
    if (!user || !isValidObjectId(user.id)) { // Add validation here
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to wishlist",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      if (isInWishlist) {
        const response = await fetch(`/api/wishlist/${productId}?userId=${user.id}`, {
          method: "DELETE",
        })

        if (response.ok) {
          setIsInWishlist(false)
          toast({
            title: "Removed from wishlist",
            description: "Item has been removed from your wishlist",
          })
        }
      } else {
        const response = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, productId }),
        })

        if (response.ok) {
          setIsInWishlist(true)
          toast({
            title: "Added to wishlist ❤️",
            description: "Item has been added to your wishlist",
          })
        } else {
          const data = await response.json()
          if (response.status === 409) {
            setIsInWishlist(true)
          } else {
            throw new Error(data.error)
          }
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={isInWishlist ? "default" : "outline"}
      size={showText ? "default" : "icon"}
      onClick={toggleWishlist}
      disabled={loading || !user || !isValidObjectId(user.id)} // Disable if user or user.id is invalid
      className={cn(
        isInWishlist
          ? "bg-red-600 hover:bg-red-700 text-white"
          : "glass border-white/20 bg-transparent text-white hover:bg-white/10",
        className,
      )}
    >
      <Heart className={cn("h-4 w-4", isInWishlist && "fill-current", showText && "mr-2")} />
      {showText && (isInWishlist ? "Remove from Wishlist" : "Add to Wishlist")}
    </Button>
  )
}
