const mongoose = require('mongoose');
const Product = require('../Models/product-model');
const Category = require('../Models/category-model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://wedosol001_db_user:loWTVujexgrdnaOZ@cluster0.k5rmfrm.mongodb.net/drinkmate?retryWrites=true&w=majority&appName=Cluster0';

async function checkAqualineFinal() {
  try {
    await mongoose.connect(MONGODB_URI);
    
    const product = await Product.findOne({ slug: 'aqualine-starter-kit-soda-maker' });
    if (product) {
      const cat = await Category.findById(product.category);
      const categorySlug = cat ? cat.slug : product.category;
      const categoryName = cat ? cat.name.toLowerCase() : '';
      
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Product: Aqualine Starter Kit Soda Maker');
      console.log('Category slug:', categorySlug);
      console.log('Category name:', categoryName);
      console.log('Has variants:', product.hasVariants);
      console.log('Subcategory:', product.subcategory || '(empty)');
      
      const isBundle = !product.hasVariants && (
        (product.subcategory?.toLowerCase() || '').includes('bundle') || 
        (product.name?.toLowerCase() || '').includes('bundle')
      );
      
      console.log('Is bundle?', isBundle);
      
      // Check if matches sodamakers category
      const matches = categorySlug === 'kits' || 
                     categorySlug === 'starter-kits' || 
                     categorySlug === 'starter kits' || 
                     categoryName.includes('starter') ||
                     categorySlug.includes('sodamaker');
      
      const url = matches ? `/shop/sodamakers/${product.slug}` : `/shop/${categorySlug}/${product.slug}`;
      console.log('Generated URL:', url);
      console.log('URL Type:', url.includes('/bundles/') ? 'BUNDLE' : url.includes('/sodamakers/') ? 'SODAMAKER PRODUCT' : 'GENERIC');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    } else {
      console.log('Product not found');
    }
    
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkAqualineFinal();

