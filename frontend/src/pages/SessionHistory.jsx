import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';

const SessionHistory = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, [user]);

  const fetchSessions = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/sessions/?user_id=${user?.id}`);
      if (!response.ok) throw new Error('Failed to fetch sessions');
      const data = await response.json();
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMMM d, yyyy h:mm a');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="w-8 h-8 border-4 border-gray-200 rounded-full border-t-yellow-400 animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Session History</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Sessions List */}
        <div className="md:col-span-1 space-y-4">
          {sessions.length === 0 ? (
            <p className="text-gray-500">No sessions yet. Start a conversation to begin.</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                onClick={() => setSelectedSession(session)}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  selectedSession?.id === session.id
                    ? 'bg-yellow-100 border-yellow-400'
                    : 'bg-white hover:bg-gray-50'
                } border shadow-sm`}
              >
                <p className="font-medium mb-2">
                  {formatDate(session.start_time)}
                </p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {session.emotions.slice(0, 3).map((emotion, index) => (
                    <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded-full">
                      {emotion}
                    </span>
                  ))}
                </div>
                <p className="text-sm text-gray-500">
                  {session.topics.slice(0, 2).join(', ')}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Session Details */}
        <div className="md:col-span-2">
          {selectedSession ? (
            <div className="bg-white rounded-lg border p-6 shadow-sm">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-2">Session Summary</h2>
                <p className="text-gray-500 mb-4">
                  {formatDate(selectedSession.start_time)}
                </p>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Emotions Identified</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.emotions.map((emotion, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {emotion}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Topics Discussed</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedSession.topics.map((topic, index) => (
                      <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="font-semibold mb-2">Session Insights</h3>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap">{selectedSession.summary}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-semibold mb-4">Conversation Log</h3>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {selectedSession.conversation.map((message, index) => (
                      <div
                        key={index}
                        className={`flex ${message[0] === 'human' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            message[0] === 'human'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {message[1]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border border-dashed p-8 flex items-center justify-center">
              <p className="text-gray-500">Select a session to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SessionHistory;
