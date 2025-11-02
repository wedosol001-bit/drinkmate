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
import { convertVariants } from "@/lib/utils/product-formatting"
import { getProductImageUrl } from "@/lib/utils/image-utils"
import { getCategoryName } from "@/lib/utils/category-utils"
import { useCart } from "@/lib/contexts/cart-context"
import { useCartAnimations } from "@/hooks/use-cart-animations"
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
  const { triggerAddAnimation } = useCartAnimations()
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
        // Use getProductsByCategory to get products with subcategory field populated
        // This is the same method used by other category shop pages
        const catalogResponse = await shopAPI.getProductsByCategory('accessories', { limit: 1000 });
        
        const allProducts = catalogResponse.products || catalogResponse.data?.products || [];
        console.log('🔍 CYLINDER SHOP DEBUG - Total accessories products fetched:', allProducts.length);
        
        // Log first few products to see their structure
        if (allProducts.length > 0) {
          console.log('🔍 CYLINDER SHOP DEBUG - Sample products:', allProducts.slice(0, 3).map((p: any) => ({
            name: p.name,
            subcategory: p.subcategory,
            subcategoryType: typeof p.subcategory,
            category: p.category
          })));
        }
        
        // Helper function to check if product has cylinder subcategory
        // Based on admin panel: Subcategory is "CO2 Cylinders" with slug "co2-cylinders" and ID "68c0583c2fc1cff30bf5c117"
        const isCylinderProduct = (product: any): boolean => {
          const subcategory = product.subcategory;
          
          // Handle object subcategory (populated by backend)
          if (typeof subcategory === 'object' && subcategory !== null) {
            const subcategoryName = (subcategory.name || '').toLowerCase();
            const subcategorySlug = (subcategory.slug || '').toLowerCase();
            const subcategoryId = String(subcategory._id || '');
            
            // Exact match for "CO2 Cylinders" subcategory
            const exactNameMatch = subcategoryName === 'co2 cylinders';
            const exactSlugMatch = subcategorySlug === 'co2-cylinders';
            const exactIdMatch = subcategoryId === '68c0583c2fc1cff30bf5c117';
            
            // Fallback: Contains "cylinder" (for flexibility)
            const containsCylinder = subcategoryName.includes('cylinder') || subcategorySlug.includes('cylinder');
            
            if (exactNameMatch || exactSlugMatch || exactIdMatch || containsCylinder) {
              console.log('✅ CYLINDER SHOP DEBUG - Found cylinder product (object):', product.name, 'subcategory:', subcategory);
              return true;
            }
          }
          
          // Handle string subcategory (ObjectId before population or slug/name string)
          if (typeof subcategory === 'string' && subcategory.trim()) {
            const subcategoryLower = subcategory.toLowerCase().trim();
            
            // Check if it's the exact ObjectId for CO2 Cylinders subcategory
            if (subcategoryLower === '68c0583c2fc1cff30bf5c117') {
              console.log('✅ CYLINDER SHOP DEBUG - Found cylinder product (by ID):', product.name);
              return true;
            }
            
            // Check if it's the exact slug
            if (subcategoryLower === 'co2-cylinders') {
              console.log('✅ CYLINDER SHOP DEBUG - Found cylinder product (by slug):', product.name);
              return true;
            }
            
            // Check if it contains "cylinder" keyword
            if (subcategoryLower.includes('cylinder')) {
              console.log('✅ CYLINDER SHOP DEBUG - Found cylinder product (string):', product.name, 'subcategory:', subcategory);
              return true;
            }
          }
          
          return false;
        };
        
        // Filter products by cylinder subcategory
        catalogProducts = allProducts.filter((product: any) => {
          // Must be in accessories category (or check is more lenient - just needs to be from accessories category fetch)
          const categoryMatch = product.category && (
            (typeof product.category === 'string' && product.category.toLowerCase().includes('accessor')) ||
            (typeof product.category === 'object' && (
              product.category.name?.toLowerCase().includes('accessor') ||
              product.category.slug?.toLowerCase().includes('accessor')
            ))
          );
          
          // Must have cylinder subcategory (or be identified as cylinder by name)
          const hasCylinderSubcategory = isCylinderProduct(product);
          
          const shouldInclude = categoryMatch && hasCylinderSubcategory;
          
          if (!shouldInclude && hasCylinderSubcategory) {
            console.log('⚠️ CYLINDER SHOP DEBUG - Cylinder product rejected (category mismatch):', product.name, 'category:', product.category);
          }
          
          return shouldInclude;
        });
        
        // Preserve nameAr from API response
        catalogProducts = catalogProducts.map((product: any) => ({
          ...product,
          nameAr: product.nameAr || (product as any)?.nameAr,
        }));
        
        console.log('✅ CYLINDER SHOP DEBUG - Found products from cylinder subcategory:', catalogProducts.length);
        if (catalogProducts.length > 0) {
          console.log('✅ CYLINDER SHOP DEBUG - Cylinder products found:', catalogProducts.map((p: any) => p.name));
        } else {
          console.warn('⚠️ CYLINDER SHOP DEBUG - NO CYLINDER PRODUCTS FOUND! Check subcategory field in database.');
        }
      } catch (catalogError) {
        logger.debug('CATALOG CYLINDERS DEBUG - Error fetching catalog products:', catalogError);
        // Continue even if catalog fetch fails
      }
      
      // Only use CO2 API for exchange type, not for regular products
      // Regular products should come from catalog with cylinder subcategory
      if (type === 'exchange') {
        // Use exchange cylinder API for exchange type
        const exchangeResponse = await exchangeCylinderAPI.getExchangeCylinders();
        response = exchangeResponse as { success?: boolean; cylinders?: CO2Cylinder[]; message?: string; error?: any };
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
          const productImage = product.image || (product.images && Array.isArray(product.images) && product.images.length > 0 
            ? (typeof product.images[0] === 'string' ? product.images[0] : product.images[0]?.url) 
            : '/placeholder.svg')
          
          // Convert variants to match main shop format
          const convertedVariants = convertVariants(product, productImage)
          const hasVariants = convertedVariants.length > 0 || (product as any)?.hasVariants === true
          
          return (
            <BundleStyleProductCard
              key={`product-${product._id}`}
              dir={isRTL ? "rtl" : "ltr"}
              product={{
                _id: product._id,
                id: product._id,
                name: product.name, // Keep original name, component will handle display
                slug: product.slug || product._id,
                title: product.name, // Keep original name as title, component will use nameAr if available
                image: productImage,
                price: product.price,
                compareAtPrice: product.originalPrice,
                rating: product.rating || product.averageRating || 0,
                reviewCount: (product as any).reviewsCount || product.reviews || product.totalReviews || 0,
                description: product.description || '',
                category: product.category || 'co2-cylinder',
                inStock: product.inStock !== false, // Match main shop logic
                brand: (product as any).brand,
                tags: (product as any).tags || [],
                badges: product.isBestSeller ? ["BESTSELLER"] : product.isFeatured ? ["FEATURED"] : undefined,
                hasVariants: hasVariants,
                variants: convertedVariants, // Use converted variants matching main shop format
                images: product.images || [],
                // Ensure nameAr is passed through - this is crucial for Arabic display
                nameAr: (product as any)?.nameAr || undefined,
              }}
              onAddToCart={({ productId, qty }: { productId: string; qty: number }) => {
                const foundProduct = products.find(p => p._id === productId)
                if (foundProduct) {
                  // Create unique cart item ID like main shop
                  const uniqueCartItemId = `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                  
                  const productDisplayName = (isRTL && foundProduct.nameAr) ? foundProduct.nameAr : foundProduct.name
                  
                  // Use getProductImageUrl utility for consistent image processing
                  const displayImage = getProductImageUrl(foundProduct, '/placeholder.svg')
                  
                  // Use getCategoryName utility for consistent category handling
                  const categoryName = getCategoryName(foundProduct.category || 'co2-cylinder')
                  
                  const cartItem = {
                    id: uniqueCartItemId,
                    name: productDisplayName,
                    price: foundProduct.price,
                    quantity: qty,
                    image: displayImage, // Use processed image URL
                    category: categoryName,
                    productId: productId,
                    productType: 'product' as const
                  }
                  addItem(cartItem)
                  triggerAddAnimation(cartItem) // Match main shop animation
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
          
          // Use ExchangeCylinderCard for exchange type or refill type
          if (type === "exchange" || (serviceType === "refill" && type === "refill")) {
            // For ExchangeCylinderCard, calculate display name here as it may not handle nameAr
            const cylinderDisplayName = (isRTL && cylinder.nameAr) ? cylinder.nameAr : cylinder.name
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
                name: cylinder.name, // Keep original name, component will handle display
                slug: cylinder.slug,
                title: cylinder.name, // Keep original name as title, component will use nameAr if available
                image: cylinder.image || "/placeholder.svg",
                price: cylinder.price,
                compareAtPrice: cylinder.originalPrice,
                rating: cylinder.averageRating || 0,
                reviewCount: cylinder.totalReviews || 0,
                description: cylinder.description,
                category: "co2-cylinder",
                inStock: cylinder.stock > 0,
                badges: cylinder.isBestSeller ? ["BESTSELLER"] : cylinder.isFeatured ? ["FEATURED"] : undefined,
                // Ensure nameAr is passed through - this is crucial for Arabic display
                nameAr: cylinder.nameAr || undefined,
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
