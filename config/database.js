const mongoose = require("mongoose");
const config = require("./config.js");
const logger = require("../utils/logger");

const MONGODB_URI = config.mongoUrl;

// Track connection state
let isConnected = false;
let connectionPromise = null;

async function connectDB() {
  // If already connected, return
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  // If connection is in progress, return the existing promise
  if (connectionPromise) {
    return connectionPromise;
  }

  // Start new connection
  connectionPromise = (async () => {
    try {
      // If already connecting or connected, return
      if (
        mongoose.connection.readyState === 1 ||
        mongoose.connection.readyState === 2
      ) {
        isConnected = true;
        return;
      }

      await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      isConnected = true;
      if (config.nodeEnv !== "test") {
        logger.info("MongoDB connected successfully");
      }
    } catch (error) {
      isConnected = false;
      connectionPromise = null;
      if (config.nodeEnv !== "test") {
        logger.error("MongoDB connection error:", error);
        process.exit(1);
      } else {
        // In test mode, throw error so tests can handle it
        throw error;
      }
    }
  })();

  return connectionPromise;
}

module.exports = { connectDB };
