import { useNavigate } from 'react-router-dom'
import { Header } from './Hero'

const Dashboard = () => {
  const navigate = useNavigate()
  
  const handleGetStarted = () => {
    navigate('/chat')
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center bg-[#f5f5f0]">
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-bold text-black mb-6">
            start conversation
          </h1>
          
          <p className="text-lg text-gray-700 mb-12 max-w-md mx-auto">
            your wise, witty AI built to help you explore your thoughts, emotions, and behaviors.
          </p>

          <button
            onClick={() => navigate('/chat')}
            className="bg-[#b3d9ff] hover:bg-[#82bffb] text-black px-8 py-3 rounded-md border border-black font-medium text-lg transition-colors"
          >
            text mode
          </button>
        </div>
      </main>
    </div>
  )
}

export default Dashboard