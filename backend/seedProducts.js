const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const products = [
  {
    name: "Wireless Noise-Canceling Headphones",
    description: "Premium over-ear headphones with active noise cancellation, 30-hour battery life, and high-resolution spatial audio.",
    price: 299.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
    stock: 45,
    rating: 4.8,
    numReviews: 124
  },
  {
    name: "Minimalist Leather Backpack",
    description: "Handcrafted full-grain leather backpack with a padded laptop compartment and water-resistant lining.",
    price: 129.50,
    category: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop",
    stock: 12,
    rating: 4.5,
    numReviews: 32
  },
  {
    name: "Smart Fitness Watch",
    description: "Advanced fitness tracker with heart rate monitoring, sleep analysis, GPS, and a beautiful AMOLED display.",
    price: 199.00,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
    stock: 80,
    rating: 4.6,
    numReviews: 540
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Ultra-soft, sustainable 100% organic cotton basic t-shirt. Perfect for everyday wear.",
    price: 24.99,
    category: "Clothing",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop",
    stock: 200,
    rating: 4.2,
    numReviews: 88
  },
  {
    name: "Professional Camera Lens",
    description: "50mm f/1.4 prime lens for stunning portraits and low-light performance. Compatible with full-frame DSLRs.",
    price: 499.00,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1964&auto=format&fit=crop",
    stock: 5,
    rating: 4.9,
    numReviews: 14
  },
  {
    name: "Ceramic Coffee Mug",
    description: "Hand-thrown ceramic mug with a beautiful mountain glaze. Holds 12oz of your favorite beverage.",
    price: 18.00,
    category: "Home",
    image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?q=80&w=2070&auto=format&fit=crop",
    stock: 30,
    rating: 4.7,
    numReviews: 45
  },
  {
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with responsive red switches and programmable macro keys.",
    price: 149.99,
    category: "Electronics",
    image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=2070&auto=format&fit=crop",
    stock: 25,
    rating: 4.4,
    numReviews: 210
  },
  {
    name: "Aromatherapy Essential Oil Diffuser",
    description: "Ultrasonic cool mist humidifier and diffuser with 7 ambient color lights and auto shut-off.",
    price: 34.50,
    category: "Home",
    image: "https://images.unsplash.com/photo-1608528577891-eb05eb215a84?q=80&w=2070&auto=format&fit=crop",
    stock: 60,
    rating: 4.1,
    numReviews: 76
  }
];

const seedProducts = async () => {
  try {
    // Optional: Clear existing products first so the user gets a clean slate
    await Product.deleteMany();
    console.log('Existing products cleared.');

    // Add new products
    await Product.insertMany(products);
    console.log(`${products.length} products added successfully!`);

    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedProducts();
