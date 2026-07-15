import Image from "next/image"
import Link from "next/link"
import type { Product } from "@/lib/types"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Eye } from "lucide-react"
import { formatPrice } from "@/lib/currency"
import WishlistButton from "@/components/wishlist/wishlist-button"
import { Star } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const price = product.price
  const isLowStock = product.inventory > 0 && product.inventory <= 5

  return (
    <Card className="group overflow-hidden rounded-[1.5rem] border border-white/10 bg-zinc-950/80 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_80px_rgba(255,255,255,0.08)]">
      <div className="relative">
        <Link href={`/product/${product.id}`}>
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.svg?height=300&width=300"}
              alt={product.name}
              aria-label={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />

            <div className="absolute right-4 top-4 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <WishlistButton productId={product.id} />
              <Button size="icon" variant="secondary" className="h-8 w-8 border-white/20 bg-black/70 glass focus:outline-none focus:ring-2 focus:ring-white" aria-label="Quick view product">
                <Eye className="h-4 w-4 text-white" />
              </Button>
            </div>

            <div className="absolute left-4 top-4 flex flex-col gap-2">
              {product.isNew && <Badge className="bg-white font-semibold text-black">NEW</Badge>}
              {product.inventory === 0 && <Badge variant="destructive">OUT OF STOCK</Badge>}
            </div>
          </div>
        </Link>

        <div className="absolute bottom-4 left-4 right-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button asChild className="w-full rounded-full bg-white font-semibold text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-black" disabled={product.inventory === 0} aria-disabled={product.inventory === 0} aria-label={product.inventory === 0 ? "Out of stock" : "View product"}>
            <Link href={`/product/${product.id}`}>
              <ShoppingCart className="mr-2 h-4 w-4" />
              {product.inventory === 0 ? "OUT OF STOCK" : "VIEW PRODUCT"}
            </Link>
          </Button>
        </div>
      </div>

      <CardContent className="bg-zinc-950/70 p-5">
        <Link href={`/product/${product.id}`}>
          <h3 className="mb-2 line-clamp-1 text-lg font-semibold text-white transition-colors group-hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-white" tabIndex={0} aria-label={product.name}>
            {product.name}
          </h3>
        </Link>
        <p className="mb-3 line-clamp-2 text-sm text-gray-400">{product.description}</p>
        <Badge variant="secondary" className="border-white/10 bg-white/5 text-xs text-gray-300">
          {product.category?.toUpperCase?.() || ""}
        </Badge>
        {product.averageRating && product.averageRating > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <Star className="h-3 w-3 fill-current text-yellow-400" />
            <span className="text-sm text-gray-300">{product.averageRating}</span>
            <span className="text-xs text-gray-500">({product.totalReviews} reviews)</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="bg-zinc-950/70 p-5 pt-0">
        <div className="flex w-full items-center justify-between">
          <span className="text-xl font-bold text-white">{formatPrice(price)}</span>
          {isLowStock && (
            <Badge variant="outline" className="border-orange-400 bg-orange-400/10 text-orange-400">
              ONLY {product.inventory} LEFT
            </Badge>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
