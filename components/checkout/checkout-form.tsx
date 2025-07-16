"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { INDIAN_STATES } from "@/lib/indian-integrations"
import PaymentOptions from "@/components/payment/payment-options"
import ShippingOptions from "@/components/shipping/shipping-options"

export default function CheckoutForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  })

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
        <ShippingOptions />
        <PaymentOptions />

        <Button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 text-lg font-semibold focus:ring-2 focus:ring-green-500 focus:outline-none">
          Pay ₹2,999
        </Button>
        <div aria-live="polite" className="sr-only" id="checkout-feedback-region"></div>
      </div>
    </div>
  )
}
