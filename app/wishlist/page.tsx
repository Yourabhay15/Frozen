"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { formatPrice } from "@/lib/currency"
import { useToast } from "@/hooks/use-toast"
import type { Product, WishlistItem } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<(WishlistItem & { product: Product })[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    if (user) {
      fetchWishlist()
    } else {
      setLoading(false)
    }
  }, [user])

  const fetchWishlist = async () => {
    if (!user) return

    try {
      const response = await fetch(`/api/wishlist?userId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        // Fetch product details for each wishlist item
        const itemsWithProducts = await Promise.all(
          data.data.map(async (item: WishlistItem) => {
            const productResponse = await fetch(`/api/products/${item.productId}`)
            const productData = await productResponse.json()
            return {
              ...item,
              product: productData,
            }
          }),
        )
        setWishlistItems(itemsWithProducts)
      }
    } catch (error) {
      console.error("Failed to fetch wishlist:", error)
      toast({
        title: "Error",
        description: "Failed to load wishlist",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (productId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/wishlist/${productId}?userId=${user.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setWishlistItems((items) => items.filter((item) => item.productId !== productId))
        toast({
          title: "Removed from wishlist",
          description: "Item has been removed from your wishlist",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist",
        variant: "destructive",
      })
    }
  }

  const addToCart = async (product: Product) => {
    if (!user) return

    try {
      const response = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          productId: product.id,
          quantity: 1,
        }),
      })

      if (response.ok) {
        toast({
          title: "Added to cart! 🛒",
          description: `${product.name} has been added to your cart`,
        })
        window.dispatchEvent(new Event("cart-updated"))
        window.dispatchEvent(new Event("open-cart"))
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      })
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass border-white/10 p-8">
          <CardContent className="text-center">
            <Heart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <p className="text-white mb-4">Please sign in to view your wishlist</p>
            <Button asChild>
              <Link href="/auth/signin">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Wishlist</h1>
          <p className="text-slate-400">Items you love and want to buy later</p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : wishlistItems.length === 0 ? (
          <Card className="glass border-white/10 text-center p-8">
            <CardContent>
              <Heart className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">Your wishlist is empty</p>
              <Button asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistItems.map((item) => {
              const product = item.product
              const finalPrice = (product.discount && product.discount > 0) ? product.price * (1 - product.discount / 100) : product.price

              return (
                <Card key={item.id} className="group glass border-white/10 hover-lift overflow-hidden bg-black/50">
                  <div className="relative">
                    <Link href={`/product/${product.id}`}>
                      <div className="aspect-square relative overflow-hidden">
                        <Image
                          src={product.images[0] || "/placeholder.svg?height=300&width=300"}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    </Link>

                    {/* Remove from wishlist */}
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-4 right-4 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      onClick={() => removeFromWishlist(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.isNew && <Badge className="bg-white text-black font-semibold">NEW</Badge>}
                      {(product.discount && product.discount > 0) && <Badge className="bg-red-600 text-white">-{product.discount}%</Badge>}
                      {product.inventory === 0 && <Badge variant="destructive">OUT OF STOCK</Badge>}
                    </div>
                  </div>

                  <CardContent className="p-6 bg-black">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-semibold text-lg mb-2 text-white group-hover:text-gray-300 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        {(product.discount && product.discount > 0) ? (
                          <>
                            <span className="text-xl font-bold text-white">{formatPrice(finalPrice)}</span>
                            <span className="text-sm text-gray-500 line-through">{formatPrice(product.price)}</span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-white">{formatPrice(product.price)}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        className="flex-1 bg-white text-black hover:bg-gray-200 font-semibold"
                        disabled={product.inventory === 0}
                        onClick={() => addToCart(product)}
                      >
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        {product.inventory === 0 ? "OUT OF STOCK" : "ADD TO CART"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
