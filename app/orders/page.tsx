"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { formatPrice } from "@/lib/currency"
import type { Order } from "@/lib/types"
import { Package, Truck, CheckCircle, Clock } from "lucide-react"
import Link from "next/link"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return

      try {
        const response = await fetch(`/api/orders?userId=${user.id}`)
        const data = await response.json()

        if (data.success) {
          setOrders(data.data)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
      case "processing":
        return <Package className="h-4 w-4" />
      case "shipped":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-600"
      case "confirmed":
      case "processing":
        return "bg-blue-600"
      case "shipped":
        return "bg-purple-600"
      case "delivered":
        return "bg-green-600"
      case "cancelled":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="glass border-white/10 p-8">
          <CardContent className="text-center">
            <p className="text-white mb-4">Please sign in to view your orders</p>
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
          <h1 className="text-3xl font-bold gradient-text mb-2">My Orders</h1>
          <p className="text-slate-400">Track and manage your orders</p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
          </div>
        ) : orders.length === 0 ? (
          <Card className="glass border-white/10 text-center p-8">
            <CardContent>
              <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-400 mb-4">No orders found</p>
              <Button asChild>
                <Link href="/">Start Shopping</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <Card key={order.id} className="glass border-white/10">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white flex items-center gap-2">
                        Order #{order.id}
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1 capitalize">{order.status}</span>
                        </Badge>
                      </CardTitle>
                      <p className="text-slate-400 text-sm">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">{formatPrice(order.total)}</p>
                      <p className="text-slate-400 text-sm">{order.items.length} items</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Order Items */}
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center text-sm">
                          <span className="text-slate-300">
                            {item.productName} {item.size && `(${item.size})`} x {item.quantity}
                          </span>
                          <span className="text-white">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>

                    {/* Shipping Address */}
                    <div className="border-t border-white/10 pt-4">
                      <h4 className="text-white font-medium mb-2">Shipping Address</h4>
                      <p className="text-slate-400 text-sm">
                        {order.shippingAddress.name}
                        <br />
                        {order.shippingAddress.addressLine1}
                        <br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="border-t border-white/10 pt-4 space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Subtotal:</span>
                        <span className="text-white">{formatPrice(order.subtotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Shipping:</span>
                        <span className="text-white">{formatPrice(order.shippingCost)}</span>
                      </div>
                      {order.tax > 0 && (
                        <div className="flex justify-between">
                          <span className="text-slate-400">Tax:</span>
                          <span className="text-white">{formatPrice(order.tax)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-bold border-t border-white/10 pt-1">
                        <span className="text-white">Total:</span>
                        <span className="text-white">{formatPrice(order.total)}</span>
                      </div>
                    </div>

                    {/* Tracking Info */}
                    {order.trackingNumber && (
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-slate-400 text-sm">
                          Tracking Number: <span className="text-white">{order.trackingNumber}</span>
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
