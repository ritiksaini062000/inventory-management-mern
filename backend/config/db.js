const mongoose = require('mongoose');
const dns = require('dns');

// Fix for Windows / ISP DNS resolution issue (querySrv ECONNREFUSED) with MongoDB Atlas SRV records
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (err) {
  console.warn('[DNS Warning] Could not set Google DNS servers:', err.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/inventory_db');

    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
    console.error('Tip: Make sure local MongoDB is running, or provide a valid MONGODB_URI in backend/.env');
    // In production we exit, but in dev we don't crash immediately so logs can be inspected
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('[Database] MongoDB connection disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.log('[Database] MongoDB reconnected successfully');
});

module.exports = connectDB;
