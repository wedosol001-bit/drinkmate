import { BaseProduct, ProductVariant } from '@/lib/types';

/**
 * Get the display price for a product with variants
 * Returns price range if multiple variants exist, single price if one variant or no variants
 */
export function getProductDisplayPrice(product: BaseProduct): {
  price: number;
  originalPrice?: number;
  priceRange?: { min: number; max: number };
  hasVariants: boolean;
} {
  if (!product.hasVariants || !product.variants || product.variants.length === 0) {
    return {
      price: product.price,
      originalPrice: product.originalPrice,
      hasVariants: false
    };
  }

  const prices = product.variants.map(variant => variant.price);
  const originalPrices = product.variants
    .map(variant => variant.originalPrice || variant.price)
    .filter(price => price > 0);

  return {
    price: Math.min(...prices),
    originalPrice: originalPrices.length > 0 ? Math.max(...originalPrices) : undefined,
    priceRange: {
      min: Math.min(...prices),
      max: Math.max(...prices)
    },
    hasVariants: true
  };
}

/**
 * Get the default variant for a product
 */
export function getDefaultVariant(product: BaseProduct): ProductVariant | null {
  if (!product.hasVariants || !product.variants || product.variants.length === 0) {
    return null;
  }

  return product.variants.find(variant => variant.isDefault) || product.variants[0];
}

/**
 * Get variant by ID
 */
export function getVariantById(product: BaseProduct, variantId: string): ProductVariant | null {
  if (!product.hasVariants || !product.variants) return null;
  return product.variants.find(variant => variant._id === variantId) || null;
}

/**
 * Get the display image for a product (default variant or main product image)
 */
export function getProductDisplayImage(product: BaseProduct, selectedVariant?: ProductVariant): string {
  if (selectedVariant?.image) {
    return selectedVariant.image;
  }

  if (product.hasVariants && product.variants && product.variants.length > 0) {
    const defaultVariant = getDefaultVariant(product);
    if (defaultVariant?.image) {
      return defaultVariant.image;
    }
  }

  // Fallback to main product image
  if (typeof product.image === 'string') {
    return product.image;
  }

  if (product.images && product.images.length > 0) {
    const primaryImage = product.images.find(img => 
      typeof img === 'object' && img.isPrimary
    );
    if (primaryImage && typeof primaryImage === 'object') {
      return primaryImage.url;
    }
    
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      return firstImage;
    } else if (typeof firstImage === 'object') {
      return firstImage.url;
    }
  }

  return '/placeholder.svg';
}

/**
 * Get all images for a product including variant images
 */
export function getProductAllImages(product: BaseProduct, selectedVariant?: ProductVariant): string[] {
  const images: string[] = [];

  // Add variant images if selected
  if (selectedVariant?.images) {
    selectedVariant.images.forEach(img => {
      if (typeof img === 'string') {
        images.push(img);
      } else if (typeof img === 'object') {
        images.push(img.url);
      }
    });
  }

  // Add main product images
  if (product.images) {
    product.images.forEach(img => {
      if (typeof img === 'string') {
        images.push(img);
      } else if (typeof img === 'object') {
        images.push(img.url);
      }
    });
  }

  // Add main product image if not already included
  if (product.image && !images.includes(product.image)) {
    images.unshift(product.image);
  }

  return images;
}

/**
 * Format price range display
 */
export function formatPriceRange(minPrice: number, maxPrice: number, currency: string = 'SAR'): string {
  if (minPrice === maxPrice) {
    return `${minPrice} ${currency}`;
  }
  return `${minPrice} - ${maxPrice} ${currency}`;
}
