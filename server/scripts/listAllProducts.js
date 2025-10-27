const mongoose = require('mongoose');
const Product = require('../Models/product-model');
const Bundle = require('../Models/bundle-model');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://test1234:IhpDHsYWshrvtLQc@cluster0.y205sfi.mongodb.net/drinkmate?retryWrites=true&w=majority&appName=Cluster0';

async function listAllProducts() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    const products = await Product.find({}).select('name slug category subcategory hasVariants variants').limit(50);
    console.log(`Total Products: ${products.length}\n`);
    
    products.forEach((p, index) => {
      console.log(`${index + 1}. ${p.name}`);
      console.log(`   Slug: ${p.slug}`);
      console.log(`   Category: ${p.category}`);
      console.log(`   Subcategory: ${p.subcategory}`);
      console.log(`   Has Variants: ${p.hasVariants}`);
      console.log(`   Variants: ${p.variants?.length || 0}`);
      console.log('');
    });

    const bundles = await Bundle.find({}).select('name slug category').limit(20);
    console.log(`\nTotal Bundles: ${bundles.length}\n`);
    bundles.forEach((b, index) => {
      console.log(`${index + 1}. ${b.name}`);
      console.log(`   Slug: ${b.slug}`);
      console.log(`   Category: ${b.category}`);
      console.log('');
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

listAllProducts();

