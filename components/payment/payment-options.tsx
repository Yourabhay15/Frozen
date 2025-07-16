"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { INDIAN_INTEGRATIONS } from "@/lib/indian-integrations"

export default function PaymentOptions() {
  const { payments } = INDIAN_INTEGRATIONS

  return (
    <Card className="glass border-white/10">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          💳 Payment Options
          <Badge className="bg-green-600">Indian</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {Object.entries(payments).map(([key, payment]) => (
          <div key={key} className="flex items-center justify-between p-3 glass rounded-lg border border-white/10">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{payment.logo}</span>
              <div>
                <h4 className="text-white font-medium">{payment.name}</h4>
                <p className="text-xs text-slate-400">{payment.description}</p>
                <div className="flex gap-1 mt-1">
                  {payment.features.map((feature) => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <Button size="sm" variant="outline" className="glass border-white/20 bg-transparent">
              Select
            </Button>
          </div>
        ))}

        <div className="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-500/30">
          <p className="text-green-400 text-sm font-medium">✅ 100% Secure Payment</p>
          <p className="text-green-300 text-xs">SSL Encryption & RBI Approved Gateways</p>
        </div>
      </CardContent>
    </Card>
  )
}
