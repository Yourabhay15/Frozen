import { Suspense } from "react"
import { RefreshCcw, ShieldCheck, Truck } from "lucide-react"
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
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  const res = await fetch(`${baseUrl}/api/products`, { cache: "no-store" })
  let products = []

  try {
    products = await res.json()
  } catch (error) {
    console.error("Failed to parse products response:", error)
  }

  const params = await searchParams
  const productsCount = Array.isArray(products) ? products.length : 0

  return (
    <main id="main-content" className="min-h-screen">
      <HeroSection />

      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-[0_0_80px_rgba(255,255,255,0.06)] backdrop-blur-md md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-2 text-sm font-medium uppercase tracking-[0.3em] text-gray-400">Fresh drops</p>
              <h2 className="text-2xl font-semibold text-white sm:text-3xl">Curated streetwear for every mood</h2>
              <p className="mt-3 text-sm leading-7 text-gray-400 sm:text-base">
                Discover clean silhouettes, premium fabrics, and standout accessories built for everyday confidence.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { icon: Truck, title: "Fast dispatch", description: "Ships within 24 hours" },
                { icon: ShieldCheck, title: "Secure checkout", description: "Protected payments and privacy" },
                { icon: RefreshCcw, title: "Easy returns", description: "Hassle-free exchanges" },
              ].map(({ icon: Icon, title, description }) => (
                <div key={title} className="min-w-[180px] rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                  <div className="flex items-center gap-2 text-white">
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-semibold">{title}</span>
                  </div>
                  <p className="mt-1 text-sm text-gray-400">{description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-10 md:pb-16">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 px-4 py-4 backdrop-blur-sm">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.3em] text-gray-400">Shop</p>
              <h3 className="text-xl font-semibold text-white">Explore the collection</h3>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-3">
                <CategoryDropdown />
                <PriceDropdown />
                <FiltersDropdown />
              </div>
              <div className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300">
                {productsCount} item{productsCount === 1 ? "" : "s"}
              </div>
            </div>
          </div>

          <div>
            <Suspense fallback={<LoadingSkeleton />}>
              <ProductGrid products={products} />
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  )
}
