const product = {
  name: 'Aqualine Starter Kit Soda Maker',
  slug: 'aqualine-starter-kit-soda-maker',
  category: { name: 'Starter Kits', slug: 'starter-kits' },
  subcategory: '',
  hasVariants: true
};

const categoryName = typeof product.category === 'string' ? product.category : (product.category?.name || '').toLowerCase();
const category = categoryName.toLowerCase().trim();

const isBundle = !product.hasVariants && (
  (product.subcategory?.toLowerCase() || '').includes('bundle') || 
  (product.name?.toLowerCase() || '').includes('bundle')
);

console.log('Product:', product.name);
console.log('Category:', category);
console.log('Would be bundle:', isBundle);
console.log('URL:', isBundle ? `/shop/${category}/bundles/${product.slug}` : `/shop/${category}/${product.slug}`);

