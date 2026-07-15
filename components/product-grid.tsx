import { PackageSearch } from "lucide-react"
import type { Product } from "@/lib/types"
import ProductCard from "./product-card"

interface ProductGridProps {
  products: Product[]
}

export default function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-[2rem] border border-dashed border-white/15 bg-white/[0.03] px-6 py-16 text-center backdrop-blur-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
          <PackageSearch className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-xl font-semibold text-white">No products found</h3>
        <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-gray-400">
          Try changing the filters or browsing a different category to discover more pieces.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
