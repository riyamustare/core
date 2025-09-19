import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowUp } from "lucide-react";
import Logo from '../assets/long.png'; // Ensure you have a logo image in assets
import User from '../assets/user.png'; // Placeholder user image
import {Header} from '../components/Hero';
import { supabase } from '../lib/supabase';
import OnboardingForm from '../components/OnboardingForm';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showEndSessionModal, setShowEndSessionModal] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('onboarding_complete')
          .eq('id', user.id)
          .single();
        
        if (error) throw error;
        setIsOnboardingComplete(data?.onboarding_complete || false);
      } catch (error) {
        console.error('Error checking onboarding status:', error);
      } finally {
        setIsCheckingOnboarding(false);
      }
    };

    checkOnboardingStatus();
  }, [user]);

useEffect(() => {
    if (!isCheckingOnboarding && isOnboardingComplete && messages.length === 0) {
      setMessages([
        {
          role: 'assistant',
          content: "Hey there I'm here to chat with you. How are you feeling today?"
        }
      ]);
    }
  }, [isCheckingOnboarding, isOnboardingComplete, messages.length]);


  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setIsLoading(true);

    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          user_id: user?.id,
          history: messages.map(msg => [
            msg.role === 'user' ? 'human' : 'assistant',
            msg.content
          ])
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from server');
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [
        ...prev,
        { role: 'system', content: `An error occurred: ${error.message}. Please try again.` }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndSession = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:8000/api/chat/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'end_session',
          user_id: user?.id,
          history: messages.map(msg => [
            msg.role === 'user' ? 'human' : 'assistant',
            msg.content
          ])
        }),
      });

      if (!response.ok) throw new Error('Failed to end session');

      const data = await response.json();
      setSessionSummary(data);
      setShowSummary(true);
      setShowEndSessionModal(false);
    } catch (error) {
      console.error('Error ending session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnboardingComplete = () => {
    setIsOnboardingComplete(true);
  };

  if (isCheckingOnboarding) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isOnboardingComplete) {
    return <OnboardingForm onComplete={handleOnboardingComplete} />;
  }

  return (
    <>
    <Header />
    <div className="flex flex-col h-screen bg-[#f5f5f0] pt-24">
      {/* Session Actions */}
<div className="px-6 mb-4">
  <div className="max-w-5xl mx-auto flex justify-end">
    <button
      onClick={() => setShowEndSessionModal(true)}
      disabled={isLoading || messages.length === 1}
      className="px-6 py-2 bg-[#b3d9ff] text-black rounded-full border border-black 
                 hover:bg-[rgb(130,191,251)] disabled:opacity-50 disabled:cursor-not-allowed 
                 transition-colors font-medium shadow-sm"
    >
      end session
    </button>
  </div>
</div>


      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {messages.map((message, index) => (
            <div key={index} className={`flex items-start space-x-4 mb-6 ${
              message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}>
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full">
                  <img 
                    src={Logo}
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              {message.role === 'user' && (
                <div className="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
                  <img 
                    src={User} 
                    alt="User profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className={`flex-1 max-w-[70%] ${
                message.role === 'user' ? 'flex justify-end' : ''
              }`}>
                <div
                  className={`rounded-3xl px-6 py-4 shadow-sm ${
                    message.role === 'user'
                      ? 'bg-white border border-gray-200 rounded-br-md'
                      : 'bg-gray-100 text-gray-800 rounded-bl-md'
                  }`}
                >
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start space-x-4 mb-6">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <div className="w-5 h-5 text-white">✦</div>
              </div>
              <div className="bg-gray-100 text-gray-500 rounded-3xl rounded-bl-md px-6 py-4 animate-pulse shadow-sm">
                <p className="text-sm">Thinking...</p>
              </div>
            </div>
          )}
        </div>
        
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 pb-6">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex items-center rounded-2xl border border-gray-300 bg-white px-4 py-3 focus-within:border-blue-400">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 bg-transparent px-2 focus:outline-none text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="p-2 rounded-full bg-[#b3d9ff] text-black hover:bg-[#82bffb] disabled:opacity-50 transition-colors border border-gray-300 ml-2"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* End Session Confirmation Modal */}
      {showEndSessionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <h2 className="text-xl font-semibold mb-2">end the session</h2>
            <p className="text-gray-600 mb-6">are you sure you want to end this session?</p>
            
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowEndSessionModal(false)}
                className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                cancel
              </button>
              <button
                onClick={handleEndSession}
                disabled={isLoading}
                className="px-6 py-2 bg-[#b3d9ff] text-black rounded-lg hover:bg-[#82bffb] disabled:opacity-50 transition-colors border border-black"
              >
                confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Modal */}
      {showSummary && sessionSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-4">Session Summary</h2>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Emotions Identified</h3>
                <div className="flex flex-wrap gap-2">
                  {sessionSummary.emotions.map((emotion, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {emotion}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Topics Discussed</h3>
                <div className="flex flex-wrap gap-2">
                  {sessionSummary.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="font-semibold mb-2">Session Insights</h3>
                <p className="whitespace-pre-wrap">{sessionSummary.summary}</p>
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => navigate('/')}
                  className="px-4 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200"
                >
                  Return Home
                </button>
                <button
                  onClick={() => setShowSummary(false)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  Continue Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default Chat;