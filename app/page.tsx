import { Suspense } from "react"
// import { searchProducts } from "@/lib/database"
import ProductGrid from "@/components/product-grid"
import HeroSection from "@/components/hero-section"
import CategoryDropdown from "@/components/category-dropdown"
import PriceDropdown from "@/components/price-dropdown"
import FiltersDropdown from "@/components/filters-dropdown"
import LoadingSkeleton from "@/components/loading-skeleton"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; price?: string; new?: string; sale?: string; instock?: string }>
}) {
  // Fetch products from the API
  const res = await fetch("http://localhost:3000/api/products", { cache: "no-store" });
  console.log("Response status from /api/products:", res.status);
  const responseText = await res.text();
  console.log("Raw response text from /api/products:", responseText);
  let products = [];
  try {
    products = JSON.parse(responseText);
  } catch (e) {
    console.error("Failed to parse JSON from /api/products:", e);
    // Handle the case where responseText is not valid JSON (e.g., HTML error page)
  }

  const params = await searchParams;

  const searchQuery = params.search || ""
  const filters = {
    category: params.category && params.category !== "all" ? params.category : undefined,
    minPrice: params.price ? Number(params.price.split("-")[0]) : undefined,
    maxPrice:
      params.price && !params.price.endsWith("+") ? Number(params.price.split("-")[1]) : undefined,
    inStock: params.instock === "true",
    onSale: params.sale === "true",
    isNew: params.new === "true",
  }

  // const filteredProducts = await searchProducts(searchQuery, filters)

  return (
    <div className="min-h-screen">
      <HeroSection />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <CategoryDropdown />
              <PriceDropdown />
              <FiltersDropdown />
            </div>

            <div className="text-sm text-gray-400">
              {/* {products.length} product{products.length !== 1 ? "s" : ""} found */}
            </div>
          </div>

          {/* Products */}
          <div>
            <Suspense fallback={<LoadingSkeleton />}>
              <ProductGrid products={products} />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
