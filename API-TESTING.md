# API Testing Guide

## Test with cURL or Postman

### 1. Register New User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "password": "password123",
    "name": "New User"
  }'
```

**Expected Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 3,
    "email": "newuser@example.com",
    "name": "New User"
  }
}
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user1@example.com",
    "password": "password123"
  }'
```

**Response includes JWT token for authentication**

### 3. Get All Products (with search)

```bash
# Get all products
curl http://localhost:5000/api/products

# Search for products
curl "http://localhost:5000/api/products?search=headphones"

# With pagination
curl "http://localhost:5000/api/products?page=2&limit=5"

# Combined
curl "http://localhost:5000/api/products?search=wireless&page=1&limit=10"
```

**Expected Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Wireless Headphones",
      "description": "Premium noise-cancelling wireless headphones with 30-hour battery life",
      "price": 199.99,
      "image": "https://images.unsplash.com/...",
      "created_at": "2024-02-18T..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 10,
    "pages": 1
  }
}
```

### 4. Get Single Product

```bash
curl http://localhost:5000/api/products/1
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Wireless Headphones",
  "description": "Premium noise-cancelling wireless headphones with 30-hour battery life",
  "price": 199.99,
  "image": "https://images.unsplash.com/...",
  "created_at": "2024-02-18T..."
}
```

### 5. Add to Favorites (Requires Auth)

```bash
# Save token from login response
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/favorites/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Response (201):**
```json
{
  "message": "Added to favorites"
}
```

### 6. Get User's Favorites

```bash
TOKEN="your_jwt_token_here"

curl http://localhost:5000/api/favorites \
  -H "Authorization: Bearer $TOKEN"

# With pagination
curl "http://localhost:5000/api/favorites?page=1&limit=5" \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Wireless Headphones",
      "price": 199.99,
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 2,
    "pages": 1
  }
}
```

### 7. Check if Product is Favorited

```bash
TOKEN="your_jwt_token_here"

curl http://localhost:5000/api/favorites/1/check \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200):**
```json
{
  "isFavorite": true
}
```

### 8. Remove from Favorites

```bash
TOKEN="your_jwt_token_here"

curl -X DELETE http://localhost:5000/api/favorites/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200):**
```json
{
  "message": "Removed from favorites"
}
```

### 9. Create Product (Requires Auth)

```bash
TOKEN="your_jwt_token_here"

curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "New Product",
    "description": "This is a new product",
    "price": 49.99,
    "image": "https://images.unsplash.com/photo-..."
  }'
```

**Response (201):**
```json
{
  "id": 11,
  "title": "New Product",
  "description": "This is a new product",
  "price": 49.99,
  "image": "https://images.unsplash.com/photo-..."
}
```

### 10. Update Product (Requires Auth)

```bash
TOKEN="your_jwt_token_here"

curl -X PUT http://localhost:5000/api/products/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated Title",
    "price": 159.99
  }'
```

### 11. Delete Product (Requires Auth)

```bash
TOKEN="your_jwt_token_here"

curl -X DELETE http://localhost:5000/api/products/1 \
  -H "Authorization: Bearer $TOKEN"
```

**Response (200):**
```json
{
  "message": "Product deleted successfully"
}
```

### 12. Health Check

```bash
curl http://localhost:5000/api/health
```

**Response (200):**
```json
{
  "status": "OK",
  "timestamp": "2024-02-18T10:30:00.000Z"
}
```

## Error Responses

### 400 Bad Request (Validation Error)
```json
{
  "errors": [
    {
      "value": "",
      "msg": "Email is required",
      "param": "email",
      "location": "body"
    }
  ]
}
```

### 401 Unauthorized (Missing Token)
```json
{
  "error": "No token provided"
}
```

### 404 Not Found
```json
{
  "error": "Product not found"
}
```

### 500 Server Error
```json
{
  "error": "Internal server error"
}
```

## Using Postman

### Import Collection

1. Open Postman
2. Create new collection "Marketplace API"
3. Add requests with:
   - **Base URL:** `http://localhost:5000/api`
   - **Headers:** `Content-Type: application/json`
   - **Auth:** Set Bearer token for protected routes

### Environment Variables in Postman

```json
{
  "base_url": "http://localhost:5000/api",
  "token": "{{save token here}}",
  "user_id": 1,
  "product_id": 1
}
```

## Search Examples

### Search by product type
```bash
curl "http://localhost:5000/api/products?search=headphones&limit=5"
curl "http://localhost:5000/api/products?search=keyboard&limit=5"
curl "http://localhost:5000/api/products?search=watch&limit=5"
```

### Pagination examples
```bash
# First page (10 items)
curl "http://localhost:5000/api/products?page=1&limit=10"

# Second page (5 items per page)
curl "http://localhost:5000/api/products?page=2&limit=5"

# All items at once (up to 100)
curl "http://localhost:5000/api/products?limit=100"
```

## Status Codes Reference

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 400 | Bad Request - Validation error |
| 401 | Unauthorized - No/invalid token |
| 404 | Not Found - Resource doesn't exist |
| 500 | Server Error - Internal error |

---

**Tip:** Save the token from login/register response and use it for all authenticated requests!
