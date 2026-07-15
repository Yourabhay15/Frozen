"use client"

import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye, Star } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import WishlistButton from "@/components/wishlist/wishlist-button"
import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.price
  const { user } = useAuth()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to cart",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          quantity: 1,
          size: product.sizes[0] || "M",
        }),
      })

      if (response.ok) {
        toast({
          title: "Added to cart! 🛒",
          description: `${product.name} has been added to your cart`,
        })
        window.dispatchEvent(new Event("cart-updated"))
        window.dispatchEvent(new Event("open-cart"))
      } else {
        throw new Error("Failed to add to cart")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="group glass border-white/10 hover-lift overflow-hidden bg-black/50">
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              aria-label={product.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Quick Actions */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <WishlistButton productId={product.id} />
              <Button size="icon" variant="secondary" className="h-8 w-8 glass bg-black/70 border-white/20 focus:ring-2 focus:ring-white focus:outline-none" aria-label="Quick view product">
                <Eye className="h-4 w-4 text-white" />
              </Button>
            </div>

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isNew && <Badge className="bg-white text-black font-semibold">NEW</Badge>}
              {product.inventory === 0 && <Badge variant="destructive">OUT OF STOCK</Badge>}
            </div>
          </div>
        </Link>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button
            onClick={handleAddToCart}
            disabled={product.inventory === 0 || loading}
            className="w-full bg-white text-black hover:bg-gray-200 font-semibold focus:ring-2 focus:ring-black focus:outline-none btn-premium"
            aria-disabled={product.inventory === 0 || loading}
            aria-label={product.inventory === 0 ? "Out of stock" : "Add to cart"}
          >
            {product.inventory === 0 ? (
              "OUT OF STOCK"
            ) : loading ? (
              <div className="flex items-center justify-center gap-2">
                <span className="hexagon-spinner text-black" />
                <span>ADDING...</span>
              </div>
            ) : (
              <>
                <ShoppingCart className="mr-2 h-4 w-4" />
                <span>ADD TO CART</span>
              </>
            )}
          </Button>
        </div>
      </div>

      <CardContent className="p-6 bg-black">
        <Link href={`/product/${product.id}`}>
          <h3
            className="font-semibold text-lg mb-2 text-white group-hover:text-gray-300 transition-colors line-clamp-1 focus:outline-none focus:ring-2 focus:ring-white"
            tabIndex={0}
            aria-label={product.name}
          >
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>
        <Badge variant="secondary" className="text-xs glass bg-gray-800 text-gray-300 border-white/20">
          {product.category?.toUpperCase?.() || ""}
        </Badge>
        {product.averageRating && product.averageRating > 0 && (
          <div className="flex items-center gap-1 mt-2">
            <Star className="h-3 w-3 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-300">{product.averageRating}</span>
            <span className="text-xs text-gray-500">({product.totalReviews} reviews)</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0 bg-black">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">{formatPrice(price)}</span>
          </div>

          {product.inventory > 0 && product.inventory <= 5 && (
            <Badge variant="outline" className="text-orange-400 border-orange-400 bg-orange-400/10">
              ONLY {product.inventory} LEFT
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
