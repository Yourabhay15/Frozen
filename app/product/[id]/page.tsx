import { notFound } from "next/navigation"
import { getProductById } from "@/lib/data"
import ProductDetails from "@/components/product-details"
import type { Metadata } from "next"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductById(id)

  if (!product) {
    return {
      title: "Product Not Found - FROZEN THREAD",
    }
  }

  return {
    title: `${product.name} - FROZEN THREAD`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <ProductDetails product={product} />
    </div>
  )
}
