const express = require("express");
const { connectDB } = require("./config/database");
const logger = require("./utils/logger");
const config = require("./config/config");

const app = express();
const port = config.port;

// Request logging middleware
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
const usersRouter = require("./routes/users");
const newsRouter = require("./routes/news");

app.use("/users", usersRouter);
app.use("/news", newsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  // Handle JSON syntax errors
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    logger.warn(`Invalid JSON in request body - ${req.method} ${req.path}`);
    return res.status(400).json({ error: "Invalid JSON in request body" });
  }

  // Handle other errors
  logger.error(`Error: ${err.message}`, { stack: err.stack, path: req.path });
  res.status(500).json({ error: "Something went wrong!" });
});

// Connect to MongoDB when module is loaded (for both server and tests)
connectDB().catch((err) => {
  logger.error("MongoDB connection failed:", err);
});

// Connect to MongoDB and start server
async function startServer() {
  try {
    await connectDB();
    app.listen(port, (err) => {
      if (err) {
        logger.error("Failed to start server:", err);
        return;
      }
      logger.info(`Server is listening on port ${port}`);
      logger.info(`Environment: ${config.nodeEnv}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Only start server if not in test environment
if (require.main === module) {
  startServer();
}

module.exports = app;
