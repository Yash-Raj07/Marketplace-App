import { useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function HomePage() {
  const { user } = useNavigate()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center text-white animate-fadeIn">
          <div className="mb-6 animate-bounce">
            <span className="text-8xl inline-block">🛍️</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-4">
            Marketplace
          </h1>
          <p className="text-2xl md:text-3xl mb-8 text-gray-100">
            Discover Amazing Products
          </p>
          <p className="text-lg md:text-xl mb-12 text-gray-100 max-w-2xl mx-auto">
            Browse our collection of premium products, add your favorites, and enjoy a smooth shopping experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/products')}
              className="px-8 py-4 bg-white text-blue-600 font-bold text-lg rounded-lg hover:bg-gray-100 transition transform hover:scale-105 shadow-lg"
            >
              Start Shopping 🚀
            </button>
            {!user && (
              <button
                onClick={() => navigate('/register')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-bold text-lg rounded-lg hover:bg-white hover:text-blue-600 transition transform hover:scale-105"
              >
                Create Account
              </button>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20">
          {[
            { icon: '🔐', title: 'Secure Auth', desc: 'JWT-based authentication' },
            { icon: '🔍', title: 'Smart Search', desc: 'Find products easily' },
            { icon: '❤️', title: 'Favorites', desc: 'Save your favorites' },
          ].map((feature, idx) => (
            <div
              key={idx}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6 text-white text-center hover:bg-opacity-20 transition animate-fadeIn"
              style={{ animationDelay: `${idx * 0.1}s` }}
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-100">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
