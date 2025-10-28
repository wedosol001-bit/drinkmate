"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface QualitySlideshowItem {
  id: number
  src: string
  alt: string
  mobileSrc?: string
  mobileAlt?: string
}

interface QualitySlideshowProps {
  items: QualitySlideshowItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
  containerHeight?: string // e.g., "h-[300px] md:h-[400px] lg:h-[450px]"
}

export default function QualitySlideshow({ 
  items, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  className = "",
  containerHeight = "h-[300px] md:h-[400px] lg:h-[450px]"
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
        className={`relative w-full ${containerHeight} overflow-hidden bg-gray-50 flex items-center justify-center`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 duration-500 ease-in-out transition-opacity flex items-center justify-center ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Desktop Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                className="object-contain"
                priority={index === 0}
                quality={95}
                sizes="100vw"
              />
            </div>
            
            {/* Mobile Image (if provided) */}
            {item.mobileSrc && (
              <div className="relative w-full h-full flex items-center justify-center md:hidden">
                <Image
                  src={item.mobileSrc}
                  alt={item.mobileAlt || item.alt}
                  fill
                  className="object-contain"
                  priority={index === 0}
                  quality={95}
                  sizes="100vw"
                />
              </div>
            )}
          </div>
        ))}
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
