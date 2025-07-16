"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react"
import ImageZoom from "./image-zoom"
import Image from "next/image"
import type { Product } from "@/lib/types"

interface ProductImageGalleryProps {
  product: Product
}

export default function ProductImageGallery({ product }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  return (
    <>
      <div className="space-y-4">
        {/* Main Image with Zoom */}
        <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-900 group">
          <ImageZoom
            src={product.images[currentImageIndex] || "/placeholder.svg?height=600&width=600"}
            alt={product.name}
            className="w-full h-full"
            zoomScale={2.5}
          />

          {/* Navigation Buttons */}
          {product.images.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                onClick={prevImage}
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
                onClick={nextImage}
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </Button>
            </>
          )}

          {/* Fullscreen Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute bottom-4 right-4 bg-black/80 hover:bg-black border-white/20 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10"
            onClick={openFullscreen}
          >
            <Maximize2 className="h-4 w-4 text-white" />
          </Button>

          {/* Product Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isNew && <Badge className="bg-white text-black font-semibold">NEW</Badge>}
            {(product.discount && product.discount > 0) && <Badge className="bg-red-600 text-white">-{product.discount}%</Badge>}
            {product.inventory === 0 && <Badge variant="destructive">OUT OF STOCK</Badge>}
          </div>

          {/* Image Counter */}
          {product.images.length > 1 && (
            <div className="absolute bottom-4 left-4 bg-black/80 text-white px-3 py-1 rounded-md text-sm z-10">
              {currentImageIndex + 1} / {product.images.length}
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        {product.images.length > 1 && (
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${
                  index === currentImageIndex ? "border-white shadow-lg" : "border-gray-600 hover:border-gray-400"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg?height=80&width=80"}
                  alt={`${product.name} ${index + 1}`}
                  width={80}
                  height={80}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center">
            <ImageZoom
              src={product.images[currentImageIndex] || "/placeholder.svg?height=800&width=800"}
              alt={product.name}
              className="w-full h-full max-w-3xl max-h-3xl"
              zoomScale={3}
            />

            {/* Close Button */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 bg-black/80 hover:bg-black border-white/20"
              onClick={closeFullscreen}
            >
              <ChevronLeft className="h-4 w-4 text-white rotate-45" />
            </Button>

            {/* Navigation in Fullscreen */}
            {product.images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black border-white/20"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-4 w-4 text-white" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/80 hover:bg-black border-white/20"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-4 w-4 text-white" />
                </Button>
              </>
            )}

            {/* Image Info */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-md">
              <p className="text-sm font-medium">{product.name}</p>
              {product.images.length > 1 && (
                <p className="text-xs text-gray-300">
                  {currentImageIndex + 1} of {product.images.length}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
