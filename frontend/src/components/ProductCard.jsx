import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useCart } from '../CartContext'
import { favoritesAPI } from '../api'

export default function ProductCard({ product, onRemoveFavorite }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    if (user) {
      checkFavorite()
    }
  }, [product.id, user])

  const checkFavorite = async () => {
    try {
      const response = await favoritesAPI.check(product.id)
      setIsFavorite(response.data.isFavorite)
    } catch (err) {
      console.error('Error checking favorite:', err)
    }
  }

  const toggleFavorite = async (e) => {
    e.stopPropagation()
    if (!user) {
      setShowAlert({ type: 'warning', message: 'Please login to add favorites' })
      setTimeout(() => setShowAlert({ type: '', message: '' }), 3000)
      return
    }

    setLoading(true)
    try {
      if (isFavorite) {
        await favoritesAPI.remove(product.id)
        setIsFavorite(false)
        setShowAlert({ type: 'success', message: '❤️ Removed from favorites' })
        if (onRemoveFavorite) onRemoveFavorite(product.id)
      } else {
        await favoritesAPI.add(product.id)
        setIsFavorite(true)
        setShowAlert({ type: 'success', message: '❤️ Added to favorites' })
      }
      setTimeout(() => setShowAlert({ type: '', message: '' }), 2000)
    } catch (err) {
      console.error('Error toggling favorite:', err)
      setShowAlert({
        type: 'error',
        message: err.response?.data?.error || 'Error updating favorite',
      })
      setTimeout(() => setShowAlert({ type: '', message: '' }), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = (e) => {
    e.stopPropagation()
    addToCart(product)
    setShowAlert({ type: 'success', message: `🛒 ${product.title} added to cart!` })
    setTimeout(() => setShowAlert({ type: '', message: '' }), 2000)
  }

  return (
    <div className="relative">
      {/* Alert */}
      {showAlert.message && (
        <div
          className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-40 px-6 py-3 rounded-lg text-white font-bold animate-slideIn ${
            showAlert.type === 'success'
              ? 'bg-green-500'
              : showAlert.type === 'error'
              ? 'bg-red-500'
              : 'bg-yellow-500'
          }`}
        >
          {showAlert.message}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition transform hover:scale-105 animate-fadeIn">
        <div className="relative h-48 bg-gray-200 overflow-hidden group">
          {product.image ? (
            <img
              src={product.image}
              alt={product.title}
              className="w-full h-full object-cover group-hover:scale-110 transition"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-300 to-gray-400">
              <span className="text-4xl">📦</span>
            </div>
          )}
          {user && (
            <button
              onClick={toggleFavorite}
              disabled={loading}
              className={`absolute top-3 right-3 text-2xl transition transform ${
                isFavorite ? 'scale-125' : ''
              } hover:scale-125 ${loading ? 'opacity-50' : ''}`}
            >
              {isFavorite ? '❤️' : '🤍'}
            </button>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-bold text-gray-900 text-lg mb-2 truncate">{product.title}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center gap-2">
            <span className="text-2xl font-bold text-blue-600">${product.price}</span>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/product/${product.id}`)}
                className="px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm"
              >
                View
              </button>
              <button
                onClick={handleAddToCart}
                className="px-2 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition text-sm"
              >
                Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
