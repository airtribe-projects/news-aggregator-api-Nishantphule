const jwt = require("jsonwebtoken");
const { findById } = require("../models/users");
const config = require("../config/config");
const logger = require("../utils/logger");

const JWT_SECRET = config.jwtSecret;

// Middleware to authenticate JWT token
async function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: "Access token required" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    // Verify user still exists
    const user = await findById(decoded.userId);
    if (!user) {
      logger.warn(`Authentication failed: User not found for userId ${decoded.userId}`);
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    logger.warn(`Authentication failed: Invalid or expired token - ${err.message}`);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

// Generate JWT token
function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: config.jwtExpiresIn });
}

module.exports = {
  authenticateToken,
  generateToken,
};
