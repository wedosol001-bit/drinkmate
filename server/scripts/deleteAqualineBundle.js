/**
 * Script to delete "Aqualine Starter Kit Soda Maker" bundle
 * This bundle is incorrectly categorized and should be deleted
 */

require('dotenv').config();
const mongoose = require('mongoose');
const path = require('path');

// Load .env file from the server directory
const envPath = path.join(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });

const Bundle = require('../Models/bundle-model');

// MongoDB connection URL
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/drinkmate';

async function deleteAqualineBundle() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find the bundle by name
    const bundles = await Bundle.find({
      name: { $regex: /Aqualine Starter Kit/i }
    });

    console.log(`Found ${bundles.length} bundle(s) matching "Aqualine Starter Kit":`);
    
    bundles.forEach(bundle => {
      console.log(`- ID: ${bundle._id}`);
      console.log(`  Name: ${bundle.name}`);
      console.log(`  Slug: ${bundle.slug}`);
      console.log(`  Category: ${bundle.category}`);
      console.log('');
    });

    if (bundles.length === 0) {
      console.log('No bundles found with "Aqualine Starter Kit" name.');
      console.log('Checking all bundles...');
      
      const allBundles = await Bundle.find({});
      console.log(`Total bundles in database: ${allBundles.length}`);
      allBundles.forEach(b => {
        console.log(`- ${b.name} (${b.slug})`);
      });
    } else {
      // Delete all matching bundles
      for (const bundle of bundles) {
        console.log(`Deleting bundle: ${bundle.name} (${bundle._id})`);
        await Bundle.findByIdAndDelete(bundle._id);
        console.log(`✓ Deleted: ${bundle.name}`);
      }
      
      console.log(`\n✓ Successfully deleted ${bundles.length} bundle(s)`);
    }

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('Error deleting bundle:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Run the script
deleteAqualineBundle();

