/**
 * Script to check "Aqualine Starter Kit Soda Maker" product
 * and fix its categorization if needed
 */

const mongoose = require('mongoose');
const Product = require('../Models/product-model');

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/drinkmates';

async function checkAqualineProduct() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the product by name
    const products = await Product.find({
      name: { $regex: /Aqualine/i }
    });

    console.log(`Found ${products.length} product(s) matching "Aqualine":`);
    
    products.forEach(product => {
      console.log(`- ID: ${product._id}`);
      console.log(`  Name: ${product.name}`);
      console.log(`  Slug: ${product.slug}`);
      console.log(`  Category: ${product.category}`);
      console.log(`  Subcategory: ${product.subcategory}`);
      console.log(`  Has Variants: ${product.hasVariants}`);
      console.log(`  Variants: ${product.variants?.length || 0}`);
      console.log('');
    });

    // Also search for products with "bundle" in subcategory
    const bundleProducts = await Product.find({
      $or: [
        { subcategory: { $regex: /bundle/i } },
        { name: { $regex: /bundle/i } }
      ]
    }).limit(10);

    console.log(`\nProducts with "bundle" in name or subcategory: ${bundleProducts.length}`);
    bundleProducts.forEach(p => {
      console.log(`- ${p.name} (subcategory: ${p.subcategory})`);
    });

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
checkAqualineProduct();

