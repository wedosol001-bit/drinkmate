/**
 * Script to check "Aqualine Starter Kit Soda Maker" product
 * and determine if it's being routed as a bundle or regular product
 */

const mongoose = require('mongoose');
const Product = require('../Models/product-model');

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/drinkmates';

async function checkAqualineRouting() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Find all products that might match
    const products = await Product.find({
      $or: [
        { name: { $regex: /Aqualine/i } },
        { slug: { $regex: /aqualine/i } }
      ]
    });

    if (products.length === 0) {
      console.log('No product found with "Aqualine" in name or slug.');
      console.log('\nSearching for products with "Starter Kit" in name...\n');
      
      const starterKitProducts = await Product.find({
        name: { $regex: /Starter Kit/i }
      });
      
      console.log(`Found ${starterKitProducts.length} product(s) with "Starter Kit" in name:`);
      starterKitProducts.forEach(p => {
        console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`Name: ${p.name}`);
        console.log(`Slug: ${p.slug}`);
        console.log(`Category: ${p.category}`);
        console.log(`Subcategory: ${p.subcategory}`);
        console.log(`Has Variants: ${p.hasVariants}`);
        console.log(`Variants Count: ${p.variants?.length || 0}`);
        
        // Check if it would be treated as a bundle
        const isBundle = !p.hasVariants && (
          (p.subcategory?.toLowerCase() || '').includes('bundle') || 
          (p.name?.toLowerCase() || '').includes('bundle')
        );
        
        const categoryName = typeof p.category === 'string' ? p.category : (p.category?.name || '').toLowerCase();
        const category = categoryName.toLowerCase().trim();
        
        console.log(`Would be treated as bundle: ${isBundle}`);
        console.log(`Category name: ${categoryName}`);
        
        // Estimate URL
        let url = `/shop/${category}/${p.slug}`;
        if (isBundle) {
          url = `/shop/${category}/bundles/${p.slug}`;
        }
        console.log(`Estimated URL: ${url}`);
      });
    } else {
      products.forEach(p => {
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Name: ${p.name}`);
        console.log(`Slug: ${p.slug}`);
        console.log(`Category: ${p.category}`);
        console.log(`Subcategory: ${p.subcategory}`);
        console.log(`Has Variants: ${p.hasVariants}`);
        console.log(`Variants Count: ${p.variants?.length || 0}`);
        
        // Check if it would be treated as a bundle
        const isBundle = !p.hasVariants && (
          (p.subcategory?.toLowerCase() || '').includes('bundle') || 
          (p.name?.toLowerCase() || '').includes('bundle')
        );
        
        const categoryName = typeof p.category === 'string' ? p.category : (p.category?.name || '').toLowerCase();
        const category = categoryName.toLowerCase().trim();
        
        console.log(`Would be treated as bundle: ${isBundle}`);
        console.log(`Category name: ${categoryName}`);
        
        // Estimate URL
        let url = `/shop/${category}/${p.slug}`;
        if (isBundle) {
          url = `/shop/${category}/bundles/${p.slug}`;
        }
        console.log(`Estimated URL: ${url}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
      });
    }

    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
checkAqualineRouting();

