"use client"

// Sodamakers Page - Displays all soda maker products with filtering options
// Version: 1.1.0
// Last updated: September 1, 2025

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
import SaudiRiyal from "@/components/ui/SaudiRiyal"
import BundleStyleProductCard from "@/components/shop/BundleStyleProductCard"
import { convertVariants, getVariantPriceRange } from "@/lib/utils/product-formatting"
import { getProductImageUrl } from "@/lib/utils/image-utils"
import { getCategoryName } from "@/lib/utils/category-utils"
import { useCartAnimations } from "@/hooks/use-cart-animations"
import { getBannerSrc } from "@/lib/utils/banner-paths"
import { BANNER_CONTAINER_CLASS, BANNER_SECTION_CLASS, BANNER_STATIC_HEIGHT_CLASS } from "@/lib/constants/banner-styles"

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
  createdAt?: string
}

interface Bundle {
  _id: string
  id?: string | number
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

export default function SodamakersPage() {
  const { t, isRTL, language } = useTranslation()
  const router = useRouter()
  const { addItem, isInCart } = useCart()
  const { triggerAddAnimation } = useCartAnimations()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  // State for products and bundles
  const [bundles, setBundles] = useState<Bundle[]>([])
  const [bundleSubcategorySections, setBundleSubcategorySections] = useState<Array<{ _id: string; name: string; bundles: Bundle[] }>>([])
  const [allSodaMakers, setAllSodaMakers] = useState<Product[]>([])
  const [subcategorySections, setSubcategorySections] = useState<Array<{ _id: string; name: string; products: Product[] }>>([])


  // Define fetch function
  async function fetchProducts() {
    try {
      setIsLoading(true)
      setError("")

      // Fetch bundles for sodamakers category only
      const bundlesResponse = await shopAPI.getBundles({
        category: "sodamakers",
        limit: 4,
      })

      // Format bundles data - only use sodamakers bundles
      const bundlesToUse = bundlesResponse.bundles || []
      
      const formattedBundles = bundlesToUse.map((bundle: any) => {
        return {
        _id: bundle._id,
        id: bundle._id,
        slug: bundle.slug,
        name: bundle.name,
        nameAr: bundle.nameAr || bundle.titleAr, // Preserve Arabic name
        price: bundle.price,
        originalPrice: bundle.originalPrice,
        subcategory: bundle.subcategory || "Bundles & Promotions of Soda Makers",
        image: (() => {
          if (bundle.images && bundle.images.length > 0) {
            // Handle different image formats
            const firstImage = bundle.images[0]
            if (typeof firstImage === 'string') {
              return firstImage
            } else if (firstImage && firstImage.url) {
              return firstImage.url
            }
          }
          return "/images/02 - Soda Makers/Artic-Black-Machine---Front.png"
        })(),
        description: bundle.shortDescription || "Premium soda maker bundle",
        rating: bundle.averageRating || 5,
        reviews: bundle.reviewCount || 300,
        badge: bundle.isFeatured ? "POPULAR" : bundle.isLimited ? "SALE" : undefined,
      }
      })

      setBundles(formattedBundles)

      // Organize bundles by subcategory
      const bundleBySubcategory: Record<string, Bundle[]> = {}
      for (const bundle of formattedBundles) {
        const subcategory = bundle.subcategory || "Bundles & Promotions of Soda Makers"
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

      // Fetch categories and find BOTH Soda Makers AND Kits categories
      const categoriesResp = await shopAPI.getCategories()
      const categoriesWithSubs = categoriesResp.categories || []
      
      // Find Soda Makers category
      const sodaMakersCat = categoriesWithSubs.find((c: any) => {
        const name = (c.name || '').toLowerCase()
        const slug = (c.slug || '').toLowerCase()
        return (name.includes('soda') && !name.includes('starter')) || 
               (slug.includes('sodamaker') && !slug.includes('starter')) || 
               slug === 'sodamakers' || 
               slug === 'soda-makers'
      })
      
      // Find Kits category (separate category)
      const kitsCat = categoriesWithSubs.find((c: any) => {
        const name = (c.name || '').toLowerCase()
        const slug = (c.slug || '').toLowerCase()
        return name === 'kits' || 
               slug === 'kits' ||
               (name.includes('kit') && !name.includes('starter'))
      })

      const sodaMakersSlug = sodaMakersCat?.slug || 'sodamakers'
      const kitsSlug = kitsCat?.slug || 'kits'

      // Fetch products from BOTH categories separately (keep them separate for grouping)
      let sodaMakerProducts = [];
      let kitProducts = [];
      
      try {
        // Fetch from Soda Makers category
        const byCategoryResp = await shopAPI.getProductsByCategory(sodaMakersSlug, { limit: 100 })
        sodaMakerProducts = byCategoryResp.products || byCategoryResp.data?.products || []
        console.log(`Found ${sodaMakerProducts.length} products from Soda Makers category (${sodaMakersSlug})`)
      } catch (apiError) {
        console.error('API Error fetching Soda Makers products:', apiError);
        sodaMakerProducts = [];
      }
      
      try {
        // Fetch from Kits category (if different from soda makers)
        if (kitsSlug !== sodaMakersSlug && kitsCat) {
          const kitsResp = await shopAPI.getProductsByCategory(kitsSlug, { limit: 100 })
          kitProducts = kitsResp.products || kitsResp.data?.products || []
          console.log(`Found ${kitProducts.length} products from Kits category (${kitsSlug})`)
        }
      } catch (apiError) {
        console.error('API Error fetching Kits products:', apiError);
        kitProducts = [];
      }

      // Helper to pick first/primary image
      const pickImage = (imgs: any): string => {
        if (!imgs || imgs.length === 0) return "/images/02 - Soda Makers/Artic-Black-Machine---Front.png"
        const first = imgs[0]
        if (typeof first === 'string') return first
        return (imgs.find((img: any) => img.isPrimary)?.url) || first.url || "/images/02 - Soda Makers/Artic-Black-Machine---Front.png"
      }

      // Helper function to normalize subcategory name
      const normalizeSubcategoryName = (name: string | null | undefined): string | null => {
        if (!name) return null
        const nameLower = name.toLowerCase()
        // Convert "Luxe Series" or "luxe-series" to "LUX"
        if (nameLower.includes('luxe') || nameLower === 'lux-series' || nameLower === 'luxe-series') {
          return 'LUX'
        }
        return name
      }

      // Helper function to get subcategory name from product
      const getSubcategoryName = (product: any): string | null => {
        const subcategory = product.subcategory;
        
        // If subcategory is an object (populated by backend), get the name directly and normalize it
        if (typeof subcategory === 'object' && subcategory !== null) {
          return normalizeSubcategoryName(subcategory.name) || null;
        }
        
        // If subcategory is a string (ObjectId or slug), try to match known subcategory IDs/slugs
        if (typeof subcategory === 'string' && subcategory.trim()) {
          const subcategoryLower = subcategory.toLowerCase().trim();
          
          // Known subcategory IDs from admin panel:
          // - Artic Series: 68c0583c2fc1cff30bf5c110 (slug: artic-series)
          // - LUX: 68c0583c2fc1cff30bf5c111 (slug: lux-series)
          // - Omni Series: 68c0583c2fc1cff30bf5c112 (slug: omni-series)
          
          // Check for Artic Series
          if (subcategoryLower === '68c0583c2fc1cff30bf5c110' || 
              subcategoryLower === 'artic-series' || 
              subcategoryLower.includes('artic')) {
            return 'Artic Series';
          }
          
          // Check for LUX
          if (subcategoryLower === '68c0583c2fc1cff30bf5c111' || 
              subcategoryLower === 'lux-series' || 
              subcategoryLower === 'luxe-series' || 
              subcategoryLower.includes('lux')) {
            return 'LUX';
          }
          
          // Check for Omni Series
          if (subcategoryLower === '68c0583c2fc1cff30bf5c112' || 
              subcategoryLower === 'omni-series' || 
              subcategoryLower.includes('omni')) {
            return 'Omni Series';
          }
        }
        
        return null;
      }

      // Format soda maker products (group by subcategory)
      const formattedSodaMakerProducts = sodaMakerProducts.map((product: any) => {
        const productImage = pickImage(product.images)
        const convertedVariants = convertVariants(product, productImage)
        const hasVariants = convertedVariants.length > 0 || product.hasVariants === true
        
        return {
          _id: product._id,
          id: product._id,
          slug: product.slug,
          name: product.name,
          nameAr: product.nameAr || product.titleAr,
          price: product.price,
          originalPrice: product.originalPrice,
          image: productImage,
          category: "sodamakers",
          subcategory: (typeof product.subcategory === 'string' ? product.subcategory : product.subcategory?._id) || product.subcategory,
          subcategoryName: getSubcategoryName(product), // Add subcategory name for grouping
          rating: product.rating || product.averageRating || 0,
          reviewCount: product.reviewsCount || product.reviewCount || 0,
          reviews: product.reviewsCount || product.reviewCount || 0,
          description: product.description || product.shortDescription,
          images: product.images,
          hasVariants: hasVariants,
          variants: convertedVariants,
          brand: product.brand,
          tags: product.tags || [],
          inStock: product.inStock !== false,
        }
      })

      // Format kit products (keep separate, they go under "Kits" heading)
      const formattedKitProducts = kitProducts.map((product: any) => {
        const productImage = pickImage(product.images)
        const convertedVariants = convertVariants(product, productImage)
        const hasVariants = convertedVariants.length > 0 || product.hasVariants === true
        
        // Get subcategory name for kits
        const getKitSubcategoryName = (product: any): string | null => {
          const subcategory = product.subcategory;
          if (typeof subcategory === 'object' && subcategory !== null) {
            return subcategory.name || null;
          }
          if (typeof subcategory === 'string' && subcategory.trim()) {
            const subcategoryLower = subcategory.toLowerCase().trim();
            if (subcategoryLower.includes('standard') || subcategoryLower === 'standard') return 'Standard';
            if (subcategoryLower.includes('starter') || subcategoryLower === 'starter') return 'Starter';
            if (subcategoryLower.includes('premium') || subcategoryLower === 'premium') return 'Premium';
          }
          return null;
        }
        
        return {
          _id: product._id,
          id: product._id,
          slug: product.slug,
          name: product.name,
          nameAr: product.nameAr || product.titleAr,
          price: product.price,
          originalPrice: product.originalPrice,
          image: productImage,
          category: "kits",
          subcategory: (typeof product.subcategory === 'string' ? product.subcategory : product.subcategory?._id) || product.subcategory,
          subcategoryName: getKitSubcategoryName(product), // Kits have subcategories: standard, starter, premium
          rating: product.rating || product.averageRating || 0,
          reviewCount: product.reviewsCount || product.reviewCount || 0,
          reviews: product.reviewsCount || product.reviewCount || 0,
          description: product.description || product.shortDescription,
          images: product.images,
          hasVariants: hasVariants,
          variants: convertedVariants,
          brand: product.brand,
          tags: product.tags || [],
          inStock: product.inStock !== false,
        }
      })

      // Combine all products for setAllSodaMakers (for backward compatibility)
      const allFormattedProducts = [...formattedSodaMakerProducts, ...formattedKitProducts]
      setAllSodaMakers(allFormattedProducts)

      // Group soda maker products by subcategory
      const productSections: Array<{ _id: string; name: string; products: Product[] }> = []
      
      // Group by subcategory for soda maker products
      const productsBySubcategory: Record<string, Product[]> = {}
      
      formattedSodaMakerProducts.forEach((product: any) => {
        const subcategoryName = product.subcategoryName || 'Other'
        if (!productsBySubcategory[subcategoryName]) {
          productsBySubcategory[subcategoryName] = []
        }
        productsBySubcategory[subcategoryName].push(product)
      })
      
      // Create sections for each subcategory (order: Omni Series, LUX, Artic Series, then others)
      const subcategoryOrder = ['Omni Series', 'LUX', 'Artic Series']
      const orderedSubcategories = [
        ...subcategoryOrder.filter(name => productsBySubcategory[name]),
        ...Object.keys(productsBySubcategory).filter(name => !subcategoryOrder.includes(name))
      ]
      
      orderedSubcategories.forEach(subcategoryName => {
        if (productsBySubcategory[subcategoryName] && productsBySubcategory[subcategoryName].length > 0) {
          productSections.push({
            _id: subcategoryName.toLowerCase().replace(/\s+/g, '-'),
            name: subcategoryName,
            products: productsBySubcategory[subcategoryName]
          })
        }
      })
      
      // Add Kits section (if there are any kit products)
      if (formattedKitProducts.length > 0) {
        // Group kit products by subcategory (standard, starter, premium)
        const kitsBySubcategory: Record<string, Product[]> = {}
        
        formattedKitProducts.forEach((product: any) => {
          const subcategoryName = product.subcategoryName || 'Other'
          if (!kitsBySubcategory[subcategoryName]) {
            kitsBySubcategory[subcategoryName] = []
          }
          kitsBySubcategory[subcategoryName].push(product)
        })
        
        // Create sections for each kit subcategory (order: Standard, Starter, Premium)
        const kitSubcategoryOrder = ['Standard', 'Starter', 'Premium']
        const orderedKitSubcategories = [
          ...kitSubcategoryOrder.filter(name => kitsBySubcategory[name]),
          ...Object.keys(kitsBySubcategory).filter(name => !kitSubcategoryOrder.includes(name))
        ]
        
        orderedKitSubcategories.forEach(subcategoryName => {
          if (kitsBySubcategory[subcategoryName] && kitsBySubcategory[subcategoryName].length > 0) {
            productSections.push({
              _id: `kits-${subcategoryName.toLowerCase().replace(/\s+/g, '-')}`,
              name: `Kits - ${subcategoryName}`,
              products: kitsBySubcategory[subcategoryName]
            })
          }
        })
        
        // If no subcategories, add as a single "Kits" section
        if (orderedKitSubcategories.length === 0) {
          productSections.push({
            _id: 'kits',
            name: 'Kits',
            products: formattedKitProducts
          })
        }
      }
      
      setSubcategorySections(productSections)
    } catch (error) {
      console.error("Error fetching products:", error)
      setError(t("shop.categoryPages.failedToLoad"))

      // Do not use static fallback data
      setAllSodaMakers([])
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
    const categoryName = getCategoryName(product.category, false)
    const categoryNameAr = getCategoryName(product.category, true)
    addItem({
      id: product._id,
      name: product.name || '',
      nameAr: (product as any)?.nameAr || undefined,
      price: product.price,
      quantity: 1,
      image: product.image,
      category: categoryName,
      categoryAr: categoryNameAr,
      productId: product._id,
      productType: 'product' as const
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
    const safeSlug = (value?: string) => {
      if (value && typeof value === 'string' && value.trim().length > 0) return value
      const base = (product as any)?.name || String(product._id || '')
      return String(base)
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 120)
    }
    // Use backend-provided slug when available; otherwise fall back to _id so detail can resolve by ID
    const resolvedSlug = ((product as any)?.slug && (product as any).slug.trim().length > 0)
      ? (product as any).slug
      : String(product._id)
    const handleAddToCart = (payload: { productId: string; variantId?: string; qty: number; isBundle?: boolean }) => {
      // Convert payload to proper cart item format
      const categoryName = getCategoryName(product.category, false)
      const categoryNameAr = getCategoryName(product.category, true)
      const cartItem = {
        id: payload.productId,
        name: product.name,
        nameAr: (product as any)?.nameAr,
        price: product.price,
        quantity: payload.qty,
        image: product.image || (typeof product.images?.[0] === 'string' ? product.images[0] : product.images?.[0]?.url || '/placeholder.svg'),
        category: categoryName,
        categoryAr: categoryNameAr,
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

    // Keep original name and title, let BundleStyleProductCard handle Arabic display via nameAr
    const productData = {
      _id: product._id,
      id: product._id,
      name: product.name, // Keep original name, component will handle display
      slug: resolvedSlug,
      title: product.name, // Keep original name as title, component will use nameAr if available
      image: product.image,
      price: product.price,
      compareAtPrice: product.originalPrice,
      rating: product.rating || 0,
      reviewCount: product.reviews || 0,
      description: product.description,
      // Force category context to sodamakers so URL generator routes correctly
      category: 'sodamakers',
      inStock: true,
      badges: (product as any).badge ? [(product as any).badge] : undefined,
      // Pass the images array as well for better image handling
      images: product.images,
      // Include variants if present - this will make the card navigate to detail page instead of direct add to cart
      hasVariants: (product as any).hasVariants || false,
      variants: (product as any).variants || [],
      // Ensure nameAr is passed through for proper Arabic display - this is crucial
      nameAr: (product as any)?.nameAr || undefined,
    }
    
    console.log('Sodamaker page - product data for BundleStyleProductCard:', productData)
    console.log('Sodamaker page - original product:', product)

    return (
      <BundleStyleProductCard
        key={product._id}
        product={productData}
        dir={isRTL ? "rtl" : "ltr"}
        onAddToCart={({ productId, qty }: { productId: string; qty: number }) => {
          // Use stable productId as cart item ID so same products combine in cart
          const cartItemId = productId
          
          // Use getProductImageUrl utility for consistent image processing
          const displayImage = getProductImageUrl(productData, '/placeholder.svg')
          
          // Use getCategoryName utility for consistent category handling
          const categoryName = getCategoryName(product.category, false)
          const categoryNameAr = getCategoryName(product.category, true)
          
          // Store both name and nameAr so cart can display correct language
          const cartItem = {
            id: cartItemId,
            name: product.name || '',
            nameAr: (product as any)?.nameAr || undefined,
            price: product.price,
            quantity: qty,
            image: displayImage, // Use processed image URL
            category: categoryName,
            categoryAr: categoryNameAr,
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
    <PageLayout currentPage="shop-sodamakers">
      <div className={`${BANNER_CONTAINER_CLASS} ${BANNER_SECTION_CLASS}`}>
        {/* Top banner - consistent padding and height with rest of site */}
        <div
          className={`relative w-full overflow-hidden shadow-xl mb-6 sm:mb-8 bg-no-repeat bg-center bg-contain sm:bg-cover ${BANNER_STATIC_HEIGHT_CLASS}`}
          style={{
            backgroundImage: `url(${getBannerSrc("sodamaker", { lang: language })})`,
            backgroundRepeat: 'no-repeat',
          }}
          role="img"
          aria-label={t("shop.categoryPages.sodamakers.title")}
        />

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
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
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
                              category: "sodamakers",
                              subcategory: bundle.subcategory || "Bundles & Promotions of Soda Makers",
                              inStock: true,
                              badges: bundle.badge ? [bundle.badge] : undefined,
                              // Ensure nameAr is passed through - this is crucial for Arabic display
                              nameAr: (bundle as any)?.nameAr || undefined,
                            }}
                            onAddToCart={({ productId, qty }: { productId: string; qty: number }) => {
                              // Use stable productId as cart item ID so same products combine in cart
                              const cartItemId = productId
                              
                              // Use getProductImageUrl utility for consistent image processing
                              const displayImage = getProductImageUrl(bundle, '/placeholder.svg')
                              
                              // Store both name and nameAr so cart can display correct language
                              const categoryName = getCategoryName(bundle.category || 'sodamakers', false)
                              const categoryNameAr = getCategoryName(bundle.category || 'sodamakers', true)
                              const cartItem = {
                                id: cartItemId,
                                name: bundle.name || '',
                                nameAr: (bundle as any)?.nameAr || undefined,
                                price: bundle.price,
                                quantity: qty,
                                image: displayImage, // Use processed image URL
                                category: categoryName,
                                categoryAr: categoryNameAr,
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


            {/* Product Sections - Grouped by Subcategory */}
            {console.log('🔍 Rendering - subcategorySections:', subcategorySections)}
            {console.log('🔍 Rendering - subcategorySections.length:', subcategorySections.length)}
            {subcategorySections.length > 0 ? (
              <div className="space-y-12 sm:space-y-16">
                {subcategorySections.filter(section => section.products.length > 0).map((section) => {
                  console.log('🔍 Rendering section:', section.name, 'with', section.products.length, 'products');
                  return (
                    <div key={section._id} className="space-y-4 sm:space-y-6">
                      <h2 className="text-base sm:text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                        {section.name}
                      </h2>
                      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                        {section.products.map((product) => {
                          console.log('🔍 Rendering product:', product.name);
                          return renderProductCard(product);
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">{t("shop.categoryPages.noProductsFound")}</p>
                <p className="text-gray-400 text-sm mt-2">{t("shop.categoryPages.checkBackLater")}</p>
              </div>
            )}
          </>
        )}
      </div>
    </PageLayout>
  )
}
