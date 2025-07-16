"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronDown, Sparkles } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const filters = [
  { name: "All Items", value: "all", param: "" },
  { name: "New Drops", value: "new", param: "new" },
  { name: "On Sale", value: "sale", param: "sale" },
  { name: "In Stock", value: "instock", param: "instock" },
]

export default function FiltersDropdown() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const isNew = searchParams.get("new")
  const isSale = searchParams.get("sale")
  const isInStock = searchParams.get("instock")

  let currentFilter = "all"
  if (isNew) currentFilter = "new"
  else if (isSale) currentFilter = "sale"
  else if (isInStock) currentFilter = "instock"

  const currentFilterName = filters.find((f) => f.value === currentFilter)?.name || "All Items"

  const handleFilterSelect = (filterValue: string, filterParam: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // Clear all filter params first
    params.delete("new")
    params.delete("sale")
    params.delete("instock")

    // Add the selected filter if not "all"
    if (filterParam && filterValue !== "all") {
      params.set(filterParam, "true")
    }

    router.push(`/?${params.toString()}`)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="glass border-white/20 text-white hover:bg-white/10 bg-black/50">
          <Sparkles className="mr-2 h-4 w-4" />
          {currentFilterName}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="glass border-white/20 bg-black/90 backdrop-blur-md w-40">
        <div className="p-2">
          <p className="text-sm font-medium text-white mb-2">Filters</p>
          {filters.map((filter) => (
            <DropdownMenuItem
              key={filter.value}
              onClick={() => handleFilterSelect(filter.value, filter.param)}
              className={`px-3 py-2 rounded-md text-sm transition-all cursor-pointer ${
                currentFilter === filter.value
                  ? "bg-white/20 text-white"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              {filter.name}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
