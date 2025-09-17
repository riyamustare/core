import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const LoginForm = ({ onClose, onSwitchToSignup }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { signIn } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error } = await signIn(email, password)
    
    if (error) {
      setError(error)
    } else {
      onClose()
    }
    
    setLoading(false)
  }

  const handleGoogleSignIn = () => {
    // Add your Google sign-in logic here
    console.log('Google sign in clicked')
  }

  return (
    <div className="fixed inset-0 bg-[#FAF7F2] flex items-center justify-center z-50">
      <div className="bg-[#FAF7F2] w-full max-w-sm mx-4">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-2xl"
        >
          ×
        </button>

        
        
        {/* Header Text */}
        <div className="text-center mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">ready when you are</h2>
          <p className="text-sm text-gray-600">your safe space, one convo at a time</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              enter your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-sm"
              required
            />
          </div>
          
          {/* Password Input */}
          <div>
            <label className="block text-sm text-gray-700 mb-2">
              password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="password"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-sm placeholder-gray-400"
              required
            />
          </div>
          
          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}
          
          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#b3d9ff] hover:bg-[#82bffb] text-black py-3 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 border border-black"
          >
            {loading ? 'loging in...' : 'login'}
          </button>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              type="button"
              className="text-sm text-gray-600 hover:text-gray-800 underline"
            >
              forgot your password?
            </button>
            <div className="text-center">
          <span className="text-gray-600 text-sm">don't have an account? </span>
          <button
            onClick={onSwitchToSignup}
            className="text-black hover:text-gray-700 font-medium text-sm underline"
          >
            signup
          </button>
        </div>
          </div>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-2">
          <div className="flex-1 border-t border-gray-300"></div>
          <span className="px-4 text-sm text-gray-500">or</span>
          <div className="flex-1 border-t border-gray-300"></div>
        </div>
        
        {/* Google Sign In */}
        <button
          onClick={handleGoogleSignIn}
          className="w-full bg-[#b3d9ff] hover:bg-[#82bffb] text-black py-3 px-4 rounded-lg font-medium transition-colors border border-black mt-2"
        >
          google
        </button>

        {/* Footer Text */}
        <p className="text-sm text-gray-500 text-center mt-2 leading-relaxed">
          by signing up you agree to our terms of service,<br />
          privacy policy and acknowledge all is anonymous
        </p>
      
      </div>
    </div>
  )
}

export default LoginForm