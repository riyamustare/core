import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const SignupForm = ({ onClose, onSwitchToLogin }) => {
  // Common states
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Signup states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showOTPVerification, setShowOTPVerification] = useState(false)
  
  // OTP states
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  
  const { signUp } = useAuth()
  const navigate = useNavigate()

  // Signup handlers
  const handleSignupSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const { data, error } = await signUp(email, password)
      if (error) {
        setError(error)
      } else {
        setShowOTPVerification(true)
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignUp = () => {
    // Add your Google sign-up logic here
    console.log('Google sign up clicked')
  }

  // OTP handlers
  const handleOTPChange = (index, value) => {
    if (value.length > 1) return // Prevent pasting multiple characters
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.querySelector(`input[name="otp-${index + 1}"]`)
      if (nextInput) nextInput.focus()
    }
  }

  const handleOTPKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.querySelector(`input[name="otp-${index - 1}"]`)
      if (prevInput) {
        prevInput.focus()
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
      }
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')
    
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setLoading(true)
    setError('')

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otpString,
        type: 'signup'
      })
      
      if (error) throw error
      onClose() // Close the modal
      navigate('/chat') // Redirect to chat page which will show onboarding for new users
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email
      })
      
      if (error) throw error
      
      setError('New code sent successfully!')
      setOtp(['', '', '', '', '', ''])
      
      // Focus on first input
      const firstInput = document.querySelector('input[name="otp-0"]')
      if (firstInput) firstInput.focus()
    } catch (error) {
      setError(error.message)
    }
  }

  const handleBackToSignup = () => {
    setShowOTPVerification(false)
    setOtp(['', '', '', '', '', ''])
    setError('')
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
        
        {!showOTPVerification ? (
          // Signup Form
          <>
            {/* Header Text */}
            <div className="text-center mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">ready when you are</h2>
              <p className="text-sm text-gray-600">your safe space, one convo at a time</p>
            </div>
            
            <div className="space-y-4">
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
              
              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm text-gray-700 mb-2">
                  confirm password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="confirm password"
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 text-sm placeholder-gray-400"
                  required
                />
              </div>
              
              {error && (
                <div className="text-red-600 text-sm">{error}</div>
              )}
              
              {/* Sign Up Button */}
              <button
                type="button"
                onClick={handleSignupSubmit}
                disabled={loading}
                className="w-full bg-[#b3d9ff] hover:bg-[#82bffb] text-black py-3 px-8 rounded-md font-semibold transition-colors disabled:opacity-50 border border-black"
              >
                {loading ? 'creating account...' : 'sign up'}
              </button>
            </div>

            <div className="mt-2 text-center">
              <span className="text-gray-600 text-sm">already have an account? </span>
              <button
                onClick={onSwitchToLogin}
                className="text-black hover:text-gray-700 font-medium text-sm underline"
              >
                login
              </button>
            </div>
            
            {/* OR Divider */}
            <div className="flex items-center my-2">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-sm text-gray-500">or</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>
            
            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full bg-[#b3d9ff] hover:bg-[#82bffb] text-black py-3 px-8 rounded-md font-semibold transition-colors border border-black mt-2"
            >
              google
            </button>

            {/* Footer Text */}
            <p className="text-sm text-gray-500 text-center mt-4 leading-relaxed">
              by signing up you agree to our terms of service,<br />
              privacy policy and acknowledge all is anonymous
            </p>
          </>
        ) : (
          // OTP Verification Form
          <>
            {/* Back Button */}
            <button
              onClick={handleBackToSignup}
              className="absolute top-6 left-6 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ←
            </button>

            <div className="text-center mb-8 pt-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">verify your email</h2>
              <p className="text-sm text-gray-600">
                we've sent a 6-digit code to<br />
                <span className="font-medium">{email}</span>
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-center space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    name={`otp-${index}`}
                    value={digit}
                    onChange={(e) => handleOTPChange(index, e.target.value)}
                    onKeyDown={(e) => handleOTPKeyDown(index, e)}
                    maxLength={1}
                    className="w-12 h-12 text-center border border-gray-200 rounded-lg text-lg bg-white focus:outline-none focus:border-gray-400"
                    pattern="[0-9]*"
                    inputMode="numeric"
                    required
                  />
                ))}
              </div>

              {error && (
                <div className={`text-sm text-center ${error.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {error}
                </div>
              )}

              <button
                type="button"
                onClick={handleOTPSubmit}
                disabled={loading}
                className="w-full bg-[#b3d9ff] hover:bg-[#82bffb] text-black py-3 px-8 rounded-md font-semibold transition-colors disabled:opacity-50 border border-black"
              >
                {loading ? 'verifying...' : 'verify code'}
              </button>
            </div>

            <div className="text-center mt-4">
              <button
                onClick={handleResendOTP}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                didn't receive the code? resend
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default SignupForm