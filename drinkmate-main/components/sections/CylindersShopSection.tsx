"use client"
import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import SaudiRiyal from "@/components/ui/SaudiRiyal"
import { fetchWithRetry } from "@/lib/utils/fetch-utils"
import { co2API, shopAPI } from "@/lib/api"
import { exchangeCylinderAPI } from "@/lib/api/exchange-cylinder-api"
import { logger } from "@/lib/logger"
import BundleStyleProductCard from "@/components/shop/BundleStyleProductCard"
import ExchangeCylinderCard from "@/components/shop/ExchangeCylinderCard"
import { useCart } from "@/lib/contexts/cart-context"
import { toast } from "sonner"
import styles from "./CylindersShopSection.module.css"
import { useTranslation } from '@/lib/contexts/translation-context'

interface CO2Cylinder {
  _id: string
  slug: string
  name: string
  nameAr?: string
  brand: string
  type: string
  price: number
  originalPrice: number
  discount: number
  capacity: number
  material: string
  stock: number
  minStock: number
  status: string
  isBestSeller: boolean
  isFeatured: boolean
  isNewProduct?: boolean
  isEcoFriendly?: boolean
  description: string
  features: string[]
  image: string
  images?: string[]
  videos?: string[]
  averageRating?: number
  totalReviews?: number
  createdAt: string
  // Exchange-specific fields
  exchangeType?: string
  estimatedTime?: string
  // Product catalog fields
  category?: any
  subcategory?: string
}

interface Product {
  _id: string
  slug?: string
  name: string
  nameAr?: string
  price: number
  originalPrice?: number
  image?: string
  images?: any[]
  category?: any
  subcategory?: string
  description?: string
  inStock?: boolean
  rating?: number
  reviews?: number
  averageRating?: number
  totalReviews?: number
  isBestSeller?: boolean
  isFeatured?: boolean
  brand?: string
}

interface CylindersShopSectionProps {
  type?: 'exchange' | 'refill' | 'all'
}

export function CylindersShopSection({ type = 'all' }: CylindersShopSectionProps) {
  const { addItem } = useCart()
  const { isRTL } = useTranslation()
  const [cylinders, setCylinders] = useState<CO2Cylinder[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleAddToCart = useCallback((cylinder: CO2Cylinder, qty: number = 1) => {
    const cylinderDisplayName = (isRTL && cylinder.nameAr) ? cylinder.nameAr : cylinder.name
    const cartItem = {
      id: cylinder._id,
      name: cylinderDisplayName,
      price: cylinder.price,
      quantity: qty,
      image: cylinder.image || '/placeholder.svg',
      category: 'co2-cylinder',
      productId: cylinder._id,
      productType: 'cylinder' as const,
      sku: cylinder.slug
    }
    
    addItem(cartItem)
  }, [addItem, isRTL])

  const fetchCylinders = useCallback(async () => {
    let catalogProducts: Product[] = [];
    
    try {
      setLoading(true)
      setError(null)
      
      let response: { success?: boolean; cylinders?: CO2Cylinder[]; message?: string; error?: any };
      
      // Fetch products from main catalog with cylinder subcategory under accessories category
      try {
        // First, try to get products from 'accessories' category
        const catalogResponse = await shopAPI.getProducts({ 
          limit: 1000,
          category: 'accessories' // Parent category is accessories
        });
        
        if (catalogResponse.success && catalogResponse.products) {
          // Filter products by subcategory "cylinders" - this is the key filter
          catalogProducts = catalogResponse.products.filter((product: Product) => {
            const subcategory = product.subcategory || (product as any)?.subcategory?.name || (product as any)?.subcategory?.slug || '';
            const subcategoryStr = typeof subcategory === 'string' ? subcategory.toLowerCase() : '';
            
            // Only show products with "cylinder" or "cylinders" subcategory
            const isCylinderSubcategory = subcategoryStr.includes('cylinder') || subcategoryStr === 'cylinders';
            
            // Also check category matches accessories
            const categoryMatch = product.category && (
              (typeof product.category === 'string' && product.category.toLowerCase().includes('accessor')) ||
              (typeof product.category === 'object' && (
                product.category.name?.toLowerCase().includes('accessor') ||
                product.category.slug?.toLowerCase().includes('accessor')
              ))
            );
            
            return categoryMatch && isCylinderSubcategory;
          });
          logger.debug('CATALOG CYLINDERS DEBUG - Found products from cylinder subcategory:', catalogProducts.length);
        }
      } catch (catalogError) {
        logger.debug('CATALOG CYLINDERS DEBUG - Error fetching catalog products:', catalogError);
        // Continue even if catalog fetch fails
      }
      
      // Only use CO2 API for exchange type, not for regular products
      // Regular products should come from catalog with cylinder subcategory
      if (type === 'exchange') {
        // Use exchange cylinder API for exchange type
        response = await exchangeCylinderAPI.getExchangeCylinders();
        logger.debug('EXCHANGE CYLINDERS DEBUG - Raw Response:', JSON.stringify(response));
      } else {
        // For 'all' and 'refill', don't use CO2 API - only use catalog products
        // Set empty response so we only show catalog products
        response = { success: true, cylinders: [] };
      }
      
      // Debug - check exactly what we're getting
      logger.debug('CYLINDERS DEBUG - Has success:', response.success !== undefined);
      logger.debug('CYLINDERS DEBUG - Has cylinders:', response.cylinders !== undefined);
      
      // Handle the response regardless of whether success field is present
      // as long as we have cylinders data
      if (response.cylinders) {
        // Get all cylinders from the database
        const allCylinders = response.cylinders || []
          
        // Ensure image URLs are absolute
        const processedCylinders = allCylinders.map((cylinder: CO2Cylinder) => {
          // Handle case where image might be undefined or null
          const safeImage = cylinder.image || '';
          const safeImages = cylinder.images || [];
          
          return {
            ...cylinder,
            // Ensure image URL is absolute
            image: safeImage.startsWith('http') ? safeImage : 
                   safeImage.startsWith('/') ? `${window.location.origin}${safeImage}` : 
                   '/placeholder.svg',
            // Ensure image URLs in arrays are absolute
            images: safeImages.map((img: string) => 
              img?.startsWith('http') ? img : 
              img?.startsWith('/') ? `${window.location.origin}${img}` : 
              '/placeholder.svg'
            )
          }
        })
        
        // Filter cylinders based on type
        let filteredCylinders = processedCylinders
        if (type !== 'all') {
          if (type === 'exchange') {
            // For exchange type, we're already getting exchange cylinders from the API
            // No additional filtering needed
            filteredCylinders = processedCylinders
          } else {
            // For other types, filter based on cylinder type
            filteredCylinders = processedCylinders.filter((cylinder: CO2Cylinder) => {
              const serviceType = getServiceType(cylinder.type)
              if (type === 'refill') {
                return serviceType === 'refill' // Refill cylinders have type 'refill'
              }
              return true
            })
          }
        }
        
        setCylinders(filteredCylinders)
      } else {
        const errorMessage = response.message || response.error || 'Failed to load cylinders'
        console.error('Failed to fetch cylinders:', errorMessage)
        // Don't set error if we have catalog products
        if (catalogProducts.length === 0) {
          setError(errorMessage)
        }
        setCylinders([])
      }
      
      // Set catalog products
      setProducts(catalogProducts)
      
    } catch (error: any) {
      console.error('CYLINDERS DEBUG - Error object:', error);
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to load cylinders'
      console.error('Error fetching cylinders:', errorMessage)
      // Only set error if we don't have catalog products
      if (products.length === 0 && catalogProducts.length === 0) {
        setError(errorMessage)
      }
      setCylinders([])
      setProducts(catalogProducts || [])
    } finally {
      setLoading(false)
    }
  }, [type])

  // Manual refresh function with useCallback for performance
  const handleManualRefresh = useCallback(() => {
    setLoading(true)
    fetchCylinders()
  }, [fetchCylinders])

  useEffect(() => {
    fetchCylinders()
    
    // Setup a refresh interval
    const refreshInterval = setInterval(() => {
      fetchCylinders()
    }, 300000) // Refresh every 5 minutes
    
    return () => {
      clearInterval(refreshInterval)
    }
  }, [type])

  const getServiceType = (type: string) => {
    switch (type) {
      case 'subscription':
        return 'subscription'
      case 'refill':
        return 'refill'
      case 'exchange':
        return 'exchange'
      case 'new':
        return 'new'
      case 'conversion':
        return 'conversion'
      default:
        return 'refill'
    }
  }

  const getPriceText = (type: string) => {
    switch (type) {
      case 'subscription':
        return "Subscriptions starts from"
      case 'refill':
        return "Refill / Exchange starts from"
      case 'new':
        return "Buy a new cylinder just for"
      default:
        return "Price starts from"
    }
  }

  // Skeleton loading component
  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl p-6 animate-pulse">
      <div className="w-48 h-48 bg-gray-200 rounded-2xl mx-auto mb-4"></div>
      <div className="h-6 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 bg-gray-200 rounded mb-4"></div>
      <div className="h-8 bg-gray-200 rounded"></div>
    </div>
  )

  const getSectionTitle = () => {
    switch (type) {
      case 'exchange':
        return isRTL ? 'أسطوانات الاستبدال' : 'Exchange Cylinders'
      case 'refill':
        return ''
      default:
        return isRTL ? 'تسوق أسطوانات ثاني أكسيد الكربون' : 'Shop CO2 Cylinders'
    }
  }

  const getSectionDescription = () => {
    switch (type) {
      case 'exchange':
        return isRTL ? 'خدمة استبدال الأسطوانات بسرعة وسهولة' : 'Quick and easy cylinder exchange service'
      case 'refill':
        return ''
      default:
        return isRTL ? 'اختر حل ثاني أكسيد الكربون المناسب لاحتياجك' : 'Choose the perfect CO2 solution for your needs'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black font-montserrat mb-3 sm:mb-4 tracking-tight">
            {getSectionTitle()}
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 font-noto-sans max-w-2xl mx-auto">
            {getSectionDescription()}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black font-montserrat mb-3 sm:mb-4 tracking-tight">
          {getSectionTitle()}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-600 font-noto-sans max-w-2xl mx-auto">
          {getSectionDescription()}
        </p>
        
        {/* Error display */}
        {error && (
          <div className="mt-4 p-3 sm:p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
            <button 
              onClick={handleManualRefresh}
              className="ml-2 text-red-600 hover:text-red-800 underline text-sm"
            >
              Try again
            </button>
          </div>
        )}
        
      </div>

      {products.length === 0 && cylinders.length === 0 && !loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">{isRTL ? 'لا توجد منتجات متاحة حالياً' : 'No products available at the moment'}</p>
        </div>
      ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 items-start">
        {/* Render catalog products - these are the main products from cylinder subcategory */}
        {products.map((product) => {
          const productDisplayName = (isRTL && product.nameAr) ? product.nameAr : product.name
          const productImage = product.image || (product.images && Array.isArray(product.images) && product.images.length > 0 
            ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url) 
            : '/placeholder.svg')
          
          return (
            <BundleStyleProductCard
              key={`product-${product._id}`}
              dir={isRTL ? "rtl" : "ltr"}
              product={{
                _id: product._id,
                id: product._id,
                name: productDisplayName,
                slug: product.slug || product._id,
                title: productDisplayName,
                image: productImage,
                price: product.price,
                compareAtPrice: product.originalPrice,
                rating: product.rating || product.averageRating || 0,
                reviewCount: product.reviews || product.totalReviews || 0,
                description: product.description || '',
                category: product.category || 'co2-cylinder',
                inStock: product.inStock !== undefined ? product.inStock : true,
                badges: product.isBestSeller ? ["BESTSELLER"] : product.isFeatured ? ["FEATURED"] : undefined,
              }}
              onAddToCart={({ productId, qty }: { productId: string; qty: number }) => {
                const foundProduct = products.find(p => p._id === productId)
                if (foundProduct) {
                  const productDisplayName = (isRTL && foundProduct.nameAr) ? foundProduct.nameAr : foundProduct.name
                  const productImage = foundProduct.image || (foundProduct.images && Array.isArray(foundProduct.images) && foundProduct.images.length > 0 
                    ? (typeof foundProduct.images[0] === 'string' ? foundProduct.images[0] : foundProduct.images[0]?.url) 
                    : '/placeholder.svg')
                  const cartItem = {
                    id: productId,
                    name: productDisplayName,
                    price: foundProduct.price,
                    quantity: qty,
                    image: productImage,
                    category: typeof foundProduct.category === 'string' ? foundProduct.category : (foundProduct.category as any)?.name || 'co2-cylinder',
                    productId: productId,
                    productType: 'product' as const
                  }
                  addItem(cartItem)
                }
              }}
              onAddToWishlist={() => {}}
              onAddToComparison={() => {}}
              onProductView={() => {}}
              className="h-full"
            />
          )
        })}
        
        {/* Render CO2 cylinders */}
        {cylinders.map((cylinder) => {
          const serviceType = getServiceType(cylinder.type)
          const cylinderDisplayName = (isRTL && cylinder.nameAr) ? cylinder.nameAr : cylinder.name
          
          // Use ExchangeCylinderCard for exchange type or refill type
          if (type === "exchange" || (serviceType === "refill" && type === "refill")) {
            return (
              <ExchangeCylinderCard
                key={`exchange-${cylinder._id}`}
                dir={isRTL ? "rtl" : "ltr"}
                product={{
                  id: cylinder._id,
                  slug: cylinder.slug,
                  title: cylinderDisplayName,
                  image: cylinder.image || "/placeholder.svg",
                  price: cylinder.price,
                  compareAtPrice: cylinder.originalPrice,
                  rating: cylinder.averageRating || 0,
                  reviewCount: cylinder.totalReviews || 0,
                  description: cylinder.description,
                  category: "co2-cylinder",
                  inStock: cylinder.stock > 0,
                  badges: cylinder.isBestSeller ? ["BESTSELLER"] : cylinder.isFeatured ? ["FEATURED"] : undefined,
                  capacity: cylinder.capacity,
                  material: cylinder.material,
                  exchangeType: type === "exchange" ? (cylinder.exchangeType as "instant" | "scheduled" | "pickup" || "instant") : "scheduled",
                  estimatedTime: type === "exchange" ? (cylinder.estimatedTime || "Same Day") : "1-2 Days"
                }}
                onAddToCart={({ productId, qty }: { productId: string; qty: number }) => {
                  const cylinder = cylinders.find(c => c._id === productId)
                  if (cylinder) {
                    handleAddToCart(cylinder, qty)
                  }
                }}
                onAddToWishlist={() => {}}
                onAddToComparison={() => {}}
                onProductView={() => {}}
                className="h-full"
              />
            )
          }
          
          // Use BundleStyleProductCard for other types
          return (
            <BundleStyleProductCard
              key={cylinder._id}
              dir={isRTL ? "rtl" : "ltr"}
              product={{
                _id: cylinder._id,
                id: cylinder._id,
                name: cylinderDisplayName,
                slug: cylinder.slug,
                title: cylinderDisplayName,
                image: cylinder.image || "/placeholder.svg",
                price: cylinder.price,
                compareAtPrice: cylinder.originalPrice,
                rating: cylinder.averageRating || 0,
                reviewCount: cylinder.totalReviews || 0,
                description: cylinder.description,
                category: "co2-cylinder",
                inStock: cylinder.stock > 0,
                badges: cylinder.isBestSeller ? ["BESTSELLER"] : cylinder.isFeatured ? ["FEATURED"] : undefined,
              }}
              onAddToCart={({ productId, qty }: { productId: string; qty: number }) => {
                const cylinder = cylinders.find(c => c._id === productId)
                if (cylinder) {
                  handleAddToCart(cylinder, qty)
                }
              }}
              onAddToWishlist={() => {}}
              onAddToComparison={() => {}}
              onProductView={() => {}}
              className="h-full"
            />
          )
        })}
      </div>
      )}
    </div>
  )
}
