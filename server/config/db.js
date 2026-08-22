const mongoose = require('mongoose');

/**
 * Connects to MongoDB.
 * Uses a short serverSelectionTimeoutMS so that in dev, a missing/unreachable
 * Mongo instance fails fast with a clear log instead of hanging the process.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[DB] MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (err) {
    console.error(`[DB] Connection failed: ${err.message}`);
    console.error('[DB] Server will continue running so /api/health stays reachable, but DB-backed routes will fail until MONGO_URI is reachable.');
    // Intentionally do NOT process.exit here in dev — health check and
    // non-DB routes should still be inspectable. In production you may
    // want to exit and let the process manager restart instead.
  }
};

module.exports = connectDB;
