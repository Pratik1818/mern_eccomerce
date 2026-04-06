/**
 * Seed script: inserts dummy Users, Products, and Orders.
 * Run from project root: npm run seed
 * Force re-insert products (delete existing first): npm run seed:fresh
 */
const FORCE_PRODUCTS = process.env.SEED_FORCE === '1' || process.argv.includes('--fresh');
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import User from '../models/userModel.js';
import Product from '../models/productModel.js';
import Order from '../models/orderModel.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', 'config', 'config.env') });
dotenv.config({ path: path.join(process.cwd(), '.env') });

const DB_URI = process.env.DB_URI || 'mongodb://localhost:27017/Ecommerce';

// Placeholder image (public URL so products display without Cloudinary)
const PLACEHOLDER_IMAGE = {
  public_id: 'seed_placeholder',
  url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
};

const PRODUCTS = [
  {
    name: 'Wireless Bluetooth Headphones',
    description: 'High-quality over-ear headphones with noise cancellation and 30hr battery.',
    price: 2499,
    ratings: 4.5,
    category: 'Electronics',
    stock: 50,
    image: [PLACEHOLDER_IMAGE],
  },
  {
    name: 'Running Sports Shoes',
    description: 'Lightweight breathable shoes for running and gym. Size 6-11 available.',
    price: 1899,
    ratings: 4.2,
    category: 'Fashion',
    stock: 100,
    image: [PLACEHOLDER_IMAGE],
  },
  {
    name: 'Stainless Steel Water Bottle',
    description: '1L insulated bottle, keeps cold 24hrs and hot 12hrs. BPA free.',
    price: 599,
    ratings: 4.8,
    category: 'Lifestyle',
    stock: 200,
    image: [PLACEHOLDER_IMAGE],
  },
  {
    name: 'Mechanical Keyboard',
    description: 'RGB backlit, Cherry MX style keys. Wired USB-C. For gaming and work.',
    price: 3499,
    ratings: 4.6,
    category: 'Electronics',
    stock: 30,
    image: [PLACEHOLDER_IMAGE],
  },
  {
    name: 'Cotton T-Shirt',
    description: '100% cotton unisex t-shirt. Available in multiple colors. Machine washable.',
    price: 499,
    ratings: 4.0,
    category: 'Fashion',
    stock: 150,
    image: [PLACEHOLDER_IMAGE],
  },
  {
    name: 'Smart Watch',
    description: 'Fitness tracker, heart rate, sleep monitor. 7-day battery. Water resistant.',
    price: 2999,
    ratings: 4.4,
    category: 'Electronics',
    stock: 40,
    image: [PLACEHOLDER_IMAGE],
  },
  {
    name: 'Backpack',
    description: '15" laptop compartment, multiple pockets. Durable water-resistant material.',
    price: 1299,
    ratings: 4.3,
    category: 'Lifestyle',
    stock: 80,
    image: [PLACEHOLDER_IMAGE],
  },
  {
    name: 'Coffee Maker',
    description: '4-cup drip coffee maker. Auto shut-off. Quick brew.',
    price: 1599,
    ratings: 4.1,
    category: 'Home',
    stock: 45,
    image: [PLACEHOLDER_IMAGE],
  },
];

async function seed() {
  try {
    await mongoose.connect(DB_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  }

  try {
    // 1. Create admin user if not exists (password: Admin@123)
    let admin = await User.findOne({ email: 'admin@shop.com' });
    if (!admin) {
      admin = await User.create({
        name: 'Admin User',
        email: 'admin@shop.com',
        password: 'Admin@123',
        role: 'admin',
      });
      console.log('Created admin user: admin@shop.com / Admin@123');
    } else {
      console.log('Admin user already exists');
    }

    // 2. Create regular user for orders (password: User@123)
    let user = await User.findOne({ email: 'user@shop.com' });
    if (!user) {
      user = await User.create({
        name: 'Test User',
        email: 'user@shop.com',
        password: 'User@123',
        role: 'user',
      });
      console.log('Created user: user@shop.com / User@123');
    } else {
      console.log('Test user already exists');
    }

    // 3. Insert products (all linked to admin)
    const existingCount = await Product.countDocuments();
    if (FORCE_PRODUCTS) {
      await Product.deleteMany({});
      const productsToInsert = PRODUCTS.map((p) => ({
        ...p,
        user: admin._id,
      }));
      await Product.insertMany(productsToInsert);
      console.log(`Replaced with ${productsToInsert.length} products (--fresh).`);
    } else if (existingCount === 0) {
      const productsToInsert = PRODUCTS.map((p) => ({
        ...p,
        user: admin._id,
      }));
      await Product.insertMany(productsToInsert);
      console.log(`Inserted ${productsToInsert.length} products`);
    } else {
      console.log(`Products already exist (${existingCount}). Skipping. Use npm run seed:fresh to replace.`);
    }

    // 4. Create one sample order for the regular user
    const productList = await Product.find().limit(2).lean();
    const orderExists = await Order.findOne({ user: user._id });
    if (!orderExists && productList.length >= 2) {
      await Order.create({
        user: user._id,
        orderItems: [
          {
            name: productList[0].name,
            price: productList[0].price,
            quantity: 2,
            image: productList[0].image?.[0]?.url || PLACEHOLDER_IMAGE.url,
            product: productList[0]._id,
          },
          {
            name: productList[1].name,
            price: productList[1].price,
            quantity: 1,
            image: productList[1].image?.[0]?.url || PLACEHOLDER_IMAGE.url,
            product: productList[1]._id,
          },
        ],
        shippingInfo: {
          address: '123 Sample Street, Apartment 4',
          city: 'Mumbai',
          state: 'Maharashtra',
          country: 'India',
          pinCode: '400001',
          phoneNo: '9876543210',
        },
        paymentInfo: { status: 'paid' },
        paidAt: new Date(),
        itemsPrice: productList[0].price * 2 + productList[1].price,
        taxPrice: 500,
        shippingPrice: 50,
        totalPrice: productList[0].price * 2 + productList[1].price + 550,
        orderStatus: 'Delivered',
        deliveredAt: new Date(),
      });
      console.log('Created sample order');
    } else {
      console.log('Orders already exist or not enough products. Skipping order.');
    }

    console.log('Seed completed successfully.');
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seed();
