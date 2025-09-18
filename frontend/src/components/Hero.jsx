import { useState } from 'react'
import AuthModal from './auth/AuthModal'
import { useAuth } from '../contexts/AuthContext'
import { Link, useLocation } from 'react-router-dom'
import star from '../assets/logoSet.png'
import star2 from '../assets/long.png'
import History from '../assets/history.svg'

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
    
    {/* Logo (only show when NOT logged in) */}
    {!user && (
      <div className="text-3xl font-extrabold text-black">
        core
      </div>
    )}

    {/* Right-side buttons / sidebar */}
    <div className="flex items-center space-x-3">
      {user ? (
        // Sidebar nav + logout button for logged-in user
        <div className="flex flex-col items-center space-y-6 w-8 md:w-12">
          <Link to="/" className="mt-6">
              <img src={star2} alt="Home" className="w-12 h-auto" />
            </Link>
          <Link to="/history" className="mt-1" >
              <img src={History} alt="History" className="w-6 h-auto" />
            </Link>
          <button
                onClick={handleSignOut}
                className="absolute bottom-8 bg-black text-white text-sm px-2 py-2 rounded-md shadow-lg hover:bg-gray-800 transition-colors"
              >
                Logout
              </button>
        </div>
      ) : (
        // Login / Signup buttons
        <>
          <button
            onClick={handleShowLogin}
            className="bg-black text-white w-[100px] h-[40px] rounded-md font-medium transition-colors duration-200 hover:bg-gray-900 flex items-center justify-center"
          >
            Login
          </button>
          <button
            onClick={handleShowSignup}
            className="bg-[#b3d9ff] text-black w-[100px] h-[40px] rounded-md border border-black font-medium transition-colors duration-200 hover:bg-[#82bffb] flex items-center justify-center"
          >
            Signup
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
export { Header }