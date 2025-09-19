import { useState } from 'react'
import AuthModal from './auth/AuthModal'
import { useAuth } from '../contexts/AuthContext'
import { Link, useLocation } from 'react-router-dom'
import star from '../assets/logoSet.png'
import star2 from '../assets/long.png'
import History from '../assets/history.svg'

import { Menu } from "lucide-react" // hamburger icon

const Header = () => {
  const [showAuth, setShowAuth] = useState(false)
  const [authView, setAuthView] = useState('login')
  const { user, signOut, loading } = useAuth()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = () => {
    signOut()
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
      {/* Authenticated Floating Header */}
      {user ? (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-[#FAF7F2]/70 backdrop-blur-md rounded-2xl shadow-lg z-50">
          <div className="px-6 py-3 flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-xl md:text-2xl font-extrabold text-black">
              core
            </Link>

            {/* Large screen nav */}
            <nav className="hidden md:flex items-center space-x-6">
              {/* <Link to="/" className="text-black hover:text-gray-700 font-medium">
                Home
              </Link> */}
              <Link to="/history" className="text-black hover:text-gray-700 font-medium">
                History
              </Link>
              <button
                onClick={handleSignOut}
                className="bg-black text-white text-sm px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </nav>

            {/* Small screen hamburger */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-black/5"
            >
              <Menu className="w-6 h-6 text-black" />
            </button>
          </div>

          {/* Mobile dropdown menu */}
          {menuOpen && (
            <div className="md:hidden flex flex-col px-6 pb-4 space-y-3">
              {/* <Link to="/" onClick={() => setMenuOpen(false)} className="text-black hover:text-gray-700">
                Home
              </Link> */}
              <Link to="/history" onClick={() => setMenuOpen(false)} className="text-black hover:text-gray-700">
                History
              </Link>
              <button
                onClick={() => {
                  handleSignOut()
                  setMenuOpen(false)
                }}
                className="bg-black text-white text-sm px-4 py-2 rounded-lg shadow hover:bg-gray-800 transition"
              >
                Logout
              </button>
            </div>
          )}
        </header>
      ) : (
        // Unauthenticated Header
        <header className="bg-[#FAF7F2]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            {/* Logo */}
            <div className="text-3xl font-extrabold text-black">core</div>

            {/* Login / Signup buttons */}
            <div className="flex items-center space-x-3">
              <button
                onClick={handleShowLogin}
                className="bg-black text-white w-[100px] h-[40px] rounded-md font-medium hover:bg-gray-900 transition"
              >
                Login
              </button>
              <button
                onClick={handleShowSignup}
                className="bg-[#b3d9ff] text-black w-[100px] h-[40px] rounded-md border border-black font-medium hover:bg-[#82bffb] transition"
              >
                Signup
              </button>
            </div>
          </div>
        </header>
      )}

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
            for when your brain<br />
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