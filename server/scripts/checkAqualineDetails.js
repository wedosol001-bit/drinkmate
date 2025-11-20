const mongoose = require('mongoose');
const Product = require('../Models/product-model');
const Category = require('../Models/category-model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://wedosol001_db_user:loWTVujexgrdnaOZ@cluster0.k5rmfrm.mongodb.net/drinkmate?retryWrites=true&w=majority&appName=Cluster0';

async function checkAqualineDetails() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find the product
    const product = await Product.findOne({
      name: { $regex: /Aqualine/i }
    });

    if (!product) {
      console.log('Product not found');
      await mongoose.disconnect();
      return;
    }

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Product Name: ${product.name}`);
    console.log(`Slug: ${product.slug}`);
    console.log(`Category ID: ${product.category}`);
    console.log(`Subcategory: ${product.subcategory || '(empty)'}`);
    console.log(`Has Variants: ${product.hasVariants}`);
    console.log(`Variants Count: ${product.variants?.length || 0}`);
    
    // Check if category is ObjectId
    let categoryName = '';
    if (typeof product.category === 'string' && product.category.length === 24) {
      // It's an ObjectId, fetch the category
      const categoryDoc = await Category.findById(product.category);
      if (categoryDoc) {
        categoryName = categoryDoc.name || categoryDoc.slug;
        console.log(`Category Name: ${categoryName}`);
        console.log(`Category Slug: ${categoryDoc.slug}`);
      } else {
        categoryName = product.category;
      }
    } else if (typeof product.category === 'string') {
      categoryName = product.category;
    } else {
      categoryName = product.category?.name || product.category?.slug || '';
    }

    // Check if it would be treated as a bundle
    const isBundle = !product.hasVariants && (
      (product.subcategory?.toLowerCase() || '').includes('bundle') || 
      (product.name?.toLowerCase() || '').includes('bundle')
    );
    
    console.log(`\nWould be treated as bundle: ${isBundle}`);
    console.log(`Category for URL: ${categoryName.toLowerCase().trim()}`);
    
    // Estimate URL
    let url = `/shop/${categoryName.toLowerCase().trim()}/${product.slug}`;
    if (isBundle) {
      url = `/shop/${categoryName.toLowerCase().trim()}/bundles/${product.slug}`;
    } else if (categoryName.toLowerCase().includes('sodamaker') || categoryName.toLowerCase().includes('machine')) {
      url = `/shop/sodamakers/${product.slug}`;
    }
    console.log(`Estimated URL: ${url}`);
    
    // Check variants if any
    if (product.variants && product.variants.length > 0) {
      console.log('\nVariants:');
      product.variants.forEach((v, i) => {
        console.log(`  ${i + 1}. ${v.name} - Price: ${v.price} - Stock: ${v.stock}`);
      });
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

checkAqualineDetails();

