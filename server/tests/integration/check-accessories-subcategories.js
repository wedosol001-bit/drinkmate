const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });
require('dotenv').config({ path: path.join(__dirname, '../.env') });
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Category = require('./Models/category-model');
const Subcategory = require('./Models/subcategory-model');

(async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || process.env.MONGODB_URL;
    if (!mongoUri) {
      console.error('❌ MongoDB URI not found');
      process.exit(1);
    }
    
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to DB\n');
    console.log('='.repeat(70));
    console.log('📋 CHECKING ACCESSORIES SUBCATEGORIES');
    console.log('='.repeat(70) + '\n');

    // Find accessories category
    const accessoriesCat = await Category.findOne({ slug: 'accessories' });
    
    if (!accessoriesCat) {
      console.log('❌ Accessories category not found');
      process.exit(1);
    }

    console.log(`📁 Category: ${accessoriesCat.name} (slug: ${accessoriesCat.slug})`);
    console.log(`📁 Category ID: ${accessoriesCat._id}\n`);

    // Get all subcategories for accessories
    const subcategories = await Subcategory.find({ 
      category: accessoriesCat._id 
    }).sort({ name: 1 });

    console.log(`📦 Total subcategories for accessories: ${subcategories.length}\n`);

    if (subcategories.length === 0) {
      console.log('⚠️  No subcategories found for accessories category');
    } else {
      console.log('📋 Subcategories:');
      console.log('-'.repeat(70));
      
      subcategories.forEach((sub, i) => {
        console.log(`\n${i + 1}. ${sub.name}`);
        console.log(`   ID: ${sub._id}`);
        console.log(`   Slug: ${sub.slug}`);
        console.log(`   Active: ${sub.isActive ? 'Yes' : 'No'}`);
        
        // Check if it's related to cylinders
        const nameLower = sub.name.toLowerCase();
        const slugLower = sub.slug.toLowerCase();
        const isCylinder = nameLower.includes('cylinder') || 
                         nameLower.includes('co2') || 
                         slugLower.includes('cylinder') || 
                         slugLower.includes('co2');
        
        if (isCylinder) {
          console.log(`   🔵 THIS IS THE CYLINDER SUBCATEGORY!`);
        }
      });
    }

    // Also check what the category's subcategories array contains
    if (accessoriesCat.subcategories && accessoriesCat.subcategories.length > 0) {
      console.log('\n' + '='.repeat(70));
      console.log('📋 Subcategories from Category.subcategories array:');
      console.log('-'.repeat(70));
      
      for (const subId of accessoriesCat.subcategories) {
        const sub = await Subcategory.findById(subId);
        if (sub) {
          console.log(`   - ${sub.name} (${sub.slug})`);
        } else {
          console.log(`   - ${subId} (not found in Subcategory collection)`);
        }
      }
    }

    await mongoose.disconnect();
    console.log('\n✅ Done');
    
  } catch (e) {
    console.error('❌ Error:', e.message);
    console.error(e.stack);
    process.exit(1);
  }
})();

