# 🛍️ Micro Marketplace App

A modern, fully-featured marketplace application built with React, Node.js, Express, and SQLite. Browse products, search with pagination, manage favorites, and enjoy a smooth shopping experience with JWT authentication.

## 📋 Features

✅ **User Authentication**
- Register & Login with JWT tokens
- Password hashing with bcryptjs
- Persistent authentication with localStorage

✅ **Product Management**
- Browse all products with responsive grid layout
- Search products by title/description
- Pagination support (configurable items per page)
- Detailed product pages with full information

✅ **Favorites System**
- Add/remove products from favorites
- Persistent favorites tracking
- View all favorites with pagination
- Heart animation on favorite toggle

✅ **UI/UX Features**
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Beautiful gradient backgrounds
- Product image galleries
- Real-time search
- Error handling & validation

✅ **Creative Elements**
- Animated hero section with gradient background
- Product card hover effects with scale transformation
- Heart bounce animation on favorite toggle
- Shimmer loading effects
- Smooth fade-in animations on page transitions

## 🚀 Quick Start

### Prerequisites
- Node.js v16+
- npm or yarn

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (already provided with defaults):
```
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
NODE_ENV=development
```

4. Seed the database with sample data:
```bash
npm run seed
```

5. Start the backend server:
```bash
npm start
# or for development with auto-reload:
npm run dev
```

Backend will run on: `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

Frontend will open at: `http://localhost:3000`

## 🧪 Test Credentials

Use these credentials to test the application:

**User 1:**
- Email: `user1@example.com`
- Password: `password123`

**User 2:**
- Email: `user2@example.com`
- Password: `password123`

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```
**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

#### Login
```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Products Endpoints

#### Get All Products (with search & pagination)
```http
GET /products?search=keyword&page=1&limit=10
```

**Query Parameters:**
- `search` (optional): Search term for title/description
- `page` (optional, default: 1): Page number
- `limit` (optional, default: 10): Items per page

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Wireless Headphones",
      "description": "Premium noise-cancelling headphones",
      "price": 199.99,
      "image": "https://...",
      "created_at": "2024-02-18T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

#### Get Single Product
```http
GET /products/:id
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Wireless Headphones",
  "description": "Premium noise-cancelling headphones",
  "price": 199.99,
  "image": "https://...",
  "created_at": "2024-02-18T10:30:00.000Z"
}
```

#### Create Product (Requires Auth)
```http
POST /products
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "New Product",
  "description": "Product description",
  "price": 99.99,
  "image": "https://..."
}
```

#### Update Product (Requires Auth)
```http
PUT /products/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  "price": 79.99
}
```

#### Delete Product (Requires Auth)
```http
DELETE /products/:id
Authorization: Bearer {token}
```

### Favorites Endpoints

**Note:** All favorites endpoints require authentication.

#### Get User's Favorites
```http
GET /favorites?page=1&limit=10
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Product Title",
      "price": 99.99,
      ...
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "pages": 1
  }
}
```

#### Add to Favorites
```http
POST /favorites/:productId
Authorization: Bearer {token}
```

**Response (201):**
```json
{
  "message": "Added to favorites"
}
```

#### Remove from Favorites
```http
DELETE /favorites/:productId
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "message": "Removed from favorites"
}
```

#### Check if Product is Favorited
```http
GET /favorites/:productId/check
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "isFavorite": true
}
```

### Status Codes

- `200 OK` - Success
- `201 Created` - Resource created
- `400 Bad Request` - Validation error
- `401 Unauthorized` - Missing/invalid token
- `404 Not Found` - Resource not found
- `500 Internal Server Error` - Server error

## 📁 Project Structure

```
MarketPlace App/
├── backend/
│   ├── routes/
│   │   ├── auth.js         # Authentication endpoints
│   │   ├── products.js     # Product CRUD endpoints
│   │   └── favorites.js    # Favorites endpoints
│   ├── database.js         # SQLite database setup
│   ├── middleware.js       # Auth & error middleware
│   ├── seed.js             # Database seeding script
│   ├── server.js           # Express app setup
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── ProductsPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   └── FavoritesPage.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── AuthContext.jsx # Auth state management
│   │   ├── api.js          # API client
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
└── README.md
```

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  name TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Products Table
```sql
CREATE TABLE products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Favorites Table
```sql
CREATE TABLE favorites (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  UNIQUE(user_id, product_id)
);
```

## 🎨 Technologies Used

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **SQLite3** - Database
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **express-validator** - Input validation
- **CORS** - Cross-origin requests

### Frontend
- **React 18** - UI framework
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS
- **Vite** - Build tool

## 🔒 Security Features

✅ Password hashing with bcryptjs (10 salt rounds)
✅ JWT token-based authentication
✅ CORS configuration for safe cross-origin requests
✅ Input validation on all endpoints
✅ Protected routes requiring authentication
✅ Secure token storage in localStorage

## 📱 Responsive Design

The application is fully responsive:
- **Mobile** (< 640px): Single column layout
- **Tablet** (640px - 1024px): 2 column grid
- **Desktop** (> 1024px): 3 column grid

## 🎬 Sample Data

The seed script includes:
- **10 Products** with realistic titles, descriptions, prices, and images
- **2 Test Users** for login testing

Run `npm run seed` to populate the database.

## 🚦 Running Both Services

**Terminal 1 - Backend:**
```bash
cd backend
npm install
npm run seed
npm start
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is available
- Verify Node.js is installed: `node --version`
- Check .env file exists with JWT_SECRET

### Frontend won't connect to backend
- Verify backend is running on port 5000
- Check CORS is enabled in server.js
- Clear localStorage: `localStorage.clear()`

### Database not seeding
- Delete `marketplace.db` file if it exists
- Run `npm run seed` again
- Check database.js path is correct

## 📝 Notes

- JWT tokens expire in 7 days
- Password minimum length is 6 characters
- Search is case-insensitive
- Maximum items per page: 100
- Images are external URLs (Unsplash)

## 🎯 Future Enhancements

- Product reviews and ratings
- Shopping cart functionality
- Order history
- Admin dashboard
- Payment integration
- Email notifications
- Social sharing

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Built as a comprehensive marketplace application demo.

---

**Ready to shop? Start the backend and frontend servers, then visit http://localhost:3000!** 🚀
