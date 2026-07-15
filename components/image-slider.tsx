"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  { id: 1, src: "/assets/1_20251101_195929_0000_iz8ihh.jpg", alt: "Frozen Thread Slide 1" },
  { id: 2, src: "/assets/2_20251101_195929_0001_ks1lrq.jpg", alt: "Frozen Thread Slide 2" },
  { id: 3, src: "/assets/3_20251101_195929_0002_uxjdwt.jpg", alt: "Frozen Thread Slide 3" },
  { id: 4, src: "/assets/4_20251101_195930_0003_j7enym.jpg", alt: "Frozen Thread Slide 4" },
  { id: 5, src: "/assets/5_20251101_195930_0004_yk6pmg.jpg", alt: "Frozen Thread Slide 5" },
  { id: 6, src: "/assets/6_20251101_195930_0005_tvheao.jpg", alt: "Frozen Thread Slide 6" },
]

export default function ImageSlider() {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <div className="relative w-full h-[60vh] sm:h-[80vh] md:h-[90vh] overflow-hidden bg-black group border-b border-white/10">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            priority={index === 0}
            className="object-cover object-center w-full h-full scale-100 transition-transform duration-[4000ms] ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full glass border border-white/20 text-white hover:bg-white/20 active:scale-90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full glass border border-white/20 text-white hover:bg-white/20 active:scale-90 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              index === current ? "bg-white scale-125" : "bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
