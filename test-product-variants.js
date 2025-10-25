// Test script to create a product with variants
const testProduct = {
  name: "Premium Soda Maker - Color Variants",
  category: "sodamakers",
  subcategory: "premium",
  price: 299.99,
  originalPrice: 399.99,
  stock: 50,
  description: "High-quality soda maker with multiple color options",
  shortDescription: "Premium soda maker with color variants",
  fullDescription: "A high-quality soda maker available in multiple colors. Each variant offers the same great functionality with different aesthetic options.",
  sku: "PSM-COLOR-VAR",
  brand: "Drinkmate",
  status: "active",
  hasVariants: true,
  variants: [
    {
      name: "Red",
      sku: "PSM-RED-001",
      price: 299.99,
      originalPrice: 399.99,
      stock: 10,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      attributes: {
        color: "Red",
        colorAr: "أحمر"
      },
      isDefault: true
    },
    {
      name: "Blue",
      sku: "PSM-BLUE-001", 
      price: 319.99,
      originalPrice: 419.99,
      stock: 8,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      attributes: {
        color: "Blue",
        colorAr: "أزرق"
      },
      isDefault: false
    },
    {
      name: "Black",
      sku: "PSM-BLACK-001",
      price: 279.99,
      originalPrice: 379.99,
      stock: 15,
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
      attributes: {
        color: "Black",
        colorAr: "أسود"
      },
      isDefault: false
    }
  ],
  images: [
    {
      url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop",
      alt: "Premium Soda Maker",
      isPrimary: true,
      order: 0
    }
  ],
  isBestSeller: true,
  isNewProduct: false,
  isFeatured: true,
  isEcoFriendly: true,
  weight: "2.5",
  dimensions: "25 x 20 x 30",
  warranty: "2 years",
  features: [
    "Premium build quality",
    "Multiple color options", 
    "Easy to use",
    "Durable construction"
  ],
  specifications: {
    material: "Premium plastic and metal",
    capacity: "1 liter",
    power: "Manual operation",
    dimensions: "25 x 20 x 30 cm"
  },
  safetyFeatures: [
    "Safety lock mechanism",
    "Non-slip base",
    "Child-safe design"
  ]
};

console.log('Test product data:');
console.log(JSON.stringify(testProduct, null, 2));

// Test the price range calculation
const prices = testProduct.variants.map(v => v.price);
const minPrice = Math.min(...prices);
const maxPrice = Math.max(...prices);

console.log('\nPrice range calculation:');
console.log(`Min price: ${minPrice}`);
console.log(`Max price: ${maxPrice}`);
console.log(`Price range: ${minPrice} - ${maxPrice} SAR`);

console.log('\nVariants summary:');
testProduct.variants.forEach((variant, index) => {
  console.log(`${index + 1}. ${variant.name} - ${variant.price} SAR (Stock: ${variant.stock})`);
});
