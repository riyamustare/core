import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from "./components/Header.jsx";
import MainContent from "./components/MainContent.jsx";
import Chat from './pages/Chat';
import SessionHistory from './pages/SessionHistory';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            <Route path="/" element={<MainContent />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/history" element={<SessionHistory />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
