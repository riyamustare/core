import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import LoginForm from '../auth/LoginForm'
import SignupForm from '../auth/SignupForm'

const Header = () => {
  const [showLogin, setShowLogin] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const { user, signOut, loading } = useAuth()

  const handleSignOut = () => {
    signOut()
  }

  // Show loading state
  if (loading) {
    return (
      <header className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex justify-between items-center">
          <div className="text-4xl font-black text-gray-900">core</div>
          <div className="flex items-center space-x-4">
            <div className="w-20 h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 flex justify-between items-center">
          <div className="text-4xl font-black text-gray-900">core</div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              // Authenticated state
              <>
                <span className="text-gray-700">
                  Hi, {user.email.split('@')[0]}!
                </span>
                <button 
                  onClick={handleSignOut}
                  className="text-gray-800 hover:text-gray-900 px-4 py-2 rounded-md border border-black bg-gray-100 hover:bg-gray-200 font-bold transition-colors"
                >
                  Sign Out
                </button>
              </>
            ) : (
              // Unauthenticated state
              <>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="text-gray-800 hover:text-gray-900 px-4 py-2 rounded-md border border-black bg-gray-100 hover:bg-gray-200 font-bold transition-colors"
                >
                  Log In
                </button>
                <button 
                  onClick={() => setShowSignup(true)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-md border border-black font-bold transition-colors"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modals */}
      {showLogin && (
        <LoginForm 
          onClose={() => setShowLogin(false)}
          onSwitchToSignup={() => {
            setShowLogin(false)
            setShowSignup(true)
          }}
        />
      )}
      
      {showSignup && (
        <SignupForm 
          onClose={() => setShowSignup(false)}
          onSwitchToLogin={() => {
            setShowSignup(false)
            setShowLogin(true)
          }}
        />
      )}
    </>
  )
}

export default Header