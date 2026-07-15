import { Suspense } from "react"
import ProductGrid from "@/components/product-grid"
import ImageSlider from "@/components/image-slider"
import CategoryDropdown from "@/components/category-dropdown"
import PriceDropdown from "@/components/price-dropdown"
import FiltersDropdown from "@/components/filters-dropdown"
import LoadingSkeleton from "@/components/loading-skeleton"
import ProductCard from "@/components/product-card"
import Image from "next/image"
import Link from "next/link"

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string; price?: string; new?: string; sale?: string; instock?: string }>
}) {
  // Fetch products from the API
  const res = await fetch("http://localhost:3000/api/products", { cache: "no-store" });
  let products = [];
  try {
    const responseText = await res.text();
    products = JSON.parse(responseText);
  } catch (e) {
    console.error("Failed to parse JSON from /api/products:", e);
  }

  const params = await searchParams;
  const searchQuery = params.search || ""
  const activeCategory = params.category && params.category !== "all" ? params.category : undefined
  
  const filters = {
    category: activeCategory,
    minPrice: params.price ? Number(params.price.split("-")[0]) : undefined,
    maxPrice: params.price && !params.price.endsWith("+") ? Number(params.price.split("-")[1]) : undefined,
    inStock: params.instock === "true",
    onSale: params.sale === "true",
    isNew: params.new === "true",
  }

  // Filter products locally based on query params
  const filteredProducts = products.filter((p: any) => {
    // 1. Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      const matchesName = p.name?.toLowerCase().includes(query)
      const matchesDesc = p.description?.toLowerCase().includes(query)
      const matchesCat = p.category?.toLowerCase().includes(query) || p.categoryId?.toLowerCase().includes(query)
      if (!matchesName && !matchesDesc && !matchesCat) return false
    }
    // 2. Category
    if (filters.category) {
      // Check if product's category matches
      const matchesCat = p.category === filters.category || p.categoryId === filters.category
      if (!matchesCat) return false
    }
    // 3. Price
    if (filters.minPrice !== undefined && p.price < filters.minPrice) return false
    if (filters.maxPrice !== undefined && p.price > filters.maxPrice) return false
    // 4. In Stock
    if (filters.inStock && p.inventory <= 0) return false
    // 5. On Sale
    if (filters.onSale && !p.discountId && !p.discount) return false
    // 6. New Drops
    if (filters.isNew && !p.isNew) return false

    return true
  })

  // Check if we are showing a filtered/searched list, or the homepage landing structure
  const isFiltering = searchQuery || activeCategory || filters.minPrice !== undefined || filters.maxPrice !== undefined || filters.inStock || filters.onSale || filters.isNew

  if (isFiltering) {
    return (
      <div className="min-h-screen bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-8">
            <div className="border-b border-white/10 pb-4">
              <h1 className="text-3xl font-bold tracking-tight text-white mb-2 stage-wander">
                {activeCategory ? activeCategory.toUpperCase() : "SEARCH RESULTS"}
              </h1>
              <p className="text-gray-400 text-sm">
                Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap gap-4 items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10">
              <div className="flex flex-wrap gap-3">
                <CategoryDropdown />
                <PriceDropdown />
                <FiltersDropdown />
              </div>
              <Link href="/" className="text-xs text-gray-400 hover:text-white underline">Clear all filters</Link>
            </div>

            {/* Products Grid */}
            <div>
              {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white/5 rounded-xl border border-white/5 text-gray-500">
                  No products match your selected filters.
                </div>
              ) : (
                <Suspense fallback={<LoadingSkeleton />}>
                  <ProductGrid products={filteredProducts} />
                </Suspense>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Original homepage landing page structure
  const newArrivalNames = [
    "Stitch  Art",
    "Demon Slayer - Tanjiro",
    "Porsche",
    "Harry Potter HOGWARTS",
    "OnePiece - ZORO",
    "Spooky Ghost Diffy the Oddy",
    "OnePiece - LUFFYd"
  ]
  
  const mostSellingNames = [
    "Dare to Disturb",
    "PowerPuff Girls",
    "Cartoon  Caus",
    "Harry Potter HOGWARTS",
    "SPOOKY Ghost Smoking Kills",
    "FT Comic"
  ]

  const newArrivals = filteredProducts.filter((p: any) => newArrivalNames.includes(p.name))
  const mostSelling = filteredProducts.filter((p: any) => mostSellingNames.includes(p.name))

  const categoriesData = [
    {
      name: "Cartoon Caus MERCH",
      image: "/assets/Picsart_25-05-30_00-42-41-167__1_-removebg-preview_xtrfke.png"
    },
    {
      name: "Harry Potter MERCH",
      image: "/assets/Picsart_25-06-28_13-07-29-502-removebg-preview_zqjjhl.png"
    },
    {
      name: "Spooky MERCH",
      image: "/assets/Picsart_25-05-30_14-29-30-555-removebg-preview_d10kpk.png"
    },
    {
      name: "Anime MERCH",
      image: "/assets/Picsart_25-06-14_12-37-55-103-removebg-preview_yz6dot.png"
    }
  ]

  return (
    <div className="min-h-screen bg-black">
      {/* Auto-sliding hero image slider */}
      <ImageSlider />

      {/* Sub-slider banner */}
      <div className="bg-black text-white text-center w-full stage-wander text-lg sm:text-2xl py-6 border-b border-white/10 tracking-widest">
        UNRAVELING STITCH BY STITCH
      </div>

      {/* New Arrivals Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold w-full text-center p-2 mb-8 text-white anton-regular tracking-wider">
            NEW ARRIVALS
          </h2>
          
          <div className="overflow-x-auto no-scrollbar pb-6 flex gap-6 snap-x snap-mandatory">
            {newArrivals.map((product: any) => (
              <div key={product.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-black border-t border-b border-white/10">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold w-full text-center p-4 mb-8 bg-white text-black anton-regular tracking-wider">
            CATEGORIES
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categoriesData.map((cat) => (
              <Link 
                key={cat.name} 
                href={`/?category=${encodeURIComponent(cat.name)}`}
                className="group flex flex-col items-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:scale-105"
              >
                <h4 className="w-full text-center text-lg font-bold text-white mb-4 tracking-wider copperplate-bold group-hover:text-white transition-colors">
                  {cat.name}
                </h4>
                <div className="relative w-full h-64 overflow-hidden rounded-xl">
                  <Image 
                    src={cat.image} 
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-contain w-full h-full scale-100 group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Most Selling Tees Section */}
      <section className="py-12 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold w-full text-center p-4 mb-8 bg-white text-black anton-regular tracking-wider">
            MOST SELLING TEES
          </h2>
          
          <div className="overflow-x-auto no-scrollbar pb-6 flex gap-6 snap-x snap-mandatory">
            {mostSelling.map((product: any) => (
              <div key={product.id} className="w-[280px] sm:w-[320px] shrink-0 snap-start">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="py-16 bg-white text-black border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 lg:items-center">
            
            {/* Contact details */}
            <div className="w-full lg:w-1/2 lg:pr-8 lg:border-r border-black/10">
              <h3 className="text-4xl sm:text-5xl font-bold tracking-widest stage-wander text-black leading-tight">
                Get In Touch
              </h3>
              <p className="text-2xl mt-6 text-slate-800 anton-regular tracking-wide">
                We&apos;re excited to talk with you.
              </p>
              <p className="text-lg text-slate-600 mt-4 leading-relaxed">
                Contact us for your queries and orders. Use the form to send us a message, and we&apos;ll get back to you as soon as possible.
              </p>
              <div className="mt-8 flex flex-col gap-2 text-sm text-slate-500 font-medium">
                <p>📧 hello@frozenthread.com</p>
                <p>📱 @thefrozenthread</p>
                <p>🚚 Free shipping across India on ₹2000+</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="w-full lg:w-1/2 lg:pl-8">
              <form action="https://formspree.io/f/xovpppkq" method="POST" className="flex flex-col gap-5">
                <div className="flex flex-col">
                  <label htmlFor="name" className="mb-1 font-semibold text-sm text-slate-700">Enter Name</label>
                  <input 
                    id="name" 
                    type="text" 
                    name="name" 
                    placeholder="Enter your Name" 
                    className="w-full px-3 py-2.5 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                    required 
                  />
                </div>
                
                <div className="flex flex-col">
                  <label htmlFor="email" className="mb-1 font-semibold text-sm text-slate-700">Enter your E-mail Id</label>
                  <input 
                    id="email" 
                    type="email" 
                    name="email" 
                    placeholder="Enter your Email" 
                    className="w-full px-3 py-2.5 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                    required 
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="phone" className="mb-1 font-semibold text-sm text-slate-700">Enter Phone Number (Optional)</label>
                  <input 
                    id="phone" 
                    type="tel" 
                    name="phone" 
                    placeholder="Enter your Phone Number" 
                    className="w-full px-3 py-2.5 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                  />
                </div>

                <div className="flex flex-col">
                  <label htmlFor="message" className="mb-1 font-semibold text-sm text-slate-700">Product Inquiry</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4} 
                    placeholder="e.g., Hi, I am interested in the Spooky Ghost t-shirt in size Large..." 
                    className="w-full px-3 py-2.5 border border-black/20 rounded-md focus:outline-none focus:ring-2 focus:ring-black bg-white text-black"
                    required
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  className="bg-black text-white px-6 py-3 font-semibold text-lg cursor-pointer rounded-md w-full hover:bg-slate-800 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] shadow-md shadow-black/10"
                >
                  Send Inquiry
                </button>
              </form>
            </div>
            
          </div>
        </div>
      </section>
    </div>
  )
}
