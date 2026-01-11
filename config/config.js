require("dotenv").config();

module.exports = {
  // Server configuration
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",

  // Database configuration
  mongoUrl: process.env.MONGO_URL || process.env.MONGODB_URI,

  // JWT configuration
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "24h",

  // GNews API configuration
  gnewsApiKey: process.env.NEWS_API_KEY || process.env.GNEWS_API_KEY,

  // Logging configuration
  logLevel: process.env.LOG_LEVEL || "info",
};
