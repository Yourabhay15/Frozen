import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden bg-black py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.16),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.12),_transparent_28%)]" />
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />

      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">Premium Streetwear Collection</span>
          </div>

          <h1 className="mb-8 text-5xl font-bold leading-[0.95] text-white sm:text-6xl md:text-7xl lg:text-8xl">
            <span className="block">FROZEN</span>
            <span className="mt-2 block text-gray-300">THREAD</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-gray-300 sm:text-xl">
            Authentic streetwear for the bold. Premium quality meets urban style in every piece.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="rounded-full bg-white px-8 py-4 text-lg font-semibold text-black hover:bg-gray-200 hover-lift group"
            >
              <Link href="/?category=all">
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="rounded-full border-white/40 bg-transparent px-8 py-4 text-lg font-semibold text-white hover:bg-white hover:text-black"
            >
              <Link href="/?new=true">New Drops</Link>
            </Button>
          </div>

          <div className="mx-auto mt-14 grid max-w-lg grid-cols-3 gap-4 sm:gap-8">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">1000+</div>
              <div className="text-sm text-gray-400">Designs</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">25K+</div>
              <div className="text-sm text-gray-400">Customers</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-white">4.8★</div>
              <div className="text-sm text-gray-400">Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute left-8 top-20 h-20 w-20 rounded-full bg-white/10 blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-10 h-32 w-32 rounded-full bg-white/10 blur-xl animate-pulse delay-1000" />
      <div className="absolute left-1/4 top-1/2 h-16 w-16 rounded-full bg-white/10 blur-xl animate-pulse delay-500" />
    </section>
  )
}
