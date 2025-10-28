"use client"

import React, { useState, useEffect } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface SlideshowItem {
  id: number
  src: string
  alt: string
  mobileSrc?: string
  mobileAlt?: string
}

interface ViewportSlideshowProps {
  items: SlideshowItem[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
  baseHeight?: string // e.g., "h-[200px] md:h-[250px] lg:h-[300px]"
}

export default function ViewportSlideshow({ 
  items, 
  autoPlay = true, 
  autoPlayInterval = 5000,
  className = "",
  baseHeight = "h-[200px] md:h-[250px] lg:h-[300px]"
}: ViewportSlideshowProps) {
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
      {/* Slideshow container */}
      <div 
        className={`relative w-full ${baseHeight} overflow-hidden`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            className={`absolute inset-0 duration-300 ease-in-out transition-opacity ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            {/* Desktop Image */}
            <Image
              src={item.src}
              alt={item.alt}
              fill
              className="w-full h-full"
              priority={index === 0}
              quality={90}
              style={{
                objectFit: 'fill', // This stretches the image to fill the container exactly
                objectPosition: 'center'
              }}
            />
            
            {/* Mobile Image (if provided) */}
            {item.mobileSrc && (
              <Image
                src={item.mobileSrc}
                alt={item.mobileAlt || item.alt}
                fill
                className="w-full h-full md:hidden"
                priority={index === 0}
                quality={90}
                style={{
                  objectFit: 'fill', // This stretches the image to fill the container exactly
                  objectPosition: 'center'
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            className="absolute top-1/2 left-4 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-200 transform -translate-y-1/2 hover:scale-110"
            onClick={prevSlide}
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5 text-gray-800" />
          </button>

          <button
            type="button"
            className="absolute top-1/2 right-4 z-30 flex items-center justify-center w-10 h-10 rounded-full bg-white/80 hover:bg-white shadow-lg transition-all duration-200 transform -translate-y-1/2 hover:scale-110"
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
