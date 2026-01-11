const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");
const { getNews } = require("../utils/newsService");
const logger = require("../utils/logger");

// GET /news
router.get("/", authenticateToken, async (req, res) => {
  try {
    const preferences = req.user.preferences || [];
    logger.info(`Fetching news for user: ${req.user.email}`, { preferences });
    const articles = await getNews(preferences);

    logger.info(`News fetched successfully for user: ${req.user.email}`, {
      articleCount: articles.length,
    });
    res.status(200).json({
      news: articles,
    });
  } catch (error) {
    logger.error(`Error fetching news: ${error.message}`, {
      userId: req.user._id,
      preferences: req.user.preferences,
      error: error.stack,
    });
    res.status(500).json({ error: "Failed to fetch news" });
  }
});

module.exports = router;
