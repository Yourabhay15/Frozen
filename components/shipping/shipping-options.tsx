"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { INDIAN_INTEGRATIONS } from "@/lib/indian-integrations"

export default function ShippingOptions() {
  const { shipping } = INDIAN_INTEGRATIONS

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          🚚 Delivery Options
          <Badge className="bg-blue-600">Pan India</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(shipping).map(([key, shipper]) => (
          <div key={key} className="flex items-center justify-between p-3 glass rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{shipper.logo}</span>
              <div>
                <h4 className="text-white font-medium">{shipper.name}</h4>
                <p className="text-xs text-slate-400">{shipper.description}</p>
                <Badge variant="outline" className="text-xs mt-1">
                  {shipper.deliveryTime}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">₹49</p>
              <p className="text-xs text-slate-400">Shipping</p>
            </div>
          </div>
        ))}

        <div className="mt-4 p-3 bg-blue-900/20 rounded-lg border border-blue-500/30">
          <p className="text-blue-400 text-sm font-medium">🎉 Free Delivery on ₹999+</p>
          <p className="text-blue-300 text-xs">2-3 days delivery in all major cities</p>
        </div>
      </CardContent>
    </Card>
  )
}
