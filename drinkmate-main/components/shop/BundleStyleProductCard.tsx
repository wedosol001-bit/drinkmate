"use client"

import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { ProductCardProps, Product } from "@/lib/types"
import { useTranslation } from "@/lib/contexts/translation-context"

// Define Variant interface locally since it was removed
interface Variant {
  id: string
  colorName?: string
  colorHex?: string
  image?: string
  price: number
  compareAtPrice?: number
  inStock: boolean
}
import { cn } from "@/lib/utils"
import { Star, ShoppingCart, Heart, Eye, Zap, Award, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import SaudiRiyal from "@/components/ui/SaudiRiyal"
import { getProductImageUrl } from "@/lib/utils/image-utils"
import styles from "@/components/ui/product-image-zoom.module.css"

// Helper function to generate correct product URL based on category
import { getProductUrl as getProductUrlFromUtils } from '@/lib/utils/product-url'

const getProductUrl = (product: Product): string => {
  return getProductUrlFromUtils(product)
}

export default function BundleStyleProductCard({
  product,
  dir = "ltr",
  onAddToCart,
  className,
  onAddToWishlist,
  onAddToComparison,
  onProductView,
  isInWishlist = false,
  isInComparison = false,
  buttonClassName,
}: ProductCardProps & {
  onAddToWishlist?: (product: Product) => void
  onAddToComparison?: (product: Product) => void
  onProductView?: (product: Product) => void
  isInWishlist?: boolean
  isInComparison?: boolean
  buttonClassName?: string
}) {
  const router = useRouter()
  const { isRTL: isRTLFromContext, t } = useTranslation()
  const hasVariants = (product.variants?.length ?? 0) > 0
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoadError, setImageLoadError] = useState(false)
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showOverlay, setShowOverlay] = useState(false)
  
  // Use dir prop if provided, otherwise use context
  const isRTL = dir === "rtl" || isRTLFromContext

  // Get display name - use Arabic if RTL and nameAr exists, otherwise use title
  // Priority: nameAr (if RTL) > title > name
  const displayName = (() => {
    // Always check for nameAr first when RTL, regardless of what title is set to
    if (dir === "rtl") {
      const arabicName = (product as any)?.nameAr
      if (arabicName) {
        return arabicName
      }
    }
    // Fallback to title or name
    return product.title || product.name || ''
  })()

  // Get the best available image
  const getBestImage = () => {
    if (imageLoadError) return "/placeholder.svg"
    
    // Get image using utility function
    let imageUrl = getProductImageUrl(product, "/placeholder.svg")
    
    // Ensure we have a valid image URL
    if (!imageUrl || imageUrl.trim() === '' || imageUrl === '/placeholder.svg') {
      // Fallback: try to get image from images array directly
      if (product.images && Array.isArray(product.images) && product.images.length > 0) {
        const firstImg = product.images[0]
        if (typeof firstImg === 'string' && firstImg.trim() !== '') {
          imageUrl = firstImg
        } else if (firstImg && typeof firstImg === 'object' && firstImg.url) {
          imageUrl = firstImg.url
        }
      }
      // Final fallback
      if (!imageUrl || imageUrl.trim() === '') {
        imageUrl = product.image || "/placeholder.svg"
      }
    }
    
    return imageUrl || "/placeholder.svg"
  }

  const onAdd = async (e: React.MouseEvent) => {
    console.log('Add to cart button clicked!', { 
      productId: product.id, 
      productTitle: product.title,
      onAddToCart: !!onAddToCart, 
      isAddingToCart 
    })
    e.preventDefault()
    e.stopPropagation()
    
    // If product has variants, navigate to product detail page to select variant
    if (hasVariants) {
      router.push(getProductUrl(product))
      return
    }

    if (onAddToCart && !isAddingToCart) {
      const payload = {
        productId: String(product._id || product.id || ''),
        variantId: undefined,
        qty: 1,
        isBundle: false
      }
      console.log('Calling onAddToCart with payload:', payload)
      setIsAddingToCart(true)
      try {
        await onAddToCart(payload)
        console.log('onAddToCart completed successfully')
      } catch (error) {
        console.error('Error in onAddToCart:', error)
      } finally {
        setTimeout(() => setIsAddingToCart(false), 1000)
      }
    } else {
      console.log('onAddToCart not called because:', { onAddToCart: !!onAddToCart, isAddingToCart })
    }
  }

  // Pricing helpers
  const isSale = !hasVariants && product.compareAtPrice && product.compareAtPrice > product.price
  const percentOff = isSale && product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0

  const variantPrices = hasVariants ? (product.variants || []).map(v => Number(v.price) || 0).filter(p => p > 0) : []
  const minVariantPrice = hasVariants && variantPrices.length > 0 ? Math.min(...variantPrices) : undefined
  const maxVariantPrice = hasVariants && variantPrices.length > 0 ? Math.max(...variantPrices) : undefined

  const isInStock = product.inStock
  
  console.log('BundleStyleProductCard - product:', product)
  console.log('BundleStyleProductCard - isInStock:', isInStock)
  console.log('BundleStyleProductCard - isAddingToCart:', isAddingToCart)
  console.log('BundleStyleProductCard - button disabled:', !isInStock || isAddingToCart)

  return (
    <div
      dir={dir}
      className={cn(
        "group bg-white rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col border border-gray-100/80",
        "hover:border-cyan-200/60 transform hover:-translate-y-1 sm:hover:-translate-y-2 transition-all duration-500 ease-out",
        "min-h-0 sm:min-h-[540px] lg:min-h-[580px] shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl hover:shadow-cyan-500/20",
        "relative",
        className
      )}
      onMouseEnter={() => {
        setIsHovered(true)
        setShowOverlay(true)
      }}
      onMouseLeave={() => {
        setIsHovered(false)
        setShowOverlay(false)
      }}
      role="article"
      aria-labelledby={`product-title-${product.id}`}
    >
      {/* Premium Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/20 via-transparent to-blue-50/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      
      {/* Image Container */}
      <div className="relative">
        <Link href={getProductUrl(product)} className="block">
          <div className={`relative h-[120px] sm:h-[260px] lg:h-[280px] bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden p-2 sm:p-4 ${styles.productImageContainer}`}>
            <Image
              src={getBestImage()}
              alt={product.title || product.name || 'Product image'}
              fill
              className={`object-contain object-top transition-transform duration-500 ${styles.productImageZoom}`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              onError={() => setImageLoadError(true)}
              onLoad={() => setImageLoadError(false)}
            />
            
            {/* Premium Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Product Badges */}
            {product.badges && product.badges.length > 0 && (
              <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex flex-col gap-1 sm:gap-2">
                {product.badges.map((badge, index) => {
                  const getBadgeStyle = (badgeText: string) => {
                    const lowerBadge = badgeText.toLowerCase()
                    if (lowerBadge.includes('bestseller')) {
                      return {
                        bg: "bg-gradient-to-r from-amber-500 to-yellow-500",
                        icon: <Award className="w-3 h-3" />
                      }
                    }
                    if (lowerBadge.includes('featured')) {
                      return {
                        bg: "bg-gradient-to-r from-cyan-500 to-blue-500",
                        icon: <Award className="w-3 h-3" />
                      }
                    }
                    if (lowerBadge.includes('new')) {
                      return {
                        bg: "bg-gradient-to-r from-green-500 to-emerald-500",
                        icon: <Zap className="w-3 h-3" />
                      }
                    }
                    if (lowerBadge.includes('limited')) {
                      return {
                        bg: "bg-gradient-to-r from-purple-500 to-violet-500",
                        icon: <Award className="w-3 h-3" />
                      }
                    }
                    if (lowerBadge.includes('premium')) {
                      return {
                        bg: "bg-gradient-to-r from-rose-500 to-pink-500",
                        icon: <Award className="w-3 h-3" />
                      }
                    }
                    if (lowerBadge.includes('sale') || lowerBadge.includes('off')) {
                      return {
                        bg: "bg-gradient-to-r from-red-500 to-pink-500",
                        icon: <Zap className="w-3 h-3" />
                      }
                    }
                    // Default style
                    return {
                      bg: "bg-gradient-to-r from-cyan-500 to-cyan-400",
                      icon: <Award className="w-3 h-3" />
                    }
                  }
                  
                  const badgeStyle = getBadgeStyle(badge)
                  
                  return (
                    <div
                      key={index}
                      className={cn(
                        "rounded-full text-white text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 font-bold shadow-lg sm:shadow-xl backdrop-blur-sm border border-white/20 flex items-center gap-0.5 sm:gap-1",
                        badgeStyle.bg
                      )}
                    >
                      {badgeStyle.icon}
                      <span className="truncate">{badge}</span>
                    </div>
                  )
                })}
              </div>
            )}

          </div>
        </Link>

        {/* Quick Actions Overlay - Outside of Link */}
        <div className={cn(
          "absolute inset-0 bg-black/40 flex items-center justify-center gap-3 transition-all duration-300",
          "backdrop-blur-sm pointer-events-none",
          showOverlay ? "opacity-100 pointer-events-auto" : "opacity-0"
        )}>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-1.5 sm:p-3 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 min-w-0 h-8 w-8 sm:h-10 sm:w-10 sm:min-w-[2.5rem]"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onAddToWishlist?.(product as Product)
            }}
          >
            <Heart className={cn("w-3.5 h-3.5 sm:w-5 sm:h-5", isInWishlist ? "fill-red-500 text-red-500" : "text-gray-700")} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/90 hover:bg-white text-gray-900 rounded-full p-1.5 sm:p-3 shadow-md sm:shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 min-w-0 h-8 w-8 sm:h-10 sm:w-10 sm:min-w-[2.5rem]"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onProductView?.(product as Product)
            }}
          >
            <Eye className="w-3.5 h-3.5 sm:w-5 sm:h-5 text-gray-700" />
          </Button>
        </div>
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-6 flex-1 flex flex-col relative z-10 min-h-0 pb-3 sm:pb-6">
        {/* Product Name */}
        <Link href={getProductUrl(product)} className="block mb-2 sm:mb-3 group">
          <h3 
            id={`product-title-${product.id}`}
            className={`font-bold text-sm sm:text-xl text-gray-900 group-hover:text-cyan-600 transition-colors leading-tight tracking-tight line-clamp-2 ${dir === "rtl" ? "font-cairo" : "text-left font-montserrat"}`}
          >
            {displayName}
          </h3>
        </Link>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-1.5 sm:gap-3 mb-2 sm:mb-3 flex-wrap">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => {
              const rating = typeof product.rating === 'number' ? product.rating : 
                           typeof product.rating === 'object' && product.rating?.average ? product.rating.average : 0
              return (
                <Star
                  key={i}
                  className={cn(
                    "w-3 h-3 sm:w-4 sm:h-4 transition-colors duration-200",
                    i < Math.floor(rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  )}
                />
              )
            })}
          </div>
          <span className="text-xs sm:text-sm text-gray-600 font-medium whitespace-nowrap">
            ({product.reviewCount || 0} {isRTL ? 'مراجعات' : 'Reviews'})
          </span>
          <div className="flex items-center gap-1 text-[10px] sm:text-xs text-cyan-600 font-semibold whitespace-nowrap">
            <Zap className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            {isRTL ? 'مميز' : 'Premium'}
          </div>
        </div>

        {/* Description/Tagline */}
        {product.description && (
          <p 
            className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 leading-snug sm:leading-relaxed line-clamp-2"
          >
            {product.description}
          </p>
        )}

        {/* Spacer to distribute gaps */}
        <div className="flex-1 min-h-[8px] sm:min-h-[20px]"></div>

                    {/* Pricing and Add Button - Fixed position with distributed spacing */}
                    <div className="pt-1 sm:pt-2">
                      {/* Price Section */}
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-4 flex-wrap">
                        {!hasVariants && product.compareAtPrice && (
                          <>
                            <span className="text-gray-400 text-sm line-through font-medium whitespace-nowrap">
                              <SaudiRiyal amount={product.compareAtPrice} size="sm" />
                            </span>
                            {percentOff > 0 && (
                              <span className="bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap">
                                {percentOff}% {isRTL ? 'خصم' : 'OFF'}
                              </span>
                            )}
                          </>
                        )}
                      </div>

          {/* Current Price and Add Button */}
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1">
              {hasVariants ? (
                <span className="font-bold text-gray-900 tracking-tight">
                  {minVariantPrice !== undefined && maxVariantPrice !== undefined && minVariantPrice !== maxVariantPrice ? (
                    <>
                      <SaudiRiyal amount={minVariantPrice} size="responsive" />
                      <span className="mx-0.5 sm:mx-1">-</span>
                      <SaudiRiyal amount={maxVariantPrice} size="responsive" />
                    </>
                  ) : (
                    <SaudiRiyal amount={minVariantPrice ?? 0} size="responsive" />
                  )}
                </span>
              ) : (
                <span className="font-bold text-gray-900 tracking-tight">
                  <SaudiRiyal amount={product.price} size="responsive" />
                </span>
              )}
            </div>
            
            <button
              onClick={onAdd}
              disabled={!isInStock || isAddingToCart}
              className={cn(
                "bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-500 hover:from-cyan-600 hover:via-cyan-500 hover:to-cyan-600",
                "text-white rounded-full px-1.5 sm:px-6 py-1 sm:py-3 h-6 sm:h-12 text-[9px] sm:text-xs font-bold",
                "transition-all duration-300 transform hover:scale-105 hover:shadow-xl",
                "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
                "flex items-center justify-center gap-0.5 sm:gap-1.5 shadow-md sm:shadow-lg border border-cyan-300/20",
                "relative overflow-hidden whitespace-nowrap min-w-0 sm:min-w-[130px] flex-shrink-0 max-w-full",
                "cursor-pointer",
                buttonClassName
              )}
            >
              {hasVariants ? (
                <span className="truncate">{isRTL ? 'عرض الخيارات' : 'View Options'}</span>
              ) : isAddingToCart ? (
                <div className="flex items-center gap-0.5 sm:gap-1.5">
                  <div className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
                  <span className="truncate">{isRTL ? 'جاري الإضافة...' : 'Adding...'}</span>
                </div>
              ) : (
                <>
                  <ShoppingCart className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  <span className="truncate">{isRTL ? 'أضف إلى السلة' : 'Add to Cart'}</span>
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
