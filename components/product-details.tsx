"use client"

import { useState } from "react"
import type { Product } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ShoppingCart, Share2, Truck, Shield, RotateCcw, Star, ArrowLeft } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/hooks/use-toast"
import ProductImageGallery from "./product-image-gallery"
import WishlistButton from "@/components/wishlist/wishlist-button"
import ProductReviews from "@/components/reviews/product-reviews"
import Link from "next/link"

interface ProductDetailsProps {
  product: Product
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedSize, setSelectedSize] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()

  const finalPrice = product.price

  const addToCart = async () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to sign in to add items to cart",
        variant: "destructive",
      })
      return
    }

    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast({
        title: "Please select a size",
        description: "Size selection is required for this product",
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
          quantity,
          size: selectedSize,
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

  const shareProduct = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description,
          url: window.location.href,
        })
      } catch (error) {
        // Fallback to clipboard
        navigator.clipboard.writeText(window.location.href)
        toast({
          title: "Link copied!",
          description: "Product link copied to clipboard",
        })
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Product link copied to clipboard",
      })
    }
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div className="flex justify-start">
        <Button variant="ghost" asChild className="text-gray-400 hover:text-white hover:bg-white/10 btn-premium transition-all">
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shop
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-black">
        {/* Product Images with Zoom */}
        <ProductImageGallery product={product} />

        {/* Product Information */}
        <div className="space-y-6">
          <div>
            <Badge variant="secondary" className="mb-2 glass bg-gray-800 text-gray-300 border-white/20">
              {product.category?.toUpperCase?.() || ""}
            </Badge>
            <h1 className="text-3xl font-bold mb-4 text-white" aria-label={product.name}>{product.name}</h1>

            <div className="flex items-center space-x-4 mb-4">
              <span className="text-3xl font-bold text-white">{formatPrice(finalPrice)}</span>
            </div>

            {product.averageRating && product.averageRating > 0 && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= (product.averageRating || 0) ? "text-yellow-400 fill-current" : "text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white">{product.averageRating}</span>
                <span className="text-gray-400">({product.totalReviews} reviews)</span>
              </div>
            )}

            {/* Share Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={shareProduct}
              className="text-gray-400 hover:text-white hover:bg-white/10 p-2 focus:ring-2 focus:ring-white focus:outline-none"
              aria-label="Share product"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>

          <Separator className="bg-white/20" />

          <div>
            <h3 className="font-semibold mb-2 text-white">Description</h3>
            <p className="text-gray-300 leading-relaxed">{product.description}</p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3 text-white">Size</h3>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <Button
                    key={size}
                    variant={selectedSize === size ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedSize(size)}
                    className={
                      (selectedSize === size
                        ? "bg-white text-black hover:bg-gray-200"
                        : "glass border-white/20 bg-transparent text-white hover:bg-white/10") +
                      " focus:ring-2 focus:ring-white focus:outline-none"
                    }
                    aria-label={`Select size ${size}`}
                  >
                    {size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="font-semibold mb-3 text-white">Quantity</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="glass border-white/20 bg-transparent text-white hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none"
                aria-label="Decrease quantity"
              >
                -
              </Button>
              <span className="w-12 text-center text-white font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(quantity + 1)}
                className="glass border-white/20 bg-transparent text-white hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none"
                aria-label="Increase quantity"
              >
                +
              </Button>
            </div>
          </div>

          {/* Product Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="glass border-white/10 bg-black/50">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Stock Status:</span>
                    <span className={product.inventory > 0 ? "text-green-400" : "text-red-400"}>
                      {product.inventory > 0 ? `IN STOCK (${product.inventory})` : "OUT OF STOCK"}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="glass border-white/10 bg-black/50">
              <CardContent className="p-4">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-green-400" />
                    <span className="text-green-400">Free delivery on ₹2000+</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="h-4 w-4 text-blue-400" />
                    <span className="text-blue-400">30-day returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-purple-400" />
                    <span className="text-purple-400">1-year warranty</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <div className="flex space-x-3">
              <Button
                size="lg"
                className="w-full bg-white text-black hover:bg-gray-200 font-semibold py-4 btn-premium"
                onClick={addToCart}
                disabled={product.inventory === 0 || loading}
                aria-disabled={product.inventory === 0 || loading}
                aria-label={product.inventory === 0 ? "Out of stock" : loading ? "Adding to cart" : "Add to cart"}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="hexagon-spinner text-black" />
                    <span>ADDING...</span>
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    {product.inventory === 0 ? "OUT OF STOCK" : "ADD TO CART"}
                  </>
                )}
              </Button>
              <WishlistButton productId={product.id} showText />
            </div>

            {product.sizes && product.sizes.length > 0 && !selectedSize && (
              <p className="text-sm text-red-400 text-center">Please select a size</p>
            )}
          </div>

          {/* Additional Product Info */}
          <div className="space-y-4 pt-4 border-t border-white/20">
            <div className="text-sm text-gray-400">
              <p className="mb-2">
                <strong className="text-white">Material:</strong> Premium cotton blend with reinforced stitching
              </p>
              <p className="mb-2">
                <strong className="text-white">Care:</strong> Machine wash cold, tumble dry low
              </p>
              <p>
                <strong className="text-white">Origin:</strong> Designed in India, Made with care
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {product.material && (
              <div>
                <span className="font-semibold">Material:</span> {product.material}
              </div>
            )}
            {product.care && (
              <div>
                <span className="font-semibold">Care:</span> {product.care}
              </div>
            )}
            {product.origin && (
              <div>
                <span className="font-semibold">Origin:</span> {product.origin}
              </div>
            )}
          </div>
        </div>
      </div>

      <Separator className="bg-white/20 my-8" />
      <ProductReviews productId={product.id} />

      {/* Live region for feedback */}
      <div aria-live="polite" className="sr-only" id="product-feedback-region"></div>
    </div>
  )
}
