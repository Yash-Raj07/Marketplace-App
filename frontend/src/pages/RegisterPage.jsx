import { useAuth } from '../AuthContext'
import { useNavigate } from 'react-router-dom'
import RegisterForm from '../components/RegisterForm'

export default function RegisterPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (user) {
    navigate('/products')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <div className="text-center mb-8">
          <span className="text-5xl">🎉</span>
          <h1 className="text-3xl font-bold text-gray-900 mt-3">Join Us</h1>
          <p className="text-gray-600 text-sm mt-2">Create your account to start shopping</p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
