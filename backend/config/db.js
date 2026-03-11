const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.error('The server will continue running but database operations will fail.');
    console.error('Please set a valid MONGO_URI in backend/.env');
  }
};

module.exports = connectDB;
