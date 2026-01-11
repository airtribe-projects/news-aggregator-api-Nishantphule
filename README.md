# News Aggregator API

A RESTful API for a personalized news aggregator built with Node.js, Express.js, MongoDB, JWT authentication, and GNews API integration.

## Features

- **User Authentication**: Signup and login with JWT token-based authentication
- **User Preferences**: Get and update user news preferences
- **Personalized News**: Fetch news articles based on user preferences using GNews API
- **Password Security**: Bcrypt password hashing
- **Input Validation**: Joi schema-based request validation
- **Structured Logging**: Winston logger with file and console output
- **News Caching**: 5-minute cache to reduce API calls
- **Error Handling**: Comprehensive error handling with proper HTTP status codes

## Tech Stack

- **Runtime**: Node.js >= 18.0.0
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **HTTP Client**: Axios
- **Logging**: Winston
- **Testing**: Tap, Supertest

## Prerequisites

- Node.js >= 18.0.0
- MongoDB Atlas account (or local MongoDB instance)
- GNews API key

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory:
   ```env
   PORT=3000
   NODE_ENV=development
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database-name?retryWrites=true&w=majority
   JWT_SECRET=your-secret-key-change-in-production
   JWT_EXPIRES_IN=24h
   NEWS_API_KEY=your-gnews-api-key
   LOG_LEVEL=info
   ```

## Running the Application

Start the server:
```bash
npm start
# or
node app.js
```

The server will start on the port specified in `PORT` environment variable (default: 3000).

## API Endpoints

### Authentication

#### POST /users/signup
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "preferences": ["technology", "sports"]
}
```

**Response:** `200 OK`
```json
{
  "message": "User created successfully",
  "user": {
    "id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "preferences": ["technology", "sports"]
  }
}
```

#### POST /users/login
Login and get JWT token.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:** `200 OK`
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### User Preferences

#### GET /users/preferences
Get user preferences (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "preferences": ["technology", "sports"]
}
```

#### PUT /users/preferences
Update user preferences (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "preferences": ["technology", "sports", "science"]
}
```

**Response:** `200 OK`
```json
{
  "message": "Preferences updated successfully",
  "preferences": ["technology", "sports", "science"]
}
```

### News

#### GET /news
Get personalized news based on user preferences (requires authentication).

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "news": [
    {
      "title": "Article Title",
      "description": "Article description...",
      "url": "https://...",
      "image": "https://...",
      "publishedAt": "2026-01-11T...",
      "source": {
        "name": "Source Name"
      }
    }
  ]
}
```

**Note:** If user has preferences, news is fetched using search endpoint. Otherwise, top headlines are returned.

## Testing

Run the test suite:
```bash
npm test
```

All tests should pass (15/15).

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `NODE_ENV` | Environment mode (development, production, test) | `development` |
| `MONGO_URL` | MongoDB connection string | - |
| `JWT_SECRET` | Secret key for JWT token signing | - |
| `JWT_EXPIRES_IN` | JWT token expiration time | `24h` |
| `NEWS_API_KEY` | GNews API key | - |
| `LOG_LEVEL` | Logging level (error, warn, info, http, debug) | `info` |

## Logging

The application uses Winston for structured logging:

- **Console Output**: Colored logs for development
- **File Logs**: 
  - `logs/error.log` - Error level logs only
  - `logs/combined.log` - All application logs
- **Request Logging**: All HTTP requests are automatically logged with method, path, and IP address
- **Log Levels**: error, warn, info, http, debug

## Project Structure

```
├── app.js                    # Main application entry point
├── config/
│   ├── config.js             # Centralized configuration
│   └── database.js           # MongoDB connection
├── middleware/
│   ├── auth.js               # JWT authentication middleware
│   └── validation.js         # Joi request validation schemas
├── models/
│   ├── User.js               # Mongoose User schema
│   └── users.js              # User model functions
├── routes/
│   ├── users.js              # User authentication and preferences routes
│   └── news.js               # News aggregation routes
├── utils/
│   ├── logger.js             # Winston logger configuration
│   └── newsService.js        # GNews API integration and caching
└── test/
    └── server.test.js        # API test suite
```

## Key Implementation Details

- **Modular Architecture**: Application is split into separate modules for routes, middleware, models, and utilities
- **Environment Configuration**: All settings loaded from environment variables via `config/config.js`
- **Centralized Validation**: Joi schemas in `middleware/validation.js` for reusable validation
- **Structured Logging**: Winston logger with file and console transports
- **News Caching**: 5-minute in-memory cache to reduce GNews API calls
- **Error Handling**: Comprehensive error handling with appropriate HTTP status codes

## License

ISC
