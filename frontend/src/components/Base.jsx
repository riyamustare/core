import { useState } from 'react'
import footerImage from '../assets/footer.png'
import AuthModal from './auth/AuthModal'
import { Check } from "lucide-react"

const Pricing = () => {
  const plans = [
    {
      name: "Monthly",
      price: "₹999",
      period: "/month",
      description: "The basics for automating your design tokens and assets syncing",
      button: "Start free trial",
      buttonColor: "bg-black hover:bg-gray-800 text-white",
      features: ["1 user", "1 repository", "Unlimited sources", "Unlimited destinations"],
      accent: "black"
    },
    {
      name: "Daily",
      price: "₹49",
      period: "/month",
      description: "Built for teams looking to streamline their workflows",
      button: "Start for free",
      buttonColor: "bg-[#b3d9ff] hover:bg-[#82bffb] text-black",
      features: ["4 users", "2 repositories", "Unlimited sources", "Unlimited destinations"],
      accent: "black",
      popular: true
    },
    {
      name: "Yearly",
      price: "₹9999",
      period: "/month",
      description: "The basics for automating your design tokens and assets syncing",
      button: "Start free trial",
      buttonColor: "bg-black hover:bg-gray-800 text-white",
      features: ["1 user", "1 repository", "Unlimited sources", "Unlimited destinations"],
      accent: "black"
    }
  ]

  return (
    <section className="bg-[#FAF7F2] py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          try more with core
        </h2>
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative rounded-2xl border ${
              plan.popular ? "border-bg-[#82bffb] shadow-lg" : "border-gray-200"
            } p-6 flex flex-col`}
          >

            {/* Plan name */}
            <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>

            {/* Price */}
            <div className="mt-3 mb-2">
              <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
              {plan.period && <span className="text-gray-600 text-lg ml-1">{plan.period}</span>}
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-6">{plan.description}</p>

            {/* CTA Button */}
            <button
              className={`${plan.buttonColor} font-medium border py-2.5 px-4 rounded-md w-full transition-colors`}
            >
              {plan.button}
            </button>

            {/* Features */}
            <ul className="mt-6 space-y-3 text-sm text-gray-700">
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className="flex items-center space-x-2">
                  <Check
                    className={`h-5 w-5 text-black`}
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}

// FAQ Section Component
const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null)

  const faqs = [
    {
      question: "What is a Mariana AI?",
      answer: "Mariana AI is your personal AI companion designed to help you process thoughts, emotions, and experiences. Named after the deepest part of the ocean, it's built to dive deep into your mental landscape and help you navigate whatever you're going through."
    },
    {
      question: "Is this the same as therapy?",
      answer: "No, Core is not a replacement for professional therapy or medical treatment. It's a supportive tool for self-reflection and emotional processing. If you're dealing with serious mental health concerns, we encourage you to seek help from qualified professionals."
    },
    {
      question: "Will anyone see my conversations?",
      answer: "Your privacy is our top priority. Your conversations are encrypted and stored securely. We don't share, sell, or analyze your personal conversations. Only you have access to your chat history."
    },
    {
      question: "Do I need to pay?",
      answer: "Core offers a free tier that gives you access to basic conversations and support. We also have premium features available for users who want enhanced capabilities and unlimited access."
    },
    {
      question: "Do I need to be tech-savvy?",
      answer: "Not at all! Core is designed to be incredibly simple to use. Just open the app and start talking. No setup, no complicated features to learn, no technical knowledge required. It's as easy as having a conversation."
    }
  ]

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="bg-[#FAF7F2] py-12">
      <div className="max-w-3xl mx-auto px-6">
        {/* FAQ Heading */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
          frequently asked questions
        </h2>

        {/* FAQ Items */}
        <div className="space-y-0 border-t border-gray-200">
          {faqs.map((faq, index) => (
            <div key={index}>
              {/* Question Header */}
              <button
                onClick={() => toggleFAQ(index)}
                className={`w-full px-0 py-6 text-left flex justify-between items-center hover:bg-[#fdf8ef] transition-colors ${
                  openIndex === index ? '' : 'border-b border-gray-200'
                }`}
              >
                <span className="font-medium text-gray-900 pr-4">
                  {faq.question}
                </span>
                <div className="flex-shrink-0">
                  <svg
                    className={`w-5 h-5 text-gray-600 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </button>

              {/* Answer Content */}
              {openIndex === index && (
                <div className="px-0 pb-6">
                  <p className="text-gray-700 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// CTA Section Component
const CTASection = () => {
  const [showAuth, setShowAuth] = useState(false)

  return (
    <section className="bg-[#FAF7F2] py-12">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* CTA Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          ready when you are :)
        </h2>
        
        {/* CTA Subtext */}
        <p className="text-gray-600 mb-4 text-lg">
          be heard. be understood. be better.
        </p>

        {/* CTA Button */}
        <button
          onClick={() => setShowAuth(true)}
          className="bg-[#b3d9ff] hover:bg-[#82bffb] text-black font-semibold px-8 py-3 rounded-md border border-black transition-colors"
        >
          get started
        </button>
        
      </div>
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        initialView="signup"
      />
    </section>
  )
}

const Footer = () => {
  return (
    <footer className="bg-[#FAF7F2]">
      <div className="max-w-5xl mx-auto px-6 pb-8">
        {/* Footer Image */}
        <div className="w-full h-[200px] md:h-[300px] rounded-3xl overflow-hidden">
           
            <img
              src={footerImage}
              alt="Footer"
              className="w-full h-full object-cover"
            />
          
        </div>
      </div>
    </footer>
  )
}

// Combined Component Export
const FAQAndFooter = ({ footerImage, onGetStarted }) => {
  return (
    <>
    <Pricing />
      <FAQSection />
      <CTASection onGetStarted={onGetStarted} />
      <Footer footerImage={footerImage} />
    </>
  )
}

export default FAQAndFooter

// Individual exports if you want to use them separately
export { FAQSection, CTASection, Footer }