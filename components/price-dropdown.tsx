"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronDown, IndianRupee } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const priceRanges = [
  { name: "All Prices", value: "all" },
  { name: "Under ₹1000", value: "0-1000" },
  { name: "₹1000 - ₹2000", value: "1000-2000" },
  { name: "₹2000 - ₹3000", value: "2000-3000" },
  { name: "Over ₹3000", value: "3000+" },
]

export default function PriceDropdown() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentPrice = searchParams.get("price") || "all"

  const currentPriceName = priceRanges.find((p) => p.value === currentPrice)?.name || "All Prices"

  const handlePriceSelect = (priceValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (priceValue === "all") {
      params.delete("price")
    } else {
      params.set("price", priceValue)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10 bg-black/50">
          <IndianRupee className="mr-2 h-4 w-4" />
          {currentPriceName}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass border-white/20 bg-black/90 backdrop-blur-md w-48">
        <div className="p-2">
          <p className="text-sm font-medium text-white mb-2">Price Range</p>
          {priceRanges.map((range) => (
            <DropdownMenuItem
              key={range.value}
              onClick={() => handlePriceSelect(range.value)}
              className={`px-3 py-2 rounded-md text-sm transition-all cursor-pointer ${
                currentPrice === range.value
                  ? "bg-white/20 text-white"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {range.name}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
