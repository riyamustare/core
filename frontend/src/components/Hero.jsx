import { useState } from 'react'
import AuthModal from './auth/AuthModal'
import { useAuth } from '../contexts/AuthContext'
import { Link, useLocation } from 'react-router-dom'
import star from '../assets/logoSet.png' 
import star2 from '../assets/long.png'


const Header = () => {
  const [showAuth, setShowAuth] = useState(false)
  const [authView, setAuthView] = useState('login')
  const { user, signOut, loading } = useAuth()
  const location = useLocation()

  const handleSignOut = () => {
    signOut()
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const handleShowLogin = () => {
    setAuthView('login')
    setShowAuth(true)
  }

  const handleShowSignup = () => {
    setAuthView('signup')
    setShowAuth(true)
  }

  // Show loading state
  if (loading) {
    return (
      <header className="bg-[#fdfaf7]">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-bold text-black">core</div>
          <div className="flex items-center space-x-3">
            <div className="w-20 h-9 bg-gray-200 rounded animate-pulse"></div>
            <div className="w-24 h-9 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header className="bg-[#FAF7F2]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-3xl font-extrabold text-black">core</div>

          <div className="flex items-center space-x-3">
            {user ? (
        /* Vertical sidebar for authenticated users */
        <div className="fixed left-0 top-0 h-full w-20 bg-white border-r border-gray-200 flex flex-col items-center py-6 z-50">
          <div className="text-2xl font-extrabold text-black mb-8">core</div>
          
          <div className="flex flex-col items-center space-y-6 flex-1">
            <nav className="flex flex-col items-center space-y-6">
              <Link
                to="/"
                className={`p-3 rounded-lg transition-colors ${
                  isActive('/') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-black'
                }`}
              >
                {/* HomeIcon component */}
                <div className="w-6 h-6">🏠</div>
              </Link>
              <Link
                to="/history"
                className={`p-3 rounded-lg transition-colors ${
                  isActive('/history') ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:text-black'
                }`}
              >
                {/* HistoryIcon component */}
                <div className="w-6 h-6">📋</div>
              </Link>
            </nav>
            
            <div className="mt-auto relative">
              <button
                onClick={toggleProfileMenu}
                className="p-3 rounded-lg text-gray-600 hover:text-black transition-colors"
              >
                {/* ProfileIcon component */}
                <div className="w-6 h-6">👤</div>
              </button>
              
              {showProfileMenu && (
                <div className="absolute bottom-0 left-full ml-2 bg-white border border-gray-200 rounded-md shadow-lg py-2 min-w-[200px]">
                  <span className="block px-4 py-2 text-sm text-gray-700 border-b border-gray-100">
                    Hi, {user.email.split('@')[0]}!
                  </span>
                  <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
              <>
                <button
                  onClick={handleShowLogin}
                  className="bg-black text-white w-[100px] h-[40px] rounded-md font-medium transition-colors duration-200 hover:bg-gray-900 flex items-center justify-center"
                >
                  login
                </button>
                <button
                  onClick={handleShowSignup}
                  className="bg-[#b3d9ff] text-black w-[100px] h-[40px] rounded-md border border-black font-medium transition-colors duration-200 hover:bg-[#82bffb] flex items-center justify-center"
                >
                  signup
                </button>

              </>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialView={authView}
      />
    </>
  )
}

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <main className="flex flex-col items-center justify-center bg-[#FAF7F2] py-12 px-6">
        <div className="text-center max-w-2xl mx-auto">
          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-extrabold text-black leading-snug">
            for when your brain <br />
            won’t shut up!
          </h1>

          {/* Subheading */}
          <p className="text-gray-700 mt-3 text-sm md:text-base">
            your wise, witty AI built to help you explore your <br />
            thoughts, emotions, and behaviors.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setShowAuth(true)}
            className="mt-5 bg-[#b3d9ff] hover:bg-[#82bffb] text-black text-sm font-semibold w-[200px] h-[40px] rounded-md border border-black transition-colors"
          >
            get started for free!
          </button>
        </div>

        {/* Video Placeholder with stars */}
        <div className="relative mt-10 w-full max-w-3xl">
          {/* Grey video placeholder */}
          <div className="w-full h-[380px] md:h-[420px] bg-gray-200 rounded-xl"></div>

          {/* Star decorations */}
          
          <img
            src={star}
            alt="star"
            className="absolute -top-18 -left-8 w-24 md:w-36 md:-left-12 md:-top-26"
          />
          <img
            src={star2}
            alt="star"
            className="absolute -bottom-6 -right-6 w-16 md:w-24 md:-bottom-8 md:-right-8"
          />
        </div>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialView="signup"
      />
    </>
  )
}

const HeroPage = () => {
  return (
    <>
      <Header />
      <LandingPage />
    </>
  )
}

export default HeroPage
