'use client'

import { useState, useEffect } from 'react'
import { useCart } from '@/hooks/use-cart'
import { useCartSettings } from '@/lib/contexts/cart-settings-context'
import { useAuth } from '@/lib/contexts/auth-context'
import { useTranslation } from '@/lib/contexts/translation-context'
import BundleStyleProductCard from '@/components/shop/BundleStyleProductCard'
import { Product } from '@/lib/types'
import { getProductImageUrl } from '@/lib/utils/image-utils'
import { getCategoryName } from '@/lib/utils/category-utils'

interface RecommendationItem {
  _id: string
  name: string
  nameAr?: string
  slug: string
  price: number
  originalPrice?: number
  images: string[] | Array<{ url: string; alt?: string }>
  averageRating?: number
  reviewCount?: number
  category?: {
    _id?: string
    name: string
    slug: string
  } | string
  shortDescription?: string
  description?: string
  isBestSeller?: boolean
  isFeatured?: boolean
  inStock?: boolean
  stock?: number
  brand?: string
  badges?: string[]
}

interface PersonalizedRecommendationsProps {
  className?: string
}

export default function PersonalizedRecommendations({ className = "" }: PersonalizedRecommendationsProps) {
  const { user, isAuthenticated, token } = useAuth()
  const { addItem, items: cartItems } = useCart()
  const { settings, getText } = useCartSettings()
  const { isRTL } = useTranslation()
  const [recommendations, setRecommendations] = useState<RecommendationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [strategy, setStrategy] = useState<string>('')

  // Convert RecommendationItem to Product type for BundleStyleProductCard
  const convertToProduct = (item: RecommendationItem): Product => {
    const productImage = getProductImageUrl(item as any, '/placeholder.svg')
    const categoryName = getCategoryName(item.category || 'product')
    
    return {
      _id: item._id,
      id: item._id,
      slug: item.slug,
      name: item.name,
      nameAr: item.nameAr,
      title: item.name,
      price: item.price,
      originalPrice: item.originalPrice,
      compareAtPrice: item.originalPrice,
      image: productImage,
      images: Array.isArray(item.images) ? item.images : [],
      description: item.description || item.shortDescription || '',
      averageRating: item.averageRating || 0,
      reviewCount: item.reviewCount || 0,
      rating: item.averageRating || 0,
      reviews: item.reviewCount || 0,
      inStock: item.inStock !== false,
      stock: item.stock,
      isBestSeller: item.isBestSeller || false,
      isFeatured: item.isFeatured || false,
      badges: item.badges || (item.isBestSeller ? ['BESTSELLER'] : item.isFeatured ? ['FEATURED'] : undefined),
      brand: item.brand,
      category: typeof item.category === 'object' && item.category !== null
        ? {
            _id: item.category._id || item._id,
            name: item.category.name,
            slug: item.category.slug
          }
        : categoryName
    }
  }
  
  useEffect(() => {
    fetchRecommendations()
  }, [isAuthenticated, token, settings.recommendations.enabled, settings.recommendations.maxCount, settings.recommendations.excludeInCart, cartItems])
  
  const fetchRecommendations = async () => {
    try {
      setLoading(true)
      setError(null)
      
      if (!isAuthenticated || !token) {
        // If no token, fetch best selling products instead
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/recommendations/best-selling?limit=3`)
        const data = await response.json()
        
        if (data.success) {
          setRecommendations(data.data.products)
          setStrategy('best_sellers_only')
        } else {
          throw new Error(data.message || 'Failed to fetch recommendations')
        }
        return
      }
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/recommendations/personalized?limit=3`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const data = await response.json()
      
      if (data.success) {
        setRecommendations(data.data.recommendations)
        setStrategy(data.data.strategy)
      } else {
        throw new Error(data.message || 'Failed to fetch personalized recommendations')
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err)
      setError(err instanceof Error ? err.message : 'Failed to load recommendations')
      
      // Fallback to best selling products
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/recommendations/best-selling?limit=3`)
        const data = await response.json()
        
        if (data.success) {
          setRecommendations(data.data.products)
          setStrategy('best_sellers_fallback')
        }
      } catch (fallbackErr) {
        console.error('Fallback also failed:', fallbackErr)
      }
    } finally {
      setLoading(false)
    }
  }
  
  if (!settings.recommendations.enabled) return null
  
  if (loading) {
    return (
      <section className={`bg-white rounded-soft shadow-card p-5 ${className}`}>
        <h2 className="text-lg font-semibold text-ink-900 mb-4">{getText(isRTL ? 'recommendations.titleAr' : 'recommendations.titleEn')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-3xl overflow-hidden border border-gray-100 min-h-[500px] sm:min-h-[540px] lg:min-h-[580px]">
              <div className="bg-gray-200 h-[220px] sm:h-[260px] lg:h-[280px]"></div>
              <div className="p-4 sm:p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }
  
  if (error || !recommendations?.length) {
    return null
  }
  
  // Filter out items already in cart if setting is enabled
  const filteredItems = settings.recommendations.excludeInCart 
    ? recommendations.filter(item => {
        // This is a simple check - you might want to improve this logic
        return true // For now, we'll show all recommendations
      })
    : recommendations

  return (
    <section className={`bg-white rounded-soft shadow-card p-5 ${className}`}>
      <h2 className="text-lg font-semibold text-ink-900 mb-4">{getText(isRTL ? 'recommendations.titleAr' : 'recommendations.titleEn')}</h2>
      
      {/* Strategy indicator for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-500 mb-2">
          Strategy: {strategy}
        </div>
      )}

      {/* Desktop grid - 4 columns for wider container */}
      <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {filteredItems.slice(0, settings.recommendations.maxCount).map((item) => {
          const product = convertToProduct(item)
          const productImage = getProductImageUrl(item as any, '/placeholder.svg')
          const categoryName = getCategoryName(item.category || 'product', false)
          const categoryNameAr = getCategoryName(item.category || 'product', true)
          
          return (
            <BundleStyleProductCard
              key={product._id}
              dir={isRTL ? "rtl" : "ltr"}
              product={product}
              buttonClassName="px-3 sm:px-4 py-1.5 sm:py-2 h-9 sm:h-10 text-[10px] sm:text-xs min-w-[100px] sm:min-w-[110px]"
              onAddToCart={({ productId, qty }: { productId: string; qty: number }) => {
                const cartItem = {
                  id: productId,
                  name: item.name,
                  nameAr: item.nameAr,
                  price: item.price,
                  quantity: qty,
                  image: productImage,
                  category: categoryName,
                  categoryAr: categoryNameAr,
                  productId: productId,
                  productType: 'product' as const
                }
                addItem(cartItem)
              }}
              onProductView={(product) => {
                // Navigation is handled by the Link in BundleStyleProductCard
              }}
              onAddToWishlist={() => {}}
              onAddToComparison={() => {}}
            />
          )
        })}
      </div>

      {/* Mobile carousel */}
      <div className="sm:hidden overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="flex gap-4 pr-4 snap-x snap-mandatory">
          {filteredItems.slice(0, settings.recommendations.maxCount).map((item) => {
            const product = convertToProduct(item)
            const productImage = getProductImageUrl(item as any, '/placeholder.svg')
            const categoryName = getCategoryName(item.category || 'product', false)
            const categoryNameAr = getCategoryName(item.category || 'product', true)
            
            return (
              <div 
                key={product._id}
                className="snap-start min-w-[280px] flex-shrink-0"
              >
                <BundleStyleProductCard
                  dir={isRTL ? "rtl" : "ltr"}
                  product={product}
                  onAddToCart={({ productId, qty }: { productId: string; qty: number }) => {
                    const cartItem = {
                      id: productId,
                      name: item.name,
                      nameAr: item.nameAr,
                      price: item.price,
                      quantity: qty,
                      image: productImage,
                      category: categoryName,
                      categoryAr: categoryNameAr,
                      productId: productId,
                      productType: 'product' as const
                    }
                    addItem(cartItem)
                  }}
                  onProductView={(product) => {
                    // Navigation is handled by the Link in BundleStyleProductCard
                  }}
                  onAddToWishlist={() => {}}
                  onAddToComparison={() => {}}
                />
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

