import { useState, useEffect } from 'react'
import LoginForm from '../../auth/LoginForm'
import SignupForm from '../../auth/SignupForm'

const AuthModal = ({ isOpen, onClose, initialView = 'login' }) => {
  const [view, setView] = useState(initialView)

  // Update view when initialView prop changes
  useEffect(() => {
    setView(initialView)
  }, [initialView])

  if (!isOpen) return null

  const handleSwitchToLogin = () => {
    setView('login')
  }

  const handleSwitchToSignup = () => {
    setView('signup')
  }

  return (
    <>
      {view === 'login' ? (
        <LoginForm 
          onClose={onClose}
          onSwitchToSignup={handleSwitchToSignup}
        />
      ) : (
        <SignupForm 
          onClose={onClose}
          onSwitchToLogin={handleSwitchToLogin}
        />
      )}
    </>
  )
}

export default AuthModal