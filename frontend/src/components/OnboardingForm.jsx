import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const OnboardingForm = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [formData, setFormData] = useState({
    gender: '',
    age_range: '',
    relationship_status: '',
    support_area: ''
  })
  const { user } = useAuth()

  const handleOptionSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleAnalyzing = async () => {
    setIsAnalyzing(true)
    
    // Save to database
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          onboarding_complete: true
        })
        .eq('id', user.id)

      if (error) throw error
      
      // Simulate analyzing animation
      setTimeout(() => {
        setIsAnalyzing(false)
        setCurrentStep(7)
      }, 3000)
    } catch (error) {
      console.error('Error saving onboarding data:', error)
      setIsAnalyzing(false)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 leading-relaxed">
              Hi friend — we created this because life can be a lot and sometimes you just need to talk.
            </h2>
            <button
              onClick={nextStep}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-md border border-black font-medium text-lg transition-colors"
            >
              Continue
            </button>
          </div>
        )

      case 2:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              How do you identify?
            </h2>
            <div className="space-y-4 max-w-md mx-auto">
              {['Female', 'Male', 'Non-binary', 'Other'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleOptionSelect('gender', option)
                    nextStep()
                  }}
                  className="w-full py-4 px-6 border-2 border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              How many years young are you?
            </h2>
            <div className="space-y-4 max-w-md mx-auto">
              {['Under 18', '18–24', '35+', 'Prefer not to say'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleOptionSelect('age_range', option)
                    nextStep()
                  }}
                  className="w-full py-4 px-6 border-2 border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Relationship status
            </h2>
            <div className="space-y-4 max-w-md mx-auto">
              {[
                'Situationship',
                'Single',
                'In a relationship',
                "It's complicated",
                'Married',
                'Divorced/Separated',
                'Widowed',
                'Prefer not to say'
              ].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleOptionSelect('relationship_status', option)
                    nextStep()
                  }}
                  className="w-full py-4 px-6 border-2 border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              What are you most looking for support with?
            </h2>
            <div className="space-y-4 max-w-md mx-auto">
              {['Anxiety', 'Depression', 'Relationship', 'Loneliness', 'Something else'].map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    handleOptionSelect('support_area', option)
                    nextStep()
                  }}
                  className="w-full py-4 px-6 border-2 border-gray-300 rounded-lg hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left font-medium"
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Our commitment to you
            </h2>
            <div className="max-w-md mx-auto mb-8">
              <div className="space-y-6">
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-lg font-medium text-gray-700">Locked tight</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-lg font-medium text-gray-700">No peeking</span>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-lg font-medium text-gray-700">Pinky promise</span>
                </div>
              </div>
            </div>
            <button
              onClick={handleAnalyzing}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-md border border-black font-medium text-lg transition-colors"
            >
              Continue
            </button>
          </div>
        )

      case 7:
        if (isAnalyzing) {
          return (
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-8">
                Analyzing…
              </h2>
              <div className="flex justify-center mb-8">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-16 h-16 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
                </div>
              </div>
              <p className="text-gray-600">Setting up your personalized experience...</p>
            </div>
          )
        }
        
        return (
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Ready to start your journey
            </h2>
            <p className="text-xl text-gray-700 mb-8 max-w-lg mx-auto">
              Great! We've set up your personalized space. You're all ready to start having meaningful conversations with core.
            </p>
            <button
              onClick={onComplete}
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-8 py-4 rounded-md border border-black font-medium text-lg transition-colors"
            >
              Start conversation
            </button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center py-12">
      <div className="max-w-2xl w-full px-6">
        {/* Progress indicator */}
        <div className="mb-12">
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <div
                key={step}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-yellow-400' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-center mt-4 text-gray-600">
            Step {currentStep} of 7
          </div>
        </div>

        {renderStep()}
      </div>
    </div>
  )
}

export default OnboardingForm