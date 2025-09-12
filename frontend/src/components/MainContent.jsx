import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'
import OnboardingForm from './OnboardingForm'

const MainContent = () => {
  const { user, loading } = useAuth()
  const [profile, setProfile] = useState(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    if (user) {
      fetchProfile()
    } else {
      setProfileLoading(false)
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) throw error
      setProfile(data)
    } catch (error) {
      console.error('Error fetching profile:', error)
      // If no profile exists, it will be null (new user)
      setProfile(null)
    } finally {
      setProfileLoading(false)
    }
  }

  const handleOnboardingComplete = async () => {
    // Refetch profile to get updated data
    await fetchProfile()
  }

  const navigate = useNavigate()
  
  const handleGetStarted = () => {
    navigate('/chat')
  }

  // Show loading state
  if (loading || profileLoading) {
    return (
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="w-8 h-8 border-4 border-gray-200 rounded-full border-t-yellow-400 animate-spin"></div>
      </main>
    )
  }

  // If user is logged in but hasn't completed onboarding
  if (user && (!profile || !profile.onboarding_complete)) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />
  }

  // If user is logged in and has completed onboarding
  if (user && profile && profile.onboarding_complete) {
    return (
      <main className="flex-1 flex items-center justify-center py-12">
        <div className="max-w-6xl w-full px-6">
          <div className="text-left mb-12">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-4">
              welcome back.
            </h1>
            <h2 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-8">
              ready to continue?
            </h2>

            <p className="text-xl text-gray-700 mb-8 max-w-lg">
              Your safe space is here whenever you need it. What's on your mind today?
            </p>

            <button 
              onClick={handleGetStarted} 
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-md border border-black font-medium text-lg transition-colors mb-6"
            >
              Continue conversation
            </button>

            <p className="text-gray-500 text-sm">
              be heard. be understood. be better.
            </p>
          </div>
        </div>
      </main>
    )
  }

  // Default state for non-logged-in users
  return (
    <main className="flex-1 flex items-center justify-center py-12">
      <div className="max-w-6xl w-full px-6">
        <div className="text-left mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-4">
            it's not therapy.
          </h1>
          <h2 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-8">
            just a place to think out loud.
          </h2>

          <p className="text-xl text-gray-700 mb-8 max-w-lg">
            meet core, your friendly AI companion designed to listen, reflect, and help you make sense of your thoughts and feelings.
          </p>

          <button 
            onClick={() => console.log("Sign up to get started")} 
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-md border border-black font-medium text-lg transition-colors mb-6"
          >
            start yapping — it's free
          </button>

          <p className="text-gray-500 text-sm">
            be heard. be understood. be better.
          </p>
        </div>
      </div>
    </main>
  )
}

export default MainContent