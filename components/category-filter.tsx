"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const categories = [
  { name: "All Products", value: "all", count: 48 },
  { name: "Hoodies", value: "hoodies", count: 12 },
  { name: "T-Shirts", value: "tshirts", count: 15 },
  { name: "Pants", value: "pants", count: 10 },
  { name: "Jackets", value: "jackets", count: 6 },
  { name: "Accessories", value: "accessories", count: 8 },
  { name: "Sweatshirts", value: "sweatshirts", count: 7 },
]

const priceRanges = [
  { name: "Under ₹1000", value: "0-1000" },
  { name: "₹1000 - ₹2000", value: "1000-2000" },
  { name: "₹2000 - ₹3000", value: "2000-3000" },
  { name: "Over ₹3000", value: "3000+" },
]

export default function CategoryFilter() {
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category") || "all"

  return (
    <div className="space-y-6">
      {/* Categories */}
      <Card className="glass border-white/10 bg-black">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            Categories
            <Badge variant="secondary" className="glass bg-gray-800 text-white">
              {categories.find((c) => c.value === currentCategory)?.count || 0}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {categories.map((category) => (
            <Link
              key={category.value}
              href={`/?category=${category.value}`}
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all hover:bg-white/10",
                currentCategory === category.value
                  ? "bg-white/20 text-white border border-white/30"
                  : "text-gray-300 hover:text-white",
              )}
            >
              <span>{category.name}</span>
              <Badge variant="outline" className="glass text-xs border-white/20 text-gray-400">
                {category.count}
              </Badge>
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card className="glass border-white/10 bg-black">
        <CardHeader>
          <CardTitle className="text-white">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {priceRanges.map((range) => (
            <Link
              key={range.value}
              href={`/?price=${range.value}`}
              className="block px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
            >
              {range.name}
            </Link>
          ))}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="glass border-white/10 bg-black">
        <CardHeader>
          <CardTitle className="text-white">Filters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Link
            href="/?new=true"
            className="block px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            New Drops
          </Link>
          <Link
            href="/?sale=true"
            className="block px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            On Sale
          </Link>
          <Link
            href="/?instock=true"
            className="block px-3 py-2 rounded-md text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-all"
          >
            In Stock
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
