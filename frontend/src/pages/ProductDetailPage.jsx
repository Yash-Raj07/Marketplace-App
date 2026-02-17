import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { useCart } from '../CartContext'
import { productsAPI, favoritesAPI } from '../api'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isFavorite, setIsFavorite] = useState(false)
  const [favoriteLoading, setFavoriteLoading] = useState(false)
  const [showAlert, setShowAlert] = useState({ type: '', message: '' })

  useEffect(() => {
    fetchProduct()
  }, [id])

  useEffect(() => {
    if (product && user) {
      checkFavorite()
    }
  }, [product, user])

  const fetchProduct = async () => {
    setLoading(true)
    setError('')
    try {
      const response = await productsAPI.getOne(id)
      setProduct(response.data)
    } catch (err) {
      setError('Failed to load product')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const checkFavorite = async () => {
    try {
      const response = await favoritesAPI.check(product.id)
      setIsFavorite(response.data.isFavorite)
    } catch (err) {
      console.error('Error checking favorite:', err)
    }
  }

  const toggleFavorite = async () => {
    if (!user) {
      setShowAlert({ type: 'warning', message: 'Please login to add favorites' })
      setTimeout(() => setShowAlert({ type: '', message: '' }), 3000)
      return
    }

    setFavoriteLoading(true)
    try {
      if (isFavorite) {
        await favoritesAPI.remove(product.id)
        setIsFavorite(false)
        setShowAlert({ type: 'success', message: '❤️ Removed from favorites' })
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
      setFavoriteLoading(false)
    }
  }

  const handleAddToCart = () => {
    addToCart(product)
    setShowAlert({ type: 'success', message: `🛒 ${product.title} added to cart!` })
    setTimeout(() => setShowAlert({ type: '', message: '' }), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl text-gray-600">Loading product...</div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600 mb-4">{error || 'Product not found'}</p>
          <button
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Products
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => navigate('/products')}
          className="mb-6 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
        >
          ← Back
        </button>

        {/* Alert Messages */}
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

        <div className="fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white rounded-lg shadow-lg p-8">
            {/* Image */}
            <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-6xl">📦</div>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">{product.title}</h1>

                <div className="mb-6">
                  <span className="text-5xl font-bold text-blue-600">${product.price}</span>
                  <span className="text-gray-600 ml-2">USD</span>
                </div>

                <div className="mb-6 pb-6 border-b">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">Description</h2>
                  <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
                </div>

                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-semibold">Product ID:</span> #{product.id}
                  </p>
                  <p>
                    <span className="font-semibold">Available:</span>{' '}
                    <span className="text-green-600 font-bold">In Stock</span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={toggleFavorite}
                  disabled={favoriteLoading}
                  className={`w-full py-3 rounded-lg font-bold text-white transition transform hover:scale-105 ${
                    isFavorite
                      ? 'bg-red-500 hover:bg-red-600'
                      : 'bg-gray-500 hover:bg-gray-600'
                  } ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isFavorite ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
                </button>
                <button
                  onClick={handleAddToCart}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition transform hover:scale-105"
                >
                  🛒 Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
