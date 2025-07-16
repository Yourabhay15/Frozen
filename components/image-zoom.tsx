"use client"

import { useState, useRef, type MouseEvent } from "react"
import Image from "next/image"

interface ImageZoomProps {
  src: string
  alt: string
  className?: string
  zoomScale?: number
}

export default function ImageZoom({ src, alt, className = "", zoomScale = 2 }: ImageZoomProps) {
  const [isZoomed, setIsZoomed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    setIsZoomed(true)
  }

  const handleMouseLeave = () => {
    setIsZoomed(false)
  }

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!imageRef.current) return

    const rect = imageRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setMousePosition({ x, y })
  }

  return (
    <div
      ref={imageRef}
      className={`relative overflow-hidden cursor-zoom-in ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      <div className="relative w-full h-full">
        <Image
          src={src || "/placeholder.svg"}
          alt={alt}
          fill
          className={`object-cover transition-transform duration-300 ease-out ${
            isZoomed ? `scale-${zoomScale === 2 ? "200" : "150"}` : "scale-100"
          }`}
          style={{
            transformOrigin: isZoomed ? `${mousePosition.x}% ${mousePosition.y}%` : "center",
          }}
        />

        {/* Zoom indicator */}
        {!isZoomed && (
          <div className="absolute top-4 right-4 bg-black/70 text-white px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Hover to zoom
          </div>
        )}

        {/* Zoom overlay for better UX */}
        {isZoomed && <div className="absolute inset-0 bg-transparent" />}
      </div>
    </div>
  )
}
