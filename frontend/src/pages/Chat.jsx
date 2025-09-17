import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ArrowUp, Sparkles } from "lucide-react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [sessionSummary, setSessionSummary] = useState(null);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    setShowEndConfirm(false);
    
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
    } catch (error) {
      console.error('Error ending session:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-[#FAF7F2]">
      {/* Header */}
      <div className="bg-[#FAF7F2] px-6 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Sparkles className="w-6 h-6 text-blue-500 mr-3" />
        </div>
        <button
          onClick={() => setShowEndConfirm(true)}
          disabled={isLoading || messages.length === 0}
          className="px-4 py-2 bg-[#b3d9ff] text-black rounded-full hover:bg-[#82bffb] disabled:opacity-50 disabled:cursor-not-allowed transition-colors border border-black font-medium"
        >
          end session
        </button>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <p>ready to listen whenever you are...</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div key={index} className="flex items-start space-x-3">
            {message.role === 'assistant' && (
              <div className="flex-shrink-0">
                <Sparkles className="w-6 h-6 text-blue-500 mt-1" />
              </div>
            )}
            
            <div className={`flex-1 ${message.role === 'user' ? 'flex justify-end' : ''}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gray-300 text-gray-800 ml-auto'
                    : 'bg-gray-300 text-gray-800'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              </div>
            </div>

            {message.role === 'user' && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-[#b3d9ff] rounded-full flex items-center justify-center border border-black">
                  <span className="text-xs font-medium">😊</span>
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <Sparkles className="w-6 h-6 text-blue-500 mt-1" />
            </div>
            <div className="bg-gray-300 text-gray-500 rounded-2xl px-4 py-3 animate-pulse">
              <p className="text-sm">thinking...</p>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 pb-6">
        <form onSubmit={handleSendMessage} className="relative">
          <div className="flex items-center border border-gray-300 rounded-2xl bg-white px-4 py-3 focus-within:border-gray-400">
            <div className="flex-shrink-0 mr-3">
              <div className="w-6 h-6 bg-[#b3d9ff] rounded-full flex items-center justify-center border border-black">
                <span className="text-xs">😊</span>
              </div>
            </div>
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder=""
              className="flex-1 bg-transparent focus:outline-none text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !inputMessage.trim()}
              className="flex-shrink-0 ml-3 p-2 rounded-full bg-[#b3d9ff] text-black hover:bg-[#82bffb] disabled:opacity-50 transition-colors border border-black"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* End Session Confirmation Modal */}
      {showEndConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#FAF7F2] rounded-2xl p-8 max-w-sm w-full mx-4 text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              end the session
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              are you sure you want to end this session?
            </p>
            <div className="flex space-x-3 justify-center">
              <button
                onClick={() => setShowEndConfirm(false)}
                className="px-6 py-2 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                cancel
              </button>
              <button
                onClick={handleEndSession}
                className="px-6 py-2 bg-[#b3d9ff] text-black rounded-lg font-medium hover:bg-[#82bffb] transition-colors border border-black"
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
                  className="px-4 py-2 bg-[#b3d9ff] text-black rounded-lg hover:bg-[#82bffb] border border-black"
                >
                  Continue Session
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;