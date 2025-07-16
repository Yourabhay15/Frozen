"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronDown, Filter } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const categories = [
  { name: "All Products", value: "all", count: 48 },
  { name: "Hoodies", value: "hoodies", count: 12 },
  { name: "T-Shirts", value: "tshirts", count: 15 },
  { name: "Pants", value: "pants", count: 10 },
  { name: "Jackets", value: "jackets", count: 6 },
  { name: "Accessories", value: "accessories", count: 8 },
  { name: "Sweatshirts", value: "sweatshirts", count: 7 },
]

export default function CategoryDropdown() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const currentCategory = searchParams.get("category") || "all"

  const currentCategoryName = categories.find((c) => c.value === currentCategory)?.name || "All Products"

  const handleCategorySelect = (categoryValue: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (categoryValue === "all") {
      params.delete("category")
    } else {
      params.set("category", categoryValue)
    }
    router.push(`/?${params.toString()}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10 bg-black/50">
          <Filter className="mr-2 h-4 w-4" />
          {currentCategoryName}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass border-white/20 bg-black/90 backdrop-blur-md w-56">
        <div className="p-2">
          <p className="text-sm font-medium text-white mb-2">Categories</p>
          {categories.map((category) => (
            <DropdownMenuItem
              key={category.value}
              onClick={() => handleCategorySelect(category.value)}
              className={`flex items-center justify-between px-3 py-2 rounded-md text-sm transition-all cursor-pointer ${
                currentCategory === category.value
                  ? "bg-white/20 text-white"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{category.name}</span>
              <Badge variant="outline" className="glass text-xs border-white/20 text-gray-400">
                {category.count}
              </Badge>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
