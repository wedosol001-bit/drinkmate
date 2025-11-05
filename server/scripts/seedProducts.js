const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/drinkmate';
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  try {
    // Get the Category and Product models
    const Category = mongoose.model('Category', new mongoose.Schema({
      name: String,
      slug: { type: String, unique: true },
      isActive: Boolean
    }, { timestamps: true }), 'categories');
    
    const Product = mongoose.model('Product', new mongoose.Schema({
      name: String,
      slug: { type: String, unique: true },
      description: String,
      category: mongoose.Schema.Types.Mixed,
      subcategory: String,
      price: Number,
      priceCents: Number,
      currency: String,
      stock: Number,
      status: String,
      published: Boolean,
      visibility: String,
      publishedAt: Date,
      isArchived: Boolean,
      images: [{
        url: String,
        alt: String,
        isPrimary: Boolean,
        order: Number
      }],
      sku: String,
      nameAr: String,
      descriptionAr: String
    }, { timestamps: true }), 'products');
    
    // Ensure categories exist (using the actual categories from the system)
    const categories = [
      { name: 'Soda Makers', slug: 'sodamakers', isActive: true },
      { name: 'Flavors', slug: 'flavors', isActive: true },
      { name: 'Accessories', slug: 'accessories', isActive: true },
      { name: 'Kits', slug: 'kits', isActive: true }
    ];
    
    const createdCategories = [];
    for (const cat of categories) {
      const category = await Category.findOneAndUpdate(
        { slug: cat.slug },
        cat,
        { upsert: true, new: true }
      );
      createdCategories.push(category);
      console.log(`Category: ${category.name} (${category.slug})`);
    }
    
    const now = new Date();
    
    // Sample products that will show up in the storefront
    const products = [
      {
        name: 'DrinkMate Premium Flavor Pack',
        slug: 'drinkmate-premium-flavor-pack',
        description: 'A premium selection of Italian flavor syrups perfect for creating delicious sodas at home. Includes 6 different flavors: Cola, Lemon, Orange, Cherry, Grape, and Root Beer.',
        descriptionAr: 'مجموعة نكهات درينكمايت بريميوم - مجموعة مختارة من شراب النكهات الإيطالية المثالية لصنع الصودا اللذيذة في المنزل. تشمل 6 نكهات مختلفة: كولا، ليمون، برتقال، كرز، عنب، وجذر البيرة.',
        category: createdCategories[1]._id, // Flavors category
        subcategory: 'premium-flavors',
        price: 49.99,
        priceCents: 4999,
        currency: 'SAR',
        stock: 100,
        status: 'active',
        published: true,
        visibility: 'public',
        publishedAt: now,
        isArchived: false,
        sku: 'DM-FLAVOR-PACK-001',
        nameAr: 'باقة نكهات درينكمايت بريميوم',
        images: [{
          url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop',
          alt: 'DrinkMate Premium Flavor Pack',
          isPrimary: true,
          order: 0
        }]
      },
      {
        name: 'DrinkMate Soda Maker Machine',
        slug: 'drinkmate-soda-maker-machine',
        description: 'Professional-grade soda maker that carbonates any drink in seconds. Features adjustable carbonation levels, BPA-free bottles, and sleek stainless steel design.',
        descriptionAr: 'آلة صودا درينكمايت - آلة صنع الصودا من الدرجة المهنية التي تفحم أي مشروب في ثوانٍ. تتميز بمستويات كربنة قابلة للتعديل، زجاجات خالية من BPA، وتصميم فولاذي أنيق.',
        category: createdCategories[0]._id, // Soda Makers category
        subcategory: 'artic-series',
        price: 299.99,
        priceCents: 29999,
        currency: 'SAR',
        stock: 25,
        status: 'active',
        published: true,
        visibility: 'public',
        publishedAt: now,
        isArchived: false,
        sku: 'DM-SODA-MAKER-001',
        nameAr: 'آلة صودا درينكمايت',
        images: [{
          url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop',
          alt: 'DrinkMate Soda Maker Machine',
          isPrimary: true,
          order: 0
        }]
      },
      {
        name: 'CO2 Cylinder Refill',
        slug: 'co2-cylinder-refill',
        description: 'High-quality CO2 cylinder refill for your DrinkMate soda maker. 60L capacity, food-grade CO2, and easy installation.',
        descriptionAr: 'إعادة تعبئة أسطوانة CO2 - إعادة تعبئة أسطوانة CO2 عالية الجودة لآلة صودا درينكمايت. سعة 60 لتر، CO2 من الدرجة الغذائية، وتركيب سهل.',
        category: createdCategories[2]._id, // Accessories category
        subcategory: 'co2-cylinders',
        price: 25.00,
        priceCents: 2500,
        currency: 'SAR',
        stock: 50,
        status: 'active',
        published: true,
        visibility: 'public',
        publishedAt: now,
        isArchived: false,
        sku: 'DM-CO2-REFILL-001',
        nameAr: 'إعادة تعبئة أسطوانة CO2',
        images: [{
          url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=400&fit=crop',
          alt: 'CO2 Cylinder Refill',
          isPrimary: true,
          order: 0
        }]
      },
      {
        name: 'DrinkMate Starter Kit',
        slug: 'drinkmate-starter-kit',
        description: 'Complete starter kit including soda maker, 3 flavor syrups, CO2 cylinder, and 2 BPA-free bottles. Everything you need to start making soda at home.',
        descriptionAr: 'طقم درينكمايت للمبتدئين - طقم مبتدئين كامل يشمل آلة الصودا، 3 شراب نكهات، أسطوانة CO2، وزجاجتين خاليتين من BPA. كل ما تحتاجه لبدء صنع الصودا في المنزل.',
        category: createdCategories[3]._id, // Kits category
        subcategory: 'starter', // Updated to use new subcategory
        price: 399.99,
        priceCents: 39999,
        currency: 'SAR',
        stock: 15,
        status: 'active',
        published: true,
        visibility: 'public',
        publishedAt: now,
        isArchived: false,
        sku: 'DM-STARTER-KIT-001',
        nameAr: 'طقم درينكمايت للمبتدئين',
        images: [{
          url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop',
          alt: 'DrinkMate Starter Kit',
          isPrimary: true,
          order: 0
        }]
      }
    ];
    
    // Insert or update products
    for (const productData of products) {
      const product = await Product.findOneAndUpdate(
        { slug: productData.slug },
        productData,
        { upsert: true, new: true }
      );
      console.log(`✅ Product: ${product.name} (${product.slug}) - ${product.price} ${product.currency}`);
    }
    
    console.log(`\n🎉 Successfully seeded ${products.length} products!`);
    console.log('Products should now be visible in the storefront at:');
    console.log('- /shop (all products)');
    console.log('- /shop/sodamakers (soda makers)');
    console.log('- /shop/flavors (flavors)');
    console.log('- /shop/accessories (accessories)');
    console.log('- /shop/kits (kits)');
    
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    mongoose.connection.close();
  }
});
