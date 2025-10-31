/**
 * Centralized product URL generation
 * Handles all product routing consistently across the site
 */

export function getProductUrl(product: any): string {
  if (!product?.slug) {
    console.warn('Product missing slug:', product);
    return '/shop';
  }
  
  // Extract category in a robust way
  let categoryName = '';
  
  if (typeof product.category === 'string') {
    categoryName = product.category;
  } else if (product.category?.name) {
    categoryName = product.category.name;
  } else if (product.category?.slug) {
    categoryName = product.category.slug;
  } else if (product.category?._id) {
    // If it's an ObjectId, we can't determine category from it
    // This should be handled by populating the category
    console.warn('Product has category ObjectId but not populated:', product.category);
  }
  
  const category = categoryName.toLowerCase().trim();
  
  // Handle bundles (but NOT variant products)
  // Variant products should never be treated as bundles
  const isBundle = !product.hasVariants && (
    product.subcategory?.toLowerCase().includes('bundle') || 
    product.name?.toLowerCase().includes('bundle') ||
    product.title?.toLowerCase().includes('bundle')
  );
  
  if (isBundle) {
    if (matchesCategory(category, ['flavors', 'flavor'])) {
      return `/shop/flavor/bundles/${product.slug}`;
    }
    if (matchesCategory(category, ['accessories', 'accessory'])) {
      return `/shop/accessories/bundles/${product.slug}`;
    }
    if (matchesCategory(category, ['sodamakers', 'sodamaker', 'machine', 'machines'])) {
      return `/shop/sodamakers/bundles/${product.slug}`;
    }
    return `/shop/${category}/bundles/${product.slug}`;
  }
  
  // Handle regular products
  if (matchesCategory(category, ['flavors', 'flavor'])) {
    return `/shop/flavor/${product.slug}`;
  }
  if (matchesCategory(category, ['accessories', 'accessory'])) {
    return `/shop/accessories/${product.slug}`;
  }
  if (matchesCategory(category, ['co2-cylinders', 'co2-cylinder', 'co2'])) {
    return `/shop/co2-cylinders/${product.slug}`;
  }
  // Handle starter-kits category (can be "starter-kits", "starter kits", "Starter Kits", etc.)
  const normalizedCategory = category.replace(/[\s_-]/g, '').toLowerCase();
  if (normalizedCategory.includes('starterkit') || 
      matchesCategory(category, ['sodamakers', 'sodamaker', 'machine', 'machines', 'soda-maker', 'soda-makers', 'starter-kits', 'starter kits', 'starterkit'])) {
    return `/shop/sodamakers/${product.slug}`;
  }
  
  // Fallback to generic shop URL
  return `/shop/${product.slug}`;
}

/**
 * Check if a category matches any of the provided keywords
 */
function matchesCategory(category: string, keywords: string[]): boolean {
  return keywords.some(keyword => 
    category === keyword.toLowerCase() ||
    category.includes(keyword.toLowerCase()) ||
    keyword.toLowerCase().includes(category)
  );
}

/**
 * Extract category name from product in a consistent way
 */
export function getCategoryName(product: any): string {
  if (typeof product.category === 'string') {
    return product.category;
  }
  if (product.category?.name) {
    return product.category.name;
  }
  if (product.category?.slug) {
    return product.category.slug;
  }
  return '';
}

/**
 * Extract category slug from product
 */
export function getCategorySlug(product: any): string {
  if (typeof product.category === 'string') {
    return product.category.toLowerCase().replace(/\s+/g, '-');
  }
  if (product.category?.slug) {
    return product.category.slug;
  }
  if (product.category?.name) {
    return product.category.name.toLowerCase().replace(/\s+/g, '-');
  }
  return '';
}
