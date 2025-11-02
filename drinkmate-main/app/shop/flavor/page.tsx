"use client"

// Flavor Page - Displays all flavor products with filtering options and bundles
// Version: 1.1.0
// Last updated: January 2025

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/contexts/cart-context"
import { useTranslation } from "@/lib/contexts/translation-context"
import PageLayout from "@/components/layout/PageLayout"
import { Star, Loader2, ShoppingCart } from "lucide-react"
import { shopAPI } from "@/lib/api"
import { logger } from "@/lib/logger"
import SaudiRiyal from "@/components/ui/SaudiRiyal"
import BundleStyleProductCard from "@/components/shop/BundleStyleProductCard"
import { convertVariants, getVariantPriceRange } from "@/lib/utils/product-formatting"
import { getProductImageUrl } from "@/lib/utils/image-utils"
import { getCategoryName } from "@/lib/utils/category-utils"
import { useCartAnimations } from "@/hooks/use-cart-animations"

// Define product types
interface Product {
  _id: string
  id?: number
  slug?: string
  name: string
  price: number
  originalPrice?: number
  discount?: number
  image: string
  category: string
  subcategory?: string
  rating: number
  reviews: number
  description?: string
  images?: Array<{ url: string; alt: string; isPrimary: boolean }>
  flavorType?: string
  isOnPromotion?: boolean
  isBundled?: boolean
  createdAt?: string
}

interface Bundle {
  _id: string
  id?: number
  slug: string
  name: string
  price: number
  originalPrice?: number
  image: string
  description: string
  rating: number
  reviews: number
  badge?: string
  category?: string
  subcategory?: string
}

export default function FlavorPage() {
  const { t, isRTL } = useTranslation()
  const router = useRouter()
  const { addItem, isInCart } = useCart()
  const { triggerAddAnimation } = useCartAnimations()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // State for products and bundles
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [bundleSubcategorySections, setBundleSubcategorySections] = useState<Array<{ _id: string; name: string; bundles: Bundle[] }>>([])
  const [allFlavors, setAllFlavors] = useState<Product[]>([])
  const [subcategorySections, setSubcategorySections] = useState<Array<{ _id: string; name: string; products: Product[] }>>([])


  // Define fetch function
  async function fetchProducts() {
    try {
      setIsLoading(true)

      // Fetch bundles for flavors category only
      logger.debug("Fetching bundles for flavors category...")
      const bundlesResponse = await shopAPI.getBundles({
        category: "flavors",
        limit: 4,
      })
      logger.debug("Flavors bundles response:", bundlesResponse)
      logger.debug("Flavors bundles array:", bundlesResponse.bundles)
      logger.debug("Number of flavors bundles found:", bundlesResponse.bundles?.length || 0)

      // Format bundles data - only use flavors bundles
      const bundlesToUse = bundlesResponse.bundles || []
      logger.debug("Using flavors bundles:", bundlesToUse.length, "bundles")
      
      const formattedBundles = bundlesToUse.map((bundle: any) => {
        logger.debug("Processing bundle:", bundle.name, "Full bundle object:", bundle)
        return {
        _id: bundle._id,
        id: bundle._id,
        slug: bundle.slug,
        name: bundle.name,
        nameAr: bundle.nameAr || bundle.titleAr, // Preserve Arabic name
        price: bundle.price,
        originalPrice: bundle.originalPrice,
        subcategory: bundle.subcategory || (isRTL ? "العروض والتجميعات للنكهات" : "Bundles & Promotions of Flavors"),
        image: (() => {
          console.log("Bundle image data:", bundle.images)
          if (bundle.images && bundle.images.length > 0) {
            // Handle different image formats
            const firstImage = bundle.images[0]
            if (typeof firstImage === 'string') {
              return firstImage
            } else if (firstImage && firstImage.url) {
              return firstImage.url
            }
          }
          return "/images/01 - Flavors/Strawberry-Lemon-Flavor.png"
        })(),
        description: bundle.shortDescription || "Premium flavor bundle",
        rating: bundle.averageRating || 5,
        reviews: bundle.reviewCount || 300,
        badge: bundle.isFeatured ? "POPULAR" : bundle.isLimited ? "SALE" : undefined,
      }
      })

      setBundles(formattedBundles)
      console.log("Formatted bundles for flavors:", formattedBundles)

      // Organize bundles by subcategory
      const bundleBySubcategory: Record<string, Bundle[]> = {}
      for (const bundle of formattedBundles) {
        const subcategory = bundle.subcategory || (isRTL ? "العروض والتجميعات للنكهات" : "Bundles & Promotions of Flavors")
        if (!bundleBySubcategory[subcategory]) {
          bundleBySubcategory[subcategory] = []
        }
        bundleBySubcategory[subcategory].push(bundle)
      }
      
      const bundleSections = Object.entries(bundleBySubcategory).map(([subcategory, bundles]) => ({
        _id: subcategory.toLowerCase().replace(/\s+/g, '-'),
        name: subcategory,
        bundles
      }))
      
      setBundleSubcategorySections(bundleSections)
      console.log("Bundle subcategory sections:", bundleSections)

      // Fetch categories and find Flavors category
      const categoriesResp = await shopAPI.getCategories()
      const categoriesWithSubs = categoriesResp.categories || []
      const flavorsCat = categoriesWithSubs.find((c: any) => {
        const name = (c.name || '').toLowerCase()
        const slug = (c.slug || '').toLowerCase()
        return name.includes('flavor') || slug.includes('flavor') || slug === 'flavors'
      })
      const flavorSlug = flavorsCat?.slug || 'flavors'
      
      console.log('🔍 Found flavors category:', flavorsCat)
      console.log('🔍 Using slug:', flavorSlug)

      // Fetch products by category (returns subcategory field)
      console.log('🔍 Fetching products by category:', flavorSlug);
      const byCategoryResp = await shopAPI.getProductsByCategory(flavorSlug, { limit: 100 })
      console.log('📦 Category response:', byCategoryResp);
      const flavorProducts = byCategoryResp.products || []
      console.log('📦 Flavor products:', flavorProducts);
      console.log('📦 Number of products:', flavorProducts.length);

      // Helper to pick first/primary image
      const pickImage = (imgs: any): string => {
        if (!imgs || imgs.length === 0) return "/images/01 - Flavors/Strawberry-Lemon-Flavor.png"
        const first = imgs[0]
        if (typeof first === 'string') return first
        return (imgs.find((img: any) => img.isPrimary)?.url) || first.url || "/images/01 - Flavors/Strawberry-Lemon-Flavor.png"
      }

      // Format products and capture subcategory
      // Use variant conversion utility to match main shop format
      const formattedFlavors = flavorProducts.map((product: any) => {
        const productImage = pickImage(product.images)
        // Convert variants to match main shop format
        const convertedVariants = convertVariants(product, productImage)
        const hasVariants = convertedVariants.length > 0 || product.hasVariants === true
        
        return {
          _id: product._id,
          id: product._id,
          slug: product.slug,
          name: product.name,
          nameAr: product.nameAr || product.titleAr, // Preserve Arabic name
          price: product.price,
          originalPrice: product.originalPrice,
          image: productImage,
          category: "flavors",
          subcategory: (typeof product.subcategory === 'string' ? product.subcategory : product.subcategory?._id) || product.subcategory,
          rating: product.rating || product.averageRating || 0,
          reviewCount: product.reviewsCount || product.reviewCount || 0,
          reviews: product.reviewsCount || product.reviewCount || 0, // Keep for compatibility
          description: product.description || product.shortDescription,
          images: product.images,
          hasVariants: hasVariants,
          variants: convertedVariants, // Use converted variants
          brand: product.brand,
          tags: product.tags || [],
          inStock: product.inStock !== false, // Match main shop logic
        }
      })

      setAllFlavors(formattedFlavors)
      console.log("Formatted flavors:", formattedFlavors)
      console.log("Flavors category:", flavorsCat)
      console.log("Subcategories:", flavorsCat?.subcategories)

      // Build sections by subcategory
      const subs = (flavorsCat?.subcategories || []) as Array<{ _id: string; name: string }>
      const bySubId: Record<string, Product[]> = {}
      const bySubName: Record<string, Product[]> = {}
      
      for (const p of formattedFlavors) {
        const sid = p.subcategory || ''
        const sname = p.subcategory || ''
        
        // Group by ID
        if (!bySubId[sid]) bySubId[sid] = []
        bySubId[sid].push(p)
        
        // Group by name (fallback)
        if (!bySubName[sname]) bySubName[sname] = []
        bySubName[sname].push(p)
      }
      
      const sections: Array<{ _id: string; name: string; products: Product[] }> = []
      
      // First, try to match by subcategory ID
      for (const sc of subs) {
        const productsById = bySubId[sc._id] || []
        const productsByName = bySubName[sc.name] || []
        
        // Use the larger set of products
        const products = productsById.length > productsByName.length ? productsById : productsByName
        
        sections.push({ _id: sc._id, name: sc.name, products })
      }
      
      // Add any remaining products that don't match any subcategory
      const usedProductIds = new Set(sections.flatMap(s => s.products.map((p: Product) => p._id)))
      const otherProducts = formattedFlavors.filter((p: Product) => !usedProductIds.has(p._id))
      
      if (otherProducts.length > 0) {
        sections.push({ _id: 'others', name: 'Other Flavors', products: otherProducts })
      }
      
      // If no sections were created, create a default "All Flavors" section
      if (sections.length === 0 && formattedFlavors.length > 0) {
        sections.push({ _id: 'all', name: 'All Flavors', products: formattedFlavors })
      }
      
      const isDev = process.env.NODE_ENV === 'development';
      if (isDev) console.log("Subcategory sections:", sections)
      setSubcategorySections(sections)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError(t("shop.categoryPages.failedToLoad"))

      // Fallback to static data if API fails
      setAllFlavors([
        {
          _id: "401",
          id: 401,
          slug: "italian-strawberry-lemon",
          name: "Italian Strawberry Lemon",
          price: 49.99,
          originalPrice: 59.99,
          image: "/images/01 - Flavors/Strawberry-Lemon-Flavor.png",
          category: "flavors",
          subcategory: undefined,
          rating: 5,
          reviews: 320,
          description: "Natural premium Italian flavor syrup",
        },
        {
          _id: "402",
          id: 402,
          slug: "italian-cola",
          name: "Italian Cola",
          price: 49.99,
          originalPrice: 59.99,
          image: "/images/01 - Flavors/Cola-Flavor.png",
          category: "flavors",
          subcategory: undefined,
          rating: 5,
          reviews: 280,
          description: "Classic cola flavor for your carbonated drinks",
        },
        {
          _id: "403",
          id: 403,
          slug: "mojito-mocktail",
          name: "Italian Mojito Mocktail",
          price: 49.99,
          originalPrice: 59.99,
          image: "/images/01 - Flavors/Mojito-Mocktails.png",
          category: "flavors",
          subcategory: undefined,
          rating: 5,
          reviews: 350,
          description: "Refreshing mojito flavor without the alcohol",
        },
      ])
      setSubcategorySections([])
      setBundles([])
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts()
  }, []) // Empty dependency array means this effect runs once on mount

  function handleAddToCart(product: Product | Bundle) {
    addItem({
      id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: product.category,
    })
  }


  // Function to render star ratings
  function renderStars(rating: number) {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-3.5 h-3.5 ${i < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
        />,
      )
    }
    return <div className="flex">{stars}</div>
  }

  // Function to render product cards using bundle-style ProductCard component
  function renderProductCard(product: Product) {
    const handleAddToCart = (payload: { productId: string; variantId?: string; qty: number; isBundle?: boolean }) => {
      // Convert payload to proper cart item format
      const productDisplayName = (isRTL && (product as any)?.nameAr) ? (product as any).nameAr : product.name
      const cartItem = {
        id: payload.productId,
        name: productDisplayName, // Use Arabic name if RTL
        price: product.price,
        quantity: payload.qty,
        image: product.image || (typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url || '/placeholder.svg'),
        category: typeof product.category === 'string' ? product.category : (product.category as any)?.name || 'Product',
        productId: payload.isBundle ? undefined : payload.productId,
        bundleId: payload.isBundle ? payload.productId : undefined,
        productType: payload.isBundle ? 'bundle' as const : 'product' as const,
        isBundle: payload.isBundle || false
      }
      addItem(cartItem)
    }

    const handleAddToWishlist = (product: any) => {
      // Add wishlist functionality if needed
    }

    const handleAddToComparison = (product: any) => {
      // Add comparison functionality if needed
    }

    const handleProductView = (product: any) => {
      // Add product view functionality if needed
    }

    return (
      <BundleStyleProductCard
        key={product._id}
        dir={isRTL ? "rtl" : "ltr"}
        product={{
          _id: product._id,
          id: product._id,
          name: product.name, // Keep original name, component will handle display
          slug: (product as any).slug || product._id,
          title: product.name, // Keep original name as title, component will use nameAr if available
          image: product.image,
          price: product.price,
          compareAtPrice: product.originalPrice,
          rating: product.rating || 0,
          reviewCount: product.reviews || (product as any).reviewCount || 0,
          description: product.description,
          category: product.category,
          inStock: (product as any).inStock !== false, // Match main shop logic
          badges: (product as any).badge ? [(product as any).badge] : undefined,
          // Pass the images array as well for better image handling
          images: product.images,
          // Include variants for alignment with main shop
          hasVariants: (product as any).hasVariants || false,
          variants: (product as any).variants || [],
          // Ensure nameAr is passed through - this is crucial for Arabic display
          nameAr: (product as any)?.nameAr || undefined,
        }}
        onAddToCart={({ productId, qty }: { productId: string; qty: number }) => {
          // Create unique cart item ID like main shop
          const uniqueCartItemId = `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
          
          // Use getProductImageUrl utility for consistent image processing
          const displayImage = getProductImageUrl(product, '/placeholder.svg')
          
          // Use getCategoryName utility for consistent category handling
          const categoryName = getCategoryName(product.category)
          
          // Use Arabic name for cart if RTL
          const cartItemName = (isRTL && (product as any)?.nameAr) ? (product as any).nameAr : product.name
          const cartItem = {
            id: uniqueCartItemId,
            name: cartItemName, // Use Arabic name if RTL
            price: product.price,
            quantity: qty,
            image: displayImage, // Use processed image URL
            category: categoryName,
            productId: productId,
            productType: 'product' as const
          }
          addItem(cartItem)
          triggerAddAnimation(cartItem) // Match main shop animation
        }}
        onAddToWishlist={handleAddToWishlist}
        onAddToComparison={handleAddToComparison}
        onProductView={handleProductView}
        className="h-full"
      />
    )
  }

  return (
    <PageLayout currentPage="shop-flavor">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <h1 className="text-xl sm:text-2xl font-medium mb-6 sm:mb-8 text-gray-900">{t("shop.categoryPages.flavors.title")}</h1>

        <div className="w-full h-[300px] sm:h-[400px] md:h-[350px] mb-8 sm:mb-12 relative overflow-hidden rounded-2xl shadow-lg">
          {/* Desktop Banner */}
          <Image
            src="/images/banner/flavor banner.webp"
            alt="Flavor Banner"
            fill
            className="object-cover object-center hidden md:block"
            priority
            quality={90}
            sizes="(max-width: 768px) 100vw, 100vw"
            loading="eager"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YxZjVmOSIvPjwvc3ZnPg=="
          />
          {/* Mobile Banner */}
          <Image
            src="/images/banner/flavor mobile.webp"
            alt="Flavor Banner Mobile"
            fill
            className="object-cover object-center md:hidden"
            priority
            quality={90}
            sizes="100vw"
            loading="eager"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YxZjVmOSIvPjwvc3ZnPg=="
          />
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-3 sm:py-4 rounded-xl mb-6 sm:mb-8 shadow-sm">
            {error}
          </div>
        )}

        {/* Loading state */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 sm:py-16">
            <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-[#12d6fa] mb-3 sm:mb-4" />
            <p className="text-sm sm:text-base text-gray-600 font-medium">{t("shop.categoryPages.loadingProducts")}</p>
          </div>
        ) : (
          <>
            {/* Bundles & Promotions Section */}
            {bundleSubcategorySections.filter(section => section.bundles.length > 0).length > 0 && (
              <div className="mb-12 sm:mb-16">
                <div className="space-y-8 sm:space-y-12">
                  {bundleSubcategorySections.filter(section => section.bundles.length > 0).map((section) => (
                    <div key={section._id} className="space-y-4 sm:space-y-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        {section.name}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {section.bundles.map((bundle) => {
                          return (
                          <BundleStyleProductCard
                            key={bundle._id}
                            dir={isRTL ? "rtl" : "ltr"}
                            product={{
                              _id: bundle._id,
                              id: bundle._id,
                              name: bundle.name, // Keep original name, component will handle display
                              slug: bundle.slug,
                              title: bundle.name, // Keep original name as title, component will use nameAr if available
                              image: bundle.image || "/placeholder.svg",
                              price: bundle.price,
                              compareAtPrice: bundle.originalPrice,
                              rating: bundle.rating || 0,
                              reviewCount: bundle.reviews || 0,
                              description: bundle.description,
                              category: "flavors",
                              subcategory: bundle.subcategory || "Bundles & Promotions of Flavors",
                              inStock: true,
                              badges: bundle.badge ? [bundle.badge] : undefined,
                              // Ensure nameAr is passed through - this is crucial for Arabic display
                              nameAr: (bundle as any)?.nameAr || undefined,
                            }}
                            onAddToCart={({ productId, qty }: { productId: string; qty: number }) => {
                              // Create unique cart item ID like main shop
                              const uniqueCartItemId = `${productId}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
                              
                              // Use getProductImageUrl utility for consistent image processing
                              const displayImage = getProductImageUrl(bundle, '/placeholder.svg')
                              
                              // Use Arabic name for cart if RTL
                              const bundleCartName = (isRTL && (bundle as any)?.nameAr) ? (bundle as any).nameAr : bundle.name
                              const cartItem = {
                                id: uniqueCartItemId,
                                name: bundleCartName, // Use Arabic name if RTL
                                price: bundle.price,
                                quantity: qty,
                                image: displayImage, // Use processed image URL
                                category: "flavors",
                                bundleId: productId,
                                productId: undefined, // Bundles don't have productId
                                productType: 'bundle' as const,
                                isBundle: true
                              }
                              addItem(cartItem)
                              triggerAddAnimation(cartItem) // Match main shop animation
                            }}
                            onAddToWishlist={() => {}}
                            onAddToComparison={() => {}}
                            onProductView={() => {}}
                            className="h-full"
                          />
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {/* Product Sections */}
            {subcategorySections.filter(section => section.products.length > 0).map((section) => (
              <div key={section._id} className="mb-12 sm:mb-16">
                <h2 className="text-lg sm:text-xl font-medium mb-4 sm:mb-6 text-gray-900">{isRTL && section.name === 'Premium Flavors' ? 'النكهات الفاخرة' : section.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                  {section.products.map((product) => renderProductCard(product))}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </PageLayout>
  )
}
