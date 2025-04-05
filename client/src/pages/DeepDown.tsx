import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Define conversation types
type Message = {
  id: string;
  text: string;
  sender: 'user' | 'system';
  options?: string[];
};

// Define content recommendation type
type ContentRecommendation = {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  genres: string[];
  type: 'movie' | 'series' | 'show' | 'theory';
  explanation: string;
};

const DeepDown: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [userResponses, setUserResponses] = useState<Record<string, string>>({});
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<ContentRecommendation[]>([]);
  const [error, setError] = useState<string>('');
  const [conversationComplete, setConversationComplete] = useState<boolean>(false);

  // Initialize the conversation when component mounts
  useEffect(() => {
    startConversation();
  }, []);

  // Scroll to bottom of messages when messages change
  useEffect(() => {
    const messagesContainer = document.getElementById('messages-container');
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
  }, [messages]);

  // Start the conversation with an initial message
  const startConversation = () => {
    const initialMessage: Message = {
      id: 'welcome',
      text: "Hi there! I'm your personal entertainment guide. I'd like to understand your preferences better to recommend content that truly resonates with you. Let's start with how you're feeling today?",
      sender: 'system',
      options: ["Relaxed", "Excited", "Reflective", "Bored", "Stressed"]
    };
    setMessages([initialMessage]);
  };

  const handleSelectOption = (messageId: string, option: string) => {
    // Save user's response
    setUserResponses(prev => ({
      ...prev,
      [messageId]: option
    }));
    
    // Add user response to chat
    setMessages(prev => [
      ...prev,
      {
        id: `user-${messageId}`,
        text: option,
        sender: 'user'
      }
    ]);
    
    // Show typing indicator
    setIsTyping(true);
    
    // Get next message based on user's selection
    setTimeout(() => {
      const nextMessage = getNextMessage(messageId, option);
      setIsTyping(false);
      
      if (nextMessage) {
        setMessages(prev => [...prev, nextMessage]);
      } else if (!conversationComplete) {
        // If no more messages, show final message and fetch recommendations
        setMessages(prev => [
          ...prev,
          {
            id: 'final',
            text: "Thank you for sharing your thoughts with me. Based on our conversation, I'll now suggest some entertainment options tailored just for you.",
            sender: 'system'
          }
        ]);
        setConversationComplete(true);
        fetchRecommendations();
      }
    }, 1000);
  };

  const getNextMessage = (currentMessageId: string, selectedOption: string): Message | null => {
    // Logic for next message based on user's selection
    switch(currentMessageId) {
      case 'welcome':
        return {
          id: 'content-type',
          text: `I see you're feeling ${selectedOption.toLowerCase()}. What kind of content are you in the mood for?`,
          sender: 'system',
          options: ["Movies", "TV Shows", "Both", "Something Different"]
        };
      // ... other cases
      default:
        return null;
    }
  };

  const fetchRecommendations = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      // Call the API with user responses
      const response = await axios.post('/api/recommend/deep', { responses: userResponses });
      setRecommendations(response.data);
    } catch (err) {
      setError('Sorry, we couldn\'t find recommendations at this time. Please try again later.');
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the conversation
  const resetConversation = () => {
    setMessages([]);
    setUserResponses({});
    setRecommendations([]);
    setConversationComplete(false);
    startConversation();
  };

  return (
    <div className="min-h-screen bg-gradient-cine flex flex-col">
      <header className="bg-dark-medium border-b border-primary/20 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <Link to="/" className="font-serif text-2xl font-bold text-primary">
            Movie Recommender
          </Link>
          <div>
            <Link 
              to="/" 
              className="text-accent hover:text-primary transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {recommendations.length > 0 ? (
          // Show recommendations
          <div className="mb-8">
            <h1 className="cinema-title text-3xl mb-8 text-center text-primary">Your Personalized Recommendations</h1>
            <div className="grid md:grid-cols-3 gap-8">
              {recommendations.map(item => (
                <div key={item.id} className="cinema-card cinema-vignette group transition-transform hover:-translate-y-2">
                  <div className="h-64 overflow-hidden rounded-t-lg mb-4 relative">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${item.poster_path}`} 
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-40"></div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="font-serif text-xl font-bold text-primary">{item.title}</h2>
                      <span className="bg-primary text-dark text-sm font-medium px-2 py-1 rounded-md">
                        {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="text-xs uppercase text-primary font-medium mr-2">
                        {item.type}
                      </span>
                      <span className="text-sm text-accent">
                        {item.genres.join(', ')}
                      </span>
                    </div>
                    <p className="text-light text-sm mb-4 line-clamp-3">
                      {item.overview}
                    </p>
                    <div className="border-t border-accent/10 pt-3 mt-2">
                      <button className="text-xs text-primary hover:text-primary/80 transition-colors font-medium cursor-pointer flex items-center gap-1" 
                              onClick={() => alert(item.explanation)}>
                        <span>WHY THIS?</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <button
                onClick={resetConversation}
                className="cinema-button"
              >
                Start Again
              </button>
            </div>
          </div>
        ) : (
          // Show conversation
          <div className="max-w-3xl mx-auto">
            <h1 className="cinema-title text-3xl mb-8 text-center text-primary">Deep Down</h1>
            
            <div id="messages-container" className="bg-dark-medium rounded-lg shadow-cinema p-4 h-96 overflow-y-auto mb-4 border border-accent/10">
              {messages.map((message, index) => (
                <div 
                  key={index}
                  className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}
                >
                  <div 
                    className={`inline-block rounded-lg p-3 max-w-md ${
                      message.sender === 'user' 
                        ? 'bg-primary text-dark'
                        : 'bg-dark-light text-light'
                    }`}
                  >
                    <p>{message.text}</p>
                    
                    {message.options && (
                      <div className="mt-3 space-y-2">
                        {message.options.map((option, optIndex) => (
                          <button
                            key={optIndex}
                            onClick={() => handleSelectOption(message.id, option)}
                            className="block w-full text-left px-3 py-2 rounded bg-dark text-light hover:bg-dark/70 transition-colors border border-accent/10"
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="mb-4">
                  <div className="inline-block bg-dark-light rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {!messages.length && !isTyping && (
                <div className="text-center py-12 text-gray-400">
                  Starting conversation...
                </div>
              )}
            </div>
            
            {isLoading && (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-accent">Finding personalized recommendations...</p>
              </div>
            )}
            
            {error && (
              <div className="mt-4 p-4 bg-secondary/20 text-primary rounded-lg border border-secondary">
                {error}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default DeepDown; 