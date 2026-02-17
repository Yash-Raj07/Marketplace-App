import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'
import LoginForm from '../components/LoginForm'

export default function LoginPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/products')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-5xl">🛍️</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-3">Welcome Back</h1>
        </div>

        <LoginForm />

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <a
              href="/register"
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Sign up
            </a>
          </p>
        </div>

        <div className="mt-8 pt-6 border-t">
          <p className="text-xs text-gray-500 text-center mb-3">Demo Credentials</p>
          <div className="bg-gray-50 p-3 rounded text-xs space-y-1">
            <p>
              <span className="font-semibold">Email:</span> user1@example.com
            </p>
            <p>
              <span className="font-semibold">Password:</span> password123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
