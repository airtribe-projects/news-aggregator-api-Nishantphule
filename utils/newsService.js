const axios = require("axios");
const config = require("../config/config");
const logger = require("./logger");

const GNEWS_API_KEY = config.gnewsApiKey;
const GNEWS_BASE_URL = "https://gnews.io";

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch news from GNews API
async function fetchNewsFromAPI(keywords = []) {
  try {
    let url;
    const params = {
      lang: "en",
      country: "us",
      max: 10,
      apikey: GNEWS_API_KEY,
    };

    // If user has preferences, use search endpoint with keywords
    if (keywords && keywords.length > 0) {
      // GNews API search endpoint - combine keywords into a single query
      logger.info(`Fetching news for keywords: ${keywords}`);
      const query = keywords.join(" OR ");
      url = `${GNEWS_BASE_URL}/api/v4/search`;
      params.q = query;
    } else {
      // Use top-headlines endpoint when no preferences
      logger.info("Fetching top headlines");
      url = `${GNEWS_BASE_URL}/api/v4/top-headlines`;
      params.category = "general";
    }

    const response = await axios.get(url, {
      params,
      timeout: 10000,
    });

    const data = response.data;

    // Check for API errors in different formats
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
      const errorMessage =
        typeof data.errors[0] === "string"
          ? data.errors[0]
          : data.errors[0].message || "API error";
      throw new Error(errorMessage);
    }

    // Check for error message in response
    if (data.message) {
      throw new Error(data.message);
    }

    // Return articles array
    return data.articles || [];
  } catch (error) {
    // Handle axios errors
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      const status = error.response.status;
      const errorData = error.response.data;

      let errorMsg = `HTTP ${status}`;
      if (errorData?.message) {
        errorMsg = errorData.message;
      } else if (errorData?.error) {
        errorMsg = errorData.error;
      } else if (
        errorData?.errors &&
        Array.isArray(errorData.errors) &&
        errorData.errors.length > 0
      ) {
        errorMsg =
          typeof errorData.errors[0] === "string"
            ? errorData.errors[0]
            : errorData.errors[0].message || errorMsg;
      }

      throw new Error(errorMsg);
    } else if (error.request) {
      // The request was made but no response was received
      throw new Error("No response from API");
    } else {
      // Something happened in setting up the request
      throw error;
    }
  }
}

// Get news with caching
async function getNews(preferences = []) {
  // Create cache key from preferences
  const cacheKey = preferences.sort().join(",") || "default";
  const cached = cache.get(cacheKey);

  // Check if cached data is still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  // Fetch fresh data
  try {
    const articles = await fetchNewsFromAPI(preferences);

    // Cache the result
    cache.set(cacheKey, {
      data: articles,
      timestamp: Date.now(),
    });

    return articles;
  } catch (error) {
    logger.error(`Error fetching news from API: ${error.message}`, {
      preferences,
      error: error.message,
    });
    // If API fails, return cached data if available (even if expired)
    if (cached) {
      logger.warn("Returning cached news data due to API error");
      return cached.data;
    }
    throw error;
  }
}

module.exports = {
  getNews,
};
