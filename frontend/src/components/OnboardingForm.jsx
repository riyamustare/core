import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { ArrowLeft } from 'lucide-react' // <-- modern back icon
import starIcon from '../assets/long.png' // update path

const OnboardingForm = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1)
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

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...formData,
          onboarding_complete: true
        })
        .eq('id', user.id)

      if (error) throw error
      onComplete()
    } catch (error) {
      console.error('Error saving onboarding data:', error)
    }
  }

  // figure out if "continue" should be enabled
  const isContinueDisabled = () => {
    switch (currentStep) {
      case 2:
        return !formData.gender
      case 3:
        return !formData.age_range
      case 4:
        return !formData.relationship_status
      case 5:
        return !formData.support_area
      default:
        return false
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="flex flex-col w-full max-w-md space-y-6">
            <div className="flex items-start space-x-3">
              <img src={starIcon} alt="star" className="w-6 h-6 mt-1" />
              <p className="text-gray-900 text-sm leading-relaxed text-left">
                hi name,
                <br /><br />
                we created core because life can be a lottt
                <br /><br />
                sometimes you just need someone to talk to
                <br /><br />
                whether you’re navigating a rough day,<br />
                figuring things out,<br />
                or just need a moment to breathe
                <br /><br />
                we’re here for you &lt;3
                <br /><br />
                love,<br />
                riya
              </p>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="flex flex-col items-start text-left space-y-6 w-full max-w-md mt-10">
            <h2 className="text-lg font-semibold text-gray-900">
              how do you identify?
            </h2>
            <div className="w-full space-y-3">
              {['female', 'male', 'non-binary', 'other'].map(option => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect('gender', option)}
                  className={`w-full py-3 px-4 rounded-md text-base text-left font-medium ${
                    formData.gender === option
                      ? 'bg-[#add8ff] text-gray-900'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 3:
        return (
          <div className="flex flex-col items-start text-left space-y-6 w-full max-w-md mt-10">
            <h2 className="text-lg font-semibold text-gray-900">how old are you?</h2>
            <div className="w-full space-y-3">
              {['under 18', '18–24', '25–34', '35+', 'prefer not to say'].map(option => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect('age_range', option)}
                  className={`w-full py-3 px-4 rounded-md text-base text-left font-medium ${
                    formData.age_range === option
                      ? 'bg-[#add8ff] text-gray-900'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 4:
        return (
          <div className="flex flex-col items-start text-left space-y-6 w-full max-w-md mt-10">
            <h2 className="text-lg font-semibold text-gray-900">relationship status</h2>
            <div className="w-full space-y-3">
              {[
                'single',
                'situationship',
                'in a relationship',
                "it’s complicated",
                'married',
                'divorced / separated',
                'widowed',
                'prefer not to say'
              ].map(option => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect('relationship_status', option)}
                  className={`w-full py-3 px-4 rounded-md text-base text-left font-medium ${
                    formData.relationship_status === option
                      ? 'bg-[#add8ff] text-gray-900'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 5:
        return (
          <div className="flex flex-col items-start text-left space-y-6 w-full max-w-md mt-10">
            <h2 className="text-lg font-semibold text-gray-900">what are you most looking for support with?</h2>
            <div className="w-full space-y-3">
              {['anxiety', 'depression', 'relationship', 'loneliness', 'something else'].map(option => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect('support_area', option)}
                  className={`w-full py-3 px-4 rounded-md text-base text-left font-medium ${
                    formData.support_area === option
                      ? 'bg-[#add8ff] text-gray-900'
                      : 'bg-gray-200 text-gray-900'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case 6:
        return (
          <div className="flex flex-col items-start text-left space-y-6 w-full max-w-md mt-10">
            <h2 className="text-lg font-semibold text-gray-900">our promise to you</h2>
            <div className="text-gray-700 text-base space-y-2 w-full">
              <p>✨ everything you share stays private</p>
              <p>✨ no judgment, ever</p>
              <p>✨ we’re here to listen</p>
            </div>
          </div>
        )

      case 7:
        return (
          <div className="flex flex-col items-start text-left space-y-6 w-full max-w-md mt-10">
            <h2 className="text-lg font-semibold text-gray-900">you’re all set!</h2>
            <p className="text-base text-gray-700">
              we’ve set up your personalized space.<br />
              you’re ready to start your journey with core.
            </p>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-[#fefcfa] flex flex-col justify-between items-center px-6 py-8">
      {/* Top bar with back button + progress */}
      <div className="w-full max-w-md flex items-center space-x-3">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className={`p-2 rounded-full transition ${
            currentStep === 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="w-5 h-5 text-gray-800" />
        </button>
        <div className="flex-1 h-1 bg-gray-200 rounded-full">
          <div
            className="h-1 bg-gray-800 rounded-full transition-all"
            style={{ width: `${(currentStep / 7) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1 flex items-start justify-center w-full mt-10">
        {renderStep()}
      </div>

      {/* Continue button */}
      <button
        onClick={currentStep === 7 ? handleComplete : nextStep}
        disabled={isContinueDisabled()}
        className={`w-full max-w-md py-3 rounded-md text-base font-medium mt-6 transition ${
          isContinueDisabled()
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#add8ff] text-gray-900 hover:bg-[#9ed0ff]'
        }`}
      >
        continue
      </button>
    </div>
  )
}

export default OnboardingForm
