"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { BANNER_SLIDER_HEIGHT_CLASS } from "@/lib/constants/banner-styles"

interface QualitySlideshowItem {
  id: number
  src: string
  alt: string
  mobileSrc?: string
  mobileAlt?: string
  /** When set, the slide is wrapped in a link to this href (e.g. shop category). */
  href?: string
}

interface QualitySlideshowProps {
  items: QualitySlideshowItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
  containerHeight?: string // e.g., "h-[300px] md:h-[400px]" or "min-h-[120px] aspect-[3/1] sm:aspect-auto sm:h-[260px]"
  /** On mobile use object-contain (full image visible); sm+ use object-cover. Matches category banner mobile style. */
  mobileContain?: boolean
}

export default function QualitySlideshow({ 
  items, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  className = "",
  containerHeight = BANNER_SLIDER_HEIGHT_CLASS,
  mobileContain = false,
}: QualitySlideshowProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1))
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [autoPlay, autoPlayInterval, items.length])

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === items.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? items.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50
    const isRightSwipe = distance < -50

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  return (
    <div className={`relative w-full ${className}`}>
      {/* Slideshow container with centered content */}
      <div 
        className={`relative w-full ${containerHeight} overflow-hidden bg-white`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => {
          const slideContent = (
            <>
              {/* Main image: full width, fills slide like div bg; buttons sit over it */}
              <div className="absolute inset-0 overflow-hidden bg-gray-100">
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className={mobileContain ? "object-contain object-center sm:object-cover" : "object-cover object-center"}
                  priority={index === 0}
                  quality={95}
                  sizes="100vw"
                />
              </div>
              {/* Mobile Image (if provided) */}
              {item.mobileSrc && (
                <div className="absolute inset-0 overflow-hidden bg-gray-100 md:hidden">
                  <Image
                    src={item.mobileSrc}
                    alt={item.mobileAlt || item.alt}
                    fill
                    className={mobileContain ? "object-contain object-center sm:object-cover" : "object-cover object-center"}
                    priority={index === 0}
                    quality={95}
                    sizes="100vw"
                  />
                </div>
              )}
            </>
          )
          return (
            <div
              key={item.id}
              className={`absolute inset-0 overflow-hidden duration-500 ease-in-out transition-opacity ${
                index === currentSlide ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
              }`}
            >
              {item.href ? (
                <Link href={item.href} className="block relative w-full h-full focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-cyan-500">
                  {slideContent}
                </Link>
              ) : (
                slideContent
              )}
            </div>
          )
        })}
      </div>

      {/* Navigation buttons */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            className="absolute top-1/2 left-4 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 transform -translate-y-1/2 hover:scale-110"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          <button
            type="button"
            className="absolute top-1/2 right-4 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow-lg transition-all duration-200 transform -translate-y-1/2 hover:scale-110"
            onClick={nextSlide}
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5 text-gray-800" />
          </button>
        </>
      )}

      {/* Slide indicators */}
      {items.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {items.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? "bg-white scale-125 shadow-lg" 
                  : "bg-white/60 hover:bg-white/80"
              }`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
