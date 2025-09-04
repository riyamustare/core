import { AuthProvider } from './contexts/AuthContext'
import Header from "./components/Header.jsx"
import MainContent from "./components/MainContent.jsx"

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <Header />
        <MainContent />
      </div>
    </AuthProvider>
  )
}

export default App
