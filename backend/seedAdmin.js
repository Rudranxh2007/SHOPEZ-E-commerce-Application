const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const importData = async () => {
  try {
    // Check if admin already exists
    const adminUser = await User.findOne({ email: 'admin@shopez.com' });

    if (adminUser) {
      console.log('Admin user already exists!');
      process.exit();
    }

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@shopez.com',
      password: 'admin123', // Will be hashed by pre-save middleware
      role: 'ADMIN',
    });

    console.log(`Admin user created: ${admin.email}`);
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

importData();
