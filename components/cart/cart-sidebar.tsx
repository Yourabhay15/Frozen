"use client"

import { useState, useEffect } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingBag, Plus, Minus, Trash2 } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { formatPrice } from "@/lib/currency"
import type { CartItem, Product } from "@/lib/types"
import Image from "next/image"
import Link from "next/link"

export default function CartSidebar() {
  const { user } = useAuth()
  const [cartItems, setCartItems] = useState<(CartItem & { product: Product })[]>([])
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const fetchCart = async () => {
    if (!user) return

    try {
      setLoading(true)
      const response = await fetch(`/api/cart?userId=${user.id}`)
      const data = await response.json()

      if (data.success) {
        // Fetch product details for each cart item
        const itemsWithProducts = await Promise.all(
          data.data.map(async (item: CartItem) => {
            const productResponse = await fetch(`/api/products/${item.productId}`)
            const productData = await productResponse.json()
            return {
              ...item,
              product: productData,
            }
          }),
        )
        setCartItems(itemsWithProducts)
      }
    } catch (error) {
      console.error("Failed to fetch cart:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchCart()
    }

    const handleCartUpdate = () => {
      fetchCart()
    }
    const handleOpenCart = () => {
      setIsOpen(true)
    }
    window.addEventListener("cart-updated", handleCartUpdate)
    window.addEventListener("open-cart", handleOpenCart)

    return () => {
      window.removeEventListener("cart-updated", handleCartUpdate)
      window.removeEventListener("open-cart", handleOpenCart)
    }
  }, [user])

  useEffect(() => {
    if (user && isOpen) {
      fetchCart()
    }
  }, [user, isOpen])

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (!user) return

    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, quantity }),
      })

      if (response.ok) {
        fetchCart()
      }
    } catch (error) {
      console.error("Failed to update cart:", error)
    }
  }

  const removeItem = async (itemId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/cart/${itemId}?userId=${user.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        fetchCart()
      }
    } catch (error) {
      console.error("Failed to remove item:", error)
    }
  }

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => {
    return sum + item.product.price * item.quantity
  }, 0)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative hover:bg-white/10 focus:ring-2 focus:ring-white focus:outline-none" aria-label="Open cart sidebar">
          <ShoppingBag className="h-5 w-5 text-slate-300" />
          {totalItems > 0 && (
            <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-blue-500">{totalItems}</Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="glass border-white/20 w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="text-white">Shopping Cart</SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <ShoppingBag className="h-16 w-16 text-slate-400 mb-4" />
              <p className="text-slate-400 mb-4">Your cart is empty</p>
              <Button asChild onClick={() => setIsOpen(false)}>
                <Link href="/">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4 py-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 p-4 glass rounded-lg border border-white/10">
                    <div className="relative w-16 h-16 rounded-md overflow-hidden">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        aria-label={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{item.product.name}</h4>
                      <p className="text-sm text-slate-400">
                        {formatPrice(item.product.price)}
                      </p>
                      {item.size && <p className="text-xs text-slate-500">Size: {item.size}</p>}

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 glass border-white/20 bg-transparent focus:ring-2 focus:ring-white focus:outline-none"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="text-white text-sm w-8 text-center">{item.quantity}</span>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-6 w-6 glass border-white/20 bg-transparent focus:ring-2 focus:ring-white focus:outline-none"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-red-400 hover:text-red-300 ml-auto focus:ring-2 focus:ring-white focus:outline-none"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/20 pt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Total:</span>
                  <span className="text-xl font-bold text-white">{formatPrice(totalPrice)}</span>
                </div>

                <div className="space-y-2">
                  <Button
                    asChild
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => setIsOpen(false)}
                  >
                    <Link href="/checkout">Proceed to Checkout</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full glass border-white/20 bg-transparent"
                    onClick={() => setIsOpen(false)}
                  >
                    Continue Shopping
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Live region for cart feedback */}
        <div aria-live="polite" className="sr-only" id="cart-feedback-region"></div>
      </SheetContent>
    </Sheet>
  )
}
