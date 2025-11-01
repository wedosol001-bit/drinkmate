/**
 * Utility functions for formatting products consistently across all shops
 * This ensures category shops match main shop behavior
 */

import { getImageUrl } from './image-utils'
import { Product } from '@/lib/types'

/**
 * Converts variant from raw API format to standardized format
 * Used by both main shop and category shops for consistency
 */
export function convertVariant(variant: any, product: any, primaryImage: string): any {
  // Get variant image using the utility function
  const variantImage = getImageUrl(variant.image || product.images?.[0] || primaryImage, primaryImage)
  
  return {
    id: variant._id || variant.id || `variant-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    _id: variant._id || variant.id, // Keep _id for compatibility
    colorName: variant.name || variant.colorName,
    colorHex: variant.colorHex || variant.value,
    image: variantImage,
    price: variant.price || product.price || 0,
    compareAtPrice: variant.compareAtPrice || variant.originalPrice || product.compareAtPrice || product.originalPrice,
    inStock: (variant.stock !== undefined ? variant.stock > 0 : (variant.inStock !== undefined ? variant.inStock : (product.stock || product.inStock || 0) > 0)),
    stock: variant.stock || product.stock || 0,
    name: variant.name || variant.colorName || '',
    nameAr: variant.nameAr || variant.colorNameAr || '',
    sku: variant.sku || product.sku || '',
  }
}

/**
 * Converts and formats variants array to match main shop format
 */
export function convertVariants(product: any, primaryImage: string): any[] {
  if (!product.variants || !Array.isArray(product.variants) || product.variants.length === 0) {
    return []
  }
  
  return product.variants.map((v: any) => convertVariant(v, product, primaryImage))
}

/**
 * Calculates price range from variants
 */
export function getVariantPriceRange(variants: any[]): { min: number; max: number } | null {
  if (!variants || variants.length === 0) return null
  
  const prices = variants.map(v => Number(v.price) || 0).filter(p => p > 0)
  if (prices.length === 0) return null
  
  return {
    min: Math.min(...prices),
    max: Math.max(...prices)
  }
}

