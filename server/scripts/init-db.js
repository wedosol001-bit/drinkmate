const mongoose = require('mongoose');

// Simple function to initialize database with default data
const initializeDatabase = async () => {
  try {
    // Wait for MongoDB to be available
    console.log('🔍 Waiting for MongoDB connection...');
    
    // Try to connect to MongoDB Atlas
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/drinkmate';
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });
    
    console.log('✅ Connected to MongoDB');
    
    // Import models
    const Category = require('../Models/category-model');
    const Subcategory = require('../Models/subcategory-model');
    
    // Check if categories already exist
    const existingCategories = await Category.find();
    if (existingCategories.length > 0) {
      console.log('📝 Categories already exist, skipping creation');
      return;
    }
    
    console.log('🚀 Creating default categories...');
    
    // Create default categories
    const categories = [
      {
        name: 'Soda Makers',
        slug: 'sodamakers',
        description: 'Professional soda making machines',
        isActive: true
      },
      {
        name: 'Flavors',
        slug: 'flavors',
        description: 'Premium Italian flavor syrups',
        isActive: true
      },
      {
        name: 'Accessories',
        slug: 'accessories',
        description: 'Essential soda making accessories',
        isActive: true
      },
      {
        name: 'Kits',
        slug: 'kits',
        description: 'Complete starter packages',
        isActive: true
      }
    ];
    
    const createdCategories = await Category.insertMany(categories);
    console.log('✅ Created categories:', createdCategories.map(c => c.name));
    
    // Create subcategories
    const subcategories = [
      // Soda Makers subcategories
      {
        name: 'Artic Series',
        slug: 'artic-series',
        description: 'Premium Artic soda makers',
        category: createdCategories[0]._id,
        isActive: true
      },
      {
        name: 'Luxe Series',
        slug: 'luxe-series',
        description: 'Luxury soda makers',
        category: createdCategories[0]._id,
        isActive: true
      },
      {
        name: 'Omni Series',
        slug: 'omni-series',
        description: 'Versatile Omni soda makers',
        category: createdCategories[0]._id,
        isActive: true
      },
      
      // Flavors subcategories
      {
        name: 'Classic Flavors',
        slug: 'classic-flavors',
        description: 'Traditional soda flavors',
        category: createdCategories[1]._id,
        isActive: true
      },
      {
        name: 'Premium Flavors',
        slug: 'premium-flavors',
        description: 'Exclusive premium flavors',
        category: createdCategories[1]._id,
        isActive: true
      },
      {
        name: 'Mocktail Flavors',
        slug: 'mocktail-flavors',
        description: 'Non-alcoholic cocktail flavors',
        category: createdCategories[1]._id,
        isActive: true
      },
      
      // Accessories subcategories
      {
        name: 'Bottles',
        slug: 'bottles',
        description: 'Premium soda bottles',
        category: createdCategories[2]._id,
        isActive: true
      },
      {
        name: 'CO2 Cylinders',
        slug: 'co2-cylinders',
        description: 'Carbon dioxide cylinders',
        category: createdCategories[2]._id,
        isActive: true
      },
      {
        name: 'Tools',
        slug: 'tools',
        description: 'Soda making tools and equipment',
        category: createdCategories[2]._id,
        isActive: true
      },
      
      // Kits subcategories
      {
        name: 'Standard',
        slug: 'standard',
        description: 'Standard starter packages',
        category: createdCategories[3]._id,
        isActive: true
      },
      {
        name: 'Starter',
        slug: 'starter',
        description: 'Essential starter packages',
        category: createdCategories[3]._id,
        isActive: true
      },
      {
        name: 'Premium',
        slug: 'premium',
        description: 'Premium starter packages',
        category: createdCategories[3]._id,
        isActive: true
      }
    ];
    
    const createdSubcategories = await Subcategory.insertMany(subcategories);
    console.log('✅ Created subcategories:', createdSubcategories.map(s => s.name));
    
    console.log('🎉 Database initialization complete!');
    console.log(`📊 Created ${createdCategories.length} categories and ${createdSubcategories.length} subcategories`);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error.message);
    console.log('💡 Make sure MongoDB is running on localhost:27017');
  } finally {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
      console.log('🔌 MongoDB connection closed');
    }
  }
};

// Run the initialization
initializeDatabase();
