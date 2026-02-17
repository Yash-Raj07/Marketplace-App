import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useCart } from '../CartContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const { cartItems } = useCart()
  const location = useLocation()

  const isActive = (path) => location.pathname === path ? 'text-blue-600' : 'text-gray-600'
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition">
            <span className="text-2xl">🛍️</span>
            <span className="text-xl font-bold text-gray-800 hidden sm:inline">
              Marketplace
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link
                  to="/products"
                  className={`${isActive('/products')} font-medium transition`}
                >
                  Shop
                </Link>
                <Link
                  to="/favorites"
                  className={`${isActive('/favorites')} font-medium transition`}
                >
                  ❤️ Favorites
                </Link>
                <Link
                  to="/cart"
                  className={`relative font-medium transition ${isActive('/cart')}`}
                >
                  <span className="text-xl">🛒</span>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <div className="flex items-center space-x-3 pl-6 border-l">
                  <span className="text-gray-700 text-sm hidden sm:inline">
                    {user.name}
                  </span>
                  <button
                    onClick={logout}
                    className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition text-sm font-medium"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`${isActive('/login')} font-medium transition`}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition font-medium"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
