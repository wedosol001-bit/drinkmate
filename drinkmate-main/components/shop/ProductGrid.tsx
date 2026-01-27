"use client"

import React, { useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle, RefreshCw } from 'lucide-react'
import BundleStyleProductCard from './BundleStyleProductCard'
import ProductCardSkeleton from './ProductCardSkeleton'
import { ProductGridProps, Product } from '@/lib/types'
import { useCart } from '@/hooks/use-cart'
import { useCartAnimations } from '@/hooks/use-cart-animations'
import { getProductImageUrl, getImageUrl } from '@/lib/utils/image-utils'
import { getCategoryName } from '@/lib/utils/category-utils'
import { useTranslation } from '@/lib/contexts/translation-context'

const EmptyState = ({ onRetry, isRTL }: { onRetry?: () => void; isRTL?: boolean }) => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <AlertCircle className="w-12 h-12 text-gray-400" />
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-2">
      No products found
    </h3>
    <p className="text-gray-600 mb-6 max-w-md mx-auto">
      We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
    </p>
    {onRetry && (
      <Button onClick={onRetry} variant="outline">
        <RefreshCw className="w-4 h-4 mr-2" />
        Try Again
      </Button>
    )}
  </div>
)

export default function ProductGrid({
  products,
  dir = "ltr",
  className = "",
  loading = false,
  onAddToWishlist,
  onAddToComparison,
  onProductView,
  wishlist = [],
  comparisonList = []
}: ProductGridProps & {
  onAddToWishlist?: (product: Product) => void
  onAddToComparison?: (product: Product) => void
  onProductView?: (product: Product) => void
  wishlist?: Product[]
  comparisonList?: Product[]
}) {
  console.log('🎯 ProductGrid received products:', products.length, products.map(p => ({ name: p.name, category: p.category })))
  const { addItem } = useCart()
  const { animationState, triggerAddAnimation, hideNotification } = useCartAnimations()
  const { isRTL } = useTranslation()

  // Convert old product format to new format if needed
  const convertProduct = (product: any): Product => {
    // Add safety check for undefined product
    if (!product) {
      console.error('convertProduct called with undefined product')
      throw new Error('Product is undefined')
    }
    
    // If it's already in the new format, return as is
    if (product.id && product.slug) {
      return product
    }

    // Generate slug if missing
    const generateSlug = (title: string, id: string): string => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim() + `-${id.slice(-6)}`
    }

    const productId = product._id || product.id
    const productTitle = (() => {
      const arName = (product as any)?.nameAr || (product as any)?.titleAr
      if (isRTL && arName) return arName
      return product.name || product.title || 'product'
    })()
    const productSlug = product.slug || generateSlug(productTitle, productId)
    
    // Get the primary image using the utility function
    const primaryImage = getProductImageUrl(product, '/placeholder-product.jpg')

    // Convert from old format
    const convertedProduct = {
      _id: productId,
      id: productId,
      name: product.name || product.title || 'product',
      nameAr: (product as any)?.nameAr || (product as any)?.titleAr,
      slug: productSlug,
      title: productTitle,
      image: primaryImage,
      images: product.images || [], // Pass through the full images array
      rating: product.rating,
      reviewCount: product.reviewsCount || product.reviewCount,
      price: product.price || 0,
      compareAtPrice: product.compareAtPrice,
      inStock: product.inStock !== false,
      badges: product.badges || [],
      variants: product.variants?.map((v: any) => {
        // Get variant image using the utility function
        const variantImage = getImageUrl(v.image || product.images?.[0] || primaryImage, primaryImage)
        
        return {
          id: v._id || v.id || `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          colorName: v.name || v.colorName,
          colorHex: v.colorHex || v.value,
          image: variantImage,
          price: v.price || product.price,
          compareAtPrice: v.compareAtPrice || product.compareAtPrice,
          inStock: (v.stock || product.stock || 0) > 0
        }
      }) || [],
      description: product.description,
      category: product.category,
      brand: product.brand,
      tags: product.tags || []
    }
    
    console.log('ProductGrid - original product:', product)
    console.log('ProductGrid - converted product inStock:', convertedProduct.inStock)
    console.log('ProductGrid - original product inStock:', product.inStock)
    console.log('ProductGrid - original product stock:', product.stock)
    
    return convertedProduct
  }

  // Convert all products once for consistent data
  const convertedProducts = useMemo(() => {
    return products.map(product => convertProduct(product))
  }, [products, isRTL])
  
  // Keep reference to original products to access nameAr
  const originalProductsMap = useMemo(() => {
    const map = new Map()
    products.forEach(p => {
      const id = p._id || p.id
      if (id) map.set(id, p)
    })
    return map
  }, [products])

  // Loading state
  if (loading) {
    return (
      <div className={className}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    )
  }

  // Empty state - removed to avoid duplicate with shop page's empty state
  // The parent component (shop page) handles empty states more comprehensively
  // if (products.length === 0) {
  //   return <EmptyState isRTL={dir === "rtl"} />
  // }

  const handleAddToCart = (payload: { productId: string; variantId?: string; qty: number; isBundle?: boolean }) => {
    console.log('handleAddToCart called with payload:', payload)
    console.log('Available converted products:', convertedProducts.map(p => ({ id: p.id, title: p.title })))
    
    const product = convertedProducts.find(p => p.id === payload.productId)
    console.log('Found product:', product)
    
    if (!product) {
      console.error('Product not found with ID:', payload.productId)
      console.error('Available product IDs:', convertedProducts.map(p => p.id))
      return
    }
    
    // Use the same image URL that's displayed on the shop page
    const displayImage = getProductImageUrl(product, '/placeholder-product.jpg')
    console.log('Display image (processed):', displayImage)
    
    const isBundle = payload.isBundle || (product as any).isBundle || false
    // Use stable productId as cart item ID so same products combine in cart
    // For products with variants, they navigate to detail page, so this only applies to products without variants
    const cartItemId = payload.productId
    
    // Get original product to access nameAr
    const originalProduct = originalProductsMap.get(payload.productId)
    const categoryName = getCategoryName(product.category, false)
    const categoryNameAr = getCategoryName(product.category, true)
    
    const cartItem = {
      id: cartItemId,
      name: product.name || product.title || '',
      nameAr: (product as any)?.nameAr || (originalProduct as any)?.nameAr,
      price: product.price,
      quantity: payload.qty,
      image: displayImage, // Use the processed image URL
      category: categoryName,
      categoryAr: categoryNameAr,
      productId: isBundle ? undefined : payload.productId, // Include product ID for regular products
      bundleId: isBundle ? payload.productId : undefined, // Include bundle ID for bundles
      productType: isBundle ? 'bundle' as const : 'product' as const,
      isBundle: isBundle
    }

    console.log('Final cart item:', cartItem)
    addItem(cartItem)
    triggerAddAnimation(cartItem)
  }

  // If no products, return empty div to avoid showing duplicate empty state
  // (the parent shop page handles empty states)
  if (convertedProducts.length === 0) {
    return <div className={className}></div>
  }

  return (
    <>
      <div
        dir={dir}
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 items-stretch ${className}`}
      >
        {convertedProducts.map((product, index) => (
          <BundleStyleProductCard
            key={product.id || `product-${index}`}
            product={product}
            dir={dir}
            onAddToCart={handleAddToCart}
            onAddToWishlist={onAddToWishlist}
            onAddToComparison={onAddToComparison}
            onProductView={onProductView}
            isInWishlist={wishlist.some(p => p.id === product.id)}
            isInComparison={comparisonList.some(p => p.id === product.id)}
          />
        ))}
      </div>

    </>
  )
}
