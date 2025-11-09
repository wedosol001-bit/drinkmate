/**
 * Utility functions for handling product categories
 */

// Category translations mapping
const categoryTranslations: Record<string, { en: string; ar: string }> = {
  '68c0583c2fc1cff30bf5c10c': { en: 'CO2 Cylinders', ar: 'أسطوانات ثاني أكسيد الكربون' },
  'sodamakers': { en: 'Sodamakers', ar: 'صانعات الصودا' },
  'accessories': { en: 'Accessories', ar: 'الإكسسوارات' },
  'flavors': { en: 'Flavors', ar: 'النكهات' },
  'co2-cylinders': { en: 'CO2 Cylinders', ar: 'أسطوانات ثاني أكسيد الكربون' },
  'flavor-bundles': { en: 'Flavor Bundles', ar: 'باقات النكهات' },
  'accessory-bundles': { en: 'Accessory Bundles', ar: 'باقات الإكسسوارات' }
}

/**
 * Extracts the category name from a product category field
 * Handles both string and object formats
 * @param category - Category string or object
 * @param isRTL - Whether to return Arabic name (default: false)
 */
export function getCategoryName(category: string | { _id?: string; name?: string; nameAr?: string; slug?: string } | undefined, isRTL: boolean = false): string {
  if (!category) {
    return isRTL ? 'منتج' : 'Product';
  }

  if (typeof category === 'string') {
    // If it's a string, try to find translation
    const translation = categoryTranslations[category.toLowerCase()] || categoryTranslations[category]
    if (translation) {
      return isRTL ? translation.ar : translation.en
    }
    return category;
  }

  // If category object has nameAr and we want Arabic, use it
  if (isRTL && category.nameAr) {
    return category.nameAr;
  }

  if (category.name) {
    return category.name;
  }

  // If category is an object with only _id, try to map it to a known category name
  if (category._id) {
    const translation = categoryTranslations[category._id]
    if (translation) {
      return isRTL ? translation.ar : translation.en
    }
    return isRTL ? 'منتج' : 'Product';
  }

  return isRTL ? 'منتج' : 'Product';
}

/**
 * Gets the category slug from a product category field
 */
export function getCategorySlug(category: string | { _id: string; name: string; slug: string } | undefined): string {
  if (!category) {
    return 'product';
  }

  if (typeof category === 'string') {
    return category.toLowerCase().replace(/\s+/g, '-');
  }

  if (category.slug) {
    return category.slug;
  }

  if (category.name) {
    return category.name.toLowerCase().replace(/\s+/g, '-');
  }

  return 'product';
}
