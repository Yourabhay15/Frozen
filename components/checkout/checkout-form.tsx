"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { INDIAN_STATES } from "@/lib/indian-integrations"
import PaymentOptions from "@/components/payment/payment-options"
import ShippingOptions from "@/components/shipping/shipping-options"
import { useAuth } from "@/lib/auth-context"
import { formatPrice } from "@/lib/currency"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"

export default function CheckoutForm() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [total, setTotal] = useState(0)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

  useEffect(() => {
    if (user) {
      // Fetch cart items
      fetch(`/api/cart?userId=${user.id}`)
        .then(res => res.json())
        .then(async (data) => {
          if (data.success && Array.isArray(data.data)) {
            // Fetch product details for each item to get price
            const items = await Promise.all(
              data.data.map(async (item: any) => {
                const productRes = await fetch(`/api/products/${item.productId}`)
                const product = await productRes.json()
                return { ...item, product }
              })
            )
            setCartItems(items)
            const sum = items.reduce((s: number, item: any) => s + (item.product?.price || 0) * item.quantity, 0)
            // Add shipping cost ₹49 if total < 999
            setTotal(sum >= 999 || sum === 0 ? sum : sum + 49)
          }
        })
        .catch(err => console.error("Error fetching checkout details:", err))
    }
  }, [user])

  const handlePay = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "You must be signed in to checkout.",
        variant: "destructive"
      })
      return
    }

    if (!formData.name || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.pincode) {
      toast({
        title: "Required details missing",
        description: "Please fill out all delivery information fields.",
        variant: "destructive"
      })
      return
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty Cart",
        description: "You do not have any items to checkout.",
        variant: "destructive"
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          items: cartItems.map(item => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
          paymentMethod: "Card / UPI",
          total: total
        })
      })

      const result = await response.json()
      if (response.ok && result.success) {
        toast({
          title: "Order placed successfully! 🎉",
          description: `Your order has been registered. Thank you for shopping with us!`,
        })
        window.dispatchEvent(new Event("cart-updated"))
        router.push("/orders")
      } else {
        throw new Error(result.error || "Failed to place order")
      }
    } catch (err: any) {
      toast({
        title: "Error creating order",
        description: err.message || "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSubmitting(false)
    }
  }



  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Shipping Information */}
      <Card className="glass border-white/10" aria-label="Delivery Information">
        <CardHeader>
          <CardTitle className="text-white">🏠 Delivery Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="glass border-white/20 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="Your Name"
                aria-required="true"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">
                Mobile Number *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="glass border-white/20 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="+91 9876543210"
                aria-required="true"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="email" className="text-white">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="glass border-white/20 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="address" className="text-white">
              Complete Address *
            </Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="glass border-white/20 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="House No, Street, Area"
              aria-required="true"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="city" className="text-white">
                City *
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="glass border-white/20 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="City"
                aria-required="true"
              />
            </div>
            <div>
              <Label htmlFor="state" className="text-white">
                State *
              </Label>
              <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                <SelectTrigger className="glass border-white/20 text-white focus:ring-2 focus:ring-green-500 focus:outline-none" aria-required="true">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent className="glass border-white/20">
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="pincode" className="text-white">
                PIN Code *
              </Label>
              <Input
                id="pincode"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                className="glass border-white/20 text-white focus:ring-2 focus:ring-green-500 focus:outline-none"
                placeholder="110001"
                maxLength={6}
                aria-required="true"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment & Shipping Options */}
      <div className="space-y-6" aria-label="Payment and Shipping Options">
        {/* Order Summary */}
        <Card className="glass border-white/10 bg-black/50">
          <CardHeader>
            <CardTitle className="text-white flex justify-between items-center text-lg">
              <span className="flex items-center gap-2">🛍️ Order Summary</span>
              <span className="text-sm font-normal text-slate-400">
                {cartItems.reduce((count, item) => count + item.quantity, 0)} items
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 max-h-60 overflow-y-auto no-scrollbar">
            {cartItems.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">No items in cart</p>
            ) : (
              cartItems.map((item) => (
                <div key={item.id} className="flex justify-between items-center border-b border-white/5 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 overflow-hidden rounded bg-white/5 border border-white/10 shrink-0">
                      {item.product?.images?.[0] && (
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div>
                      <h4 className="text-white text-sm font-medium line-clamp-1">{item.product?.name}</h4>
                      <p className="text-xs text-slate-400">Size: {item.size || "M"} • Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-white text-sm font-semibold">{item.product?.price ? formatPrice(item.product.price * item.quantity) : "..."}</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <ShippingOptions />
        <PaymentOptions />

        <Button
          onClick={handlePay}
          disabled={submitting || cartItems.length === 0}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-semibold focus:ring-2 focus:ring-green-500 focus:outline-none btn-premium"
          aria-disabled={submitting || cartItems.length === 0}
        >
          {submitting ? (
            <div className="flex items-center justify-center gap-2">
              <span className="hexagon-spinner text-white" />
              <span>PROCESSING...</span>
            </div>
          ) : (
            `Pay ${total > 0 ? formatPrice(total) : formatPrice(2999)}`
          )}
        </Button>
        <div aria-live="polite" className="sr-only" id="checkout-feedback-region"></div>
      </div>
    </div>
  )
}
