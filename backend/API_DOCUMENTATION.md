# Fashion Analysis API Documentation

## Overview

The Fashion Analysis API is a comprehensive backend service for fashion analysis, wardrobe management, and style recommendations. Built with Flask and MongoDB, it provides secure authentication, AI-powered outfit analysis, and personalized fashion insights.

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## API Endpoints

### Health Check

#### GET /api/health/ping
Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "API is running"
}
```

#### GET /api/health/db
Check database connection status.

**Response:**
```json
{
  "status": "connected",
  "message": "Database connection successful"
}
```

---

## Authentication Endpoints
**Base URL:** `/api/auth`

### POST /api/auth/register
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing required fields or invalid email format
- `409 Conflict`: Email already exists

### POST /api/auth/login
Authenticate user and receive JWT tokens.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "refresh_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Missing email or password
- `401 Unauthorized`: Invalid credentials

### POST /api/auth/refresh
Refresh access token using refresh token.

**Headers:**
```
Authorization: Bearer <refresh_token>
```

**Response (200 OK):**
```json
{
  "access_token": "new_access_token_here"
}
```

### POST /api/auth/logout
Logout user and revoke tokens.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Successfully logged out"
}
```

### POST /api/auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "john@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset link sent to your email"
}
```

### POST /api/auth/reset-password
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset_token_here",
  "new_password": "newpassword123"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successfully"
}
```

---

## User Profile Endpoints
**Base URL:** `/api/user`

### GET /api/user/profile
Get current user profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john@example.com",
  "preferences": {
    "style": "casual",
    "colors": ["blue", "black", "white"],
    "brands": ["Nike", "Adidas"]
  }
}
```

### PUT /api/user/profile
Update user profile information.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com"
}
```

**Response (200 OK):**
```json
{
  "id": "user_id",
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "preferences": {
    "style": "casual",
    "colors": ["blue", "black", "white"]
  }
}
```

### PUT /api/user/preferences
Update user style preferences.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "style": "formal",
  "colors": ["navy", "gray", "white"],
  "brands": ["Hugo Boss", "Calvin Klein"],
  "size": "M",
  "budget_range": "mid"
}
```

**Response (200 OK):**
```json
{
  "preferences": {
    "style": "formal",
    "colors": ["navy", "gray", "white"],
    "brands": ["Hugo Boss", "Calvin Klein"],
    "size": "M",
    "budget_range": "mid"
  }
}
```

---

## Analysis Endpoints
**Base URL:** `/api/analysis`

### POST /api/analysis/analyze
Analyze an outfit image using AI.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `image`: Image file (JPEG, PNG, WebP)
- `analysis_type`: Optional analysis type ("outfit", "color", "style")

**Response (200 OK):**
```json
{
  "analysis_id": "analysis_id_here",
  "results": {
    "overallScore": 8.5,
    "colorHarmony": 9.0,
    "styleConsistency": 8.0,
    "fitAndProportions": 8.5,
    "accessoryCoordination": 8.0,
    "seasonalAppropriate": 9.0,
    "feedback": {
      "strengths": [
        "Excellent color coordination",
        "Well-fitted garments"
      ],
      "improvements": [
        "Consider adding a statement accessory",
        "The belt could be a different color"
      ],
      "suggestions": [
        "Try navy blue accessories",
        "Consider a leather watch"
      ]
    },
    "detectedItems": [
      {
        "type": "shirt",
        "color": "white",
        "confidence": 0.95
      },
      {
        "type": "pants",
        "color": "navy",
        "confidence": 0.92
      }
    ]
  },
  "created_at": "2025-06-05T10:30:00Z"
}
```

**Error Responses:**
- `400 Bad Request`: No image file provided or invalid file type
- `500 Internal Server Error`: Analysis processing failed

### GET /api/analysis/history
Get user's analysis history.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response (200 OK):**
```json
{
  "analyses": [
    {
      "id": "analysis_id",
      "results": {
        "overallScore": 8.5,
        "colorHarmony": 9.0,
        "styleConsistency": 8.0
      },
      "image_url": "/uploads/user_id/image.jpg",
      "created_at": "2025-06-05T10:30:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 45,
    "has_next": true,
    "has_prev": false
  }
}
```

### GET /api/analysis/{analysis_id}
Get detailed results for a specific analysis.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "analysis_id",
  "results": {
    "overallScore": 8.5,
    "colorHarmony": 9.0,
    "styleConsistency": 8.0,
    "fitAndProportions": 8.5,
    "accessoryCoordination": 8.0,
    "seasonalAppropriate": 9.0,
    "feedback": {
      "strengths": ["Excellent color coordination"],
      "improvements": ["Consider adding accessories"],
      "suggestions": ["Try navy blue accessories"]
    },
    "detectedItems": [
      {
        "type": "shirt",
        "color": "white",
        "confidence": 0.95
      }
    ]
  },
  "image_url": "/uploads/user_id/image.jpg",
  "created_at": "2025-06-05T10:30:00Z"
}
```

---

## Wardrobe Management Endpoints
**Base URL:** `/api/wardrobe`

### GET /api/wardrobe/items
Get user's wardrobe items.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `category`: Filter by category ("tops", "bottoms", "shoes", "accessories")
- `color`: Filter by color
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "item_id",
      "name": "White Cotton Shirt",
      "category": "tops",
      "subcategory": "shirt",
      "color": "white",
      "brand": "Uniqlo",
      "size": "M",
      "image_url": "/uploads/user_id/item_image.jpg",
      "tags": ["casual", "work"],
      "purchase_date": "2025-01-15T00:00:00Z",
      "created_at": "2025-01-20T10:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 25
  }
}
```

### POST /api/wardrobe/items
Add a new item to wardrobe.

**Headers:**
```
Authorization: Bearer <access_token>
Content-Type: multipart/form-data
```

**Request Body (Form Data):**
- `image`: Image file of the item
- `name`: Item name
- `category`: Category ("tops", "bottoms", "shoes", "accessories")
- `subcategory`: Subcategory (optional)
- `color`: Primary color
- `brand`: Brand name (optional)
- `size`: Size (optional)
- `tags`: Comma-separated tags (optional)

**Response (201 Created):**
```json
{
  "message": "Item added successfully",
  "item": {
    "id": "new_item_id",
    "name": "Blue Denim Jeans",
    "category": "bottoms",
    "color": "blue",
    "image_url": "/uploads/user_id/item_image.jpg",
    "created_at": "2025-06-05T10:30:00Z"
  }
}
```

### GET /api/wardrobe/items/{item_id}
Get details of a specific wardrobe item.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "item_id",
  "name": "White Cotton Shirt",
  "category": "tops",
  "subcategory": "shirt",
  "color": "white",
  "brand": "Uniqlo",
  "size": "M",
  "image_url": "/uploads/user_id/item_image.jpg",
  "tags": ["casual", "work"],
  "purchase_date": "2025-01-15T00:00:00Z",
  "wear_count": 15,
  "last_worn": "2025-06-01T00:00:00Z",
  "created_at": "2025-01-20T10:00:00Z"
}
```

### PUT /api/wardrobe/items/{item_id}
Update a wardrobe item.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "name": "Updated Item Name",
  "category": "tops",
  "color": "blue",
  "brand": "New Brand",
  "tags": ["formal", "business"]
}
```

**Response (200 OK):**
```json
{
  "message": "Item updated successfully",
  "item": {
    "id": "item_id",
    "name": "Updated Item Name",
    "category": "tops",
    "color": "blue",
    "brand": "New Brand",
    "tags": ["formal", "business"]
  }
}
```

### DELETE /api/wardrobe/items/{item_id}
Remove an item from wardrobe.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "message": "Item deleted successfully"
}
```

### GET /api/wardrobe/stats
Get wardrobe statistics.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "total_items": 45,
  "categories": {
    "tops": 15,
    "bottoms": 12,
    "shoes": 8,
    "accessories": 10
  },
  "colors": {
    "black": 12,
    "white": 8,
    "blue": 7,
    "gray": 5
  },
  "brands": {
    "Nike": 5,
    "Adidas": 3,
    "Uniqlo": 4
  },
  "most_worn": [
    {
      "id": "item_id",
      "name": "Black T-Shirt",
      "wear_count": 25
    }
  ]
}
```

---

## Recommendations Endpoints
**Base URL:** `/api/recommendations`

### GET /api/recommendations/outfits
Get outfit recommendations for the user.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `occasion`: Occasion type ("casual", "formal", "business", "party")
- `weather`: Weather condition ("sunny", "rainy", "cold", "hot")
- `limit`: Number of recommendations (default: 5)

**Response (200 OK):**
```json
{
  "recommendations": [
    {
      "id": "recommendation_id",
      "title": "Smart Casual Look",
      "description": "Perfect for a casual office day",
      "items": [
        {
          "id": "item_id_1",
          "name": "White Oxford Shirt",
          "category": "tops",
          "image_url": "/uploads/user_id/shirt.jpg"
        },
        {
          "id": "item_id_2",
          "name": "Navy Chinos",
          "category": "bottoms",
          "image_url": "/uploads/user_id/pants.jpg"
        }
      ],
      "score": 9.2,
      "occasion": "business",
      "weather_suitability": ["mild", "cool"],
      "style_notes": "This combination creates a polished yet relaxed appearance"
    }
  ],
  "total_recommendations": 5
}
```

### GET /api/recommendations/similar-items
Get recommendations for similar items to purchase.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `item_id`: ID of the reference wardrobe item
- `limit`: Number of recommendations (default: 10)

**Response (200 OK):**
```json
{
  "similar_items": [
    {
      "name": "Similar White Shirt",
      "brand": "J.Crew",
      "price": "$49.99",
      "similarity_score": 0.92,
      "image_url": "https://example.com/product-image.jpg",
      "purchase_link": "https://example.com/product",
      "features": ["cotton", "button-down", "slim-fit"]
    }
  ],
  "reference_item": {
    "id": "item_id",
    "name": "White Oxford Shirt",
    "category": "tops"
  }
}
```

### POST /api/recommendations/outfit-from-item
Generate outfit recommendations based on a specific wardrobe item.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "item_id": "wardrobe_item_id",
  "occasion": "casual",
  "weather": "mild"
}
```

**Response (200 OK):**
```json
{
  "outfits": [
    {
      "title": "Casual Day Out",
      "base_item": {
        "id": "item_id",
        "name": "Blue Denim Jeans"
      },
      "suggested_items": [
        {
          "id": "item_id_2",
          "name": "White T-Shirt",
          "category": "tops"
        },
        {
          "id": "item_id_3",
          "name": "White Sneakers",
          "category": "shoes"
        }
      ],
      "score": 8.7,
      "style_notes": "Classic casual combination perfect for weekend activities"
    }
  ]
}
```

---

## Dashboard Analytics Endpoints
**Base URL:** `/api/dashboard`

### GET /api/dashboard/analytics
Get dashboard analytics data.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "totalAnalyses": {
    "value": 25,
    "trend": "+15%"
  },
  "wardrobeItems": {
    "value": 45,
    "trend": "+3 new"
  },
  "recommendationsViewed": {
    "value": 50,
    "trend": "+20%"
  },
  "styleScoreAverage": {
    "value": "8.5/10",
    "trend": "+0.3"
  }
}
```

### GET /api/dashboard/recent-activity
Get recent user activity.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
  {
    "description": "Outfit analysis completed - Score: 8.5/10",
    "time": "2 hours ago",
    "type": "analysis"
  },
  {
    "description": "New item 'Blue Denim Jacket' added to wardrobe",
    "time": "1 day ago",
    "type": "wardrobe"
  },
  {
    "description": "Outfit analysis completed - Score: 7.8/10",
    "time": "2 days ago",
    "type": "analysis"
  }
]
```

### GET /api/dashboard/style-trends
Get style score trends over time for charts.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
  {
    "name": "Jan",
    "score": 7.5,
    "count": 8
  },
  {
    "name": "Feb",
    "score": 8.1,
    "count": 12
  },
  {
    "name": "Mar",
    "score": 8.7,
    "count": 15
  },
  {
    "name": "Apr",
    "score": 8.3,
    "count": 10
  },
  {
    "name": "May",
    "score": 8.9,
    "count": 18
  },
  {
    "name": "Jun",
    "score": 9.1,
    "count": 5
  }
]
```

---

## Error Handling

### Standard Error Response Format
```json
{
  "error": "Error message description",
  "code": "ERROR_CODE",
  "details": "Additional error details if available"
}
```

### Common HTTP Status Codes
- **200 OK**: Request successful
- **201 Created**: Resource created successfully
- **400 Bad Request**: Invalid request data
- **401 Unauthorized**: Authentication required or invalid
- **403 Forbidden**: Access denied
- **404 Not Found**: Resource not found
- **409 Conflict**: Resource already exists
- **422 Unprocessable Entity**: Validation errors
- **500 Internal Server Error**: Server error

---

## File Upload Specifications

### Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- WebP (.webp)

### File Size Limits
- Maximum file size: 10MB
- Recommended: 2MB or less for faster processing

### Image Requirements
- Minimum dimensions: 300x300 pixels
- Maximum dimensions: 4000x4000 pixels
- Aspect ratio: Any (will be processed appropriately)

---

## Rate Limiting

### Current Limits
- Authentication endpoints: 5 requests per minute
- Analysis endpoints: 10 requests per minute
- Other endpoints: 60 requests per minute

### Rate Limit Headers
```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1620000000
```

---

## Data Models

### User Model
```json
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "password_hash": "string",
  "preferences": {
    "style": "string",
    "colors": ["string"],
    "brands": ["string"],
    "size": "string",
    "budget_range": "string"
  },
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Wardrobe Item Model
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "name": "string",
  "category": "string",
  "subcategory": "string",
  "color": "string",
  "brand": "string",
  "size": "string",
  "image_url": "string",
  "tags": ["string"],
  "purchase_date": "datetime",
  "wear_count": "number",
  "last_worn": "datetime",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Analysis Model
```json
{
  "_id": "ObjectId",
  "user_id": "ObjectId",
  "image_url": "string",
  "analysis_type": "string",
  "results": {
    "overallScore": "number",
    "colorHarmony": "number",
    "styleConsistency": "number",
    "fitAndProportions": "number",
    "accessoryCoordination": "number",
    "seasonalAppropriate": "number",
    "feedback": {
      "strengths": ["string"],
      "improvements": ["string"],
      "suggestions": ["string"]
    },
    "detectedItems": [
      {
        "type": "string",
        "color": "string",
        "confidence": "number"
      }
    ]
  },
  "created_at": "datetime"
}
```

---

## Environment Variables

Required environment variables for the API:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/fashion_analysis

# JWT Configuration  
JWT_SECRET_KEY=your-secret-key-here
SECRET_KEY=your-flask-secret-key

# AI Service
GEMINI_API_KEY=your-gemini-api-key

# File Storage
UPLOAD_FOLDER=uploads

# Optional
PORT=5000
FLASK_ENV=development
```

---

## Getting Started

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Set Environment Variables**
   Create a `.env` file with required variables

3. **Start the Server**
   ```bash
   python app.py
   ```

4. **Test the API**
   ```bash
   curl http://localhost:5000/api/health/ping
   ```

---

## Support

For API support and questions:
- Check the error response messages for specific issues
- Verify authentication tokens are valid and not expired
- Ensure request payloads match the documented schemas
- Contact support if issues persist

---

*Last updated: June 5, 2025*
