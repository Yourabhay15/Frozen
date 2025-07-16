import { type NextRequest, NextResponse } from "next/server"
import { searchProducts, getSearchSuggestions } from "@/lib/database"
import { Product, ProductFilters } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") || "products"

    if (type === "suggestions") {
      const suggestions = await getSearchSuggestions(query)
      return NextResponse.json({ success: true, data: suggestions })
    }

    // Parse filters
    const filters = {
      category: searchParams.get("category") || undefined,
      minPrice: searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : undefined,
      maxPrice: searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : undefined,
      minRating: searchParams.get("minRating") ? Number(searchParams.get("minRating")) : undefined,
      inStock: searchParams.get("inStock") === "true",
      onSale: searchParams.get("onSale") === "true",
      isNew: searchParams.get("isNew") === "true",
    }

    const products = await searchProducts(query, filters)

    // Sort products if requested
    const sortBy = searchParams.get("sortBy")
    const sortOrder = searchParams.get("sortOrder") || "asc"

    if (sortBy) {
      products.sort((a: Product, b: Product) => {
        let aValue, bValue

        switch (sortBy) {
          case "price":
            aValue = a.price
            bValue = b.price
            break
          case "rating":
            aValue = a.averageRating || 0
            bValue = b.averageRating || 0
            break
          case "newest":
            aValue = new Date(a.createdAt).getTime()
            bValue = new Date(b.createdAt).getTime()
            break
          case "popular":
            aValue = a.totalReviews || 0
            bValue = b.totalReviews || 0
            break
          default:
            return 0
        }

        return sortOrder === "desc" ? bValue - aValue : aValue - bValue
      })
    }

    return NextResponse.json({ success: true, data: products })
  } catch (error) {
    return NextResponse.json({ error: "Failed to search products" }, { status: 500 })
  }
}
