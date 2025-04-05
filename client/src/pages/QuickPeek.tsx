import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Define question types
type Question = {
  id: number;
  text: string;
  options: string[];
};

// Define movie recommendation type
type MovieRecommendation = {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  vote_average: number;
  genres: string[];
  explanation: string;
};

const QuickPeek: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<MovieRecommendation[]>([]);
  const [error, setError] = useState<string>('');

  // Define the 6 quick questions
  const questions: Question[] = [
    {
      id: 1,
      text: "How do you want to feel after watching the movie?",
      options: ["Happy", "Inspired", "Thoughtful", "Thrilled", "Relaxed"]
    },
    {
      id: 2,
      text: "What kind of story interests you?",
      options: ["Adventure", "Romance", "Mystery", "Drama", "Comedy"]
    },
    {
      id: 3,
      text: "Do you prefer action-packed or dialogue-driven movies?",
      options: ["Action-packed", "Dialogue-driven", "A balance of both", "More action than dialogue", "More dialogue than action"]
    },
    {
      id: 4,
      text: "Are you in the mood for something familiar or different?",
      options: ["Something familiar", "Something new and different", "A fresh take on a familiar theme", "A classic", "An indie or foreign film"]
    },
    {
      id: 5,
      text: "Do you want a critically acclaimed movie or a hidden gem?",
      options: ["Critically acclaimed", "Hidden gem", "Popular but not necessarily acclaimed", "Award-winning", "Cult classic"]
    },
    {
      id: 6,
      text: "Any content preferences or restrictions?",
      options: ["No violence", "No explicit content", "Family-friendly", "Dark themes are fine", "No restrictions"]
    }
  ];

  // Handle answer selection
  const handleSelectAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);
    
    if (currentQuestion < 5) {
      // Move to next question
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Submit answers and get recommendations
      fetchRecommendations(newAnswers);
    }
  };

  // Fetch movie recommendations based on answers
  const fetchRecommendations = async (userAnswers: string[]) => {
    setIsLoading(true);
    setError('');
    
    try {
      // Replace with your actual backend API endpoint
      const response = await axios.post('/api/recommend/quick', { answers: userAnswers });
      setRecommendations(response.data);
    } catch (err) {
      setError('Sorry, we couldn\'t find recommendations at this time. Please try again later.');
      console.error('Error fetching recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Reset the quiz
  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setRecommendations([]);
  };

  // Mock data for development (remove in production)
  React.useEffect(() => {
    // For development only - mock data
    if (import.meta.env?.DEV && answers.length === 6 && recommendations.length === 0 && !isLoading) {
      setRecommendations([
        {
          id: 299536,
          title: "Avengers: Infinity War",
          poster_path: "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
          overview: "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.",
          vote_average: 8.3,
          genres: ["Adventure", "Action", "Science Fiction"],
          explanation: "This epic adventure matches your preference for action-packed storytelling, while the balance of humor and drama will leave you feeling thrilled as requested."
        },
        {
          id: 27205,
          title: "Inception",
          poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
          overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\".",
          vote_average: 8.4,
          genres: ["Action", "Science Fiction", "Adventure"],
          explanation: "This mind-bending thriller offers both action and deep dialogues that make you think, aligning with your desire for a thoughtful experience with balance."
        },
        {
          id: 19404,
          title: "Parasite",
          poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
          overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
          vote_average: 8.5,
          genres: ["Comedy", "Thriller", "Drama"],
          explanation: "This critically acclaimed film offers something different and thought-provoking, with the perfect mix of dark themes and social commentary you indicated you'd enjoy."
        }
      ]);
    }
  }, [answers, recommendations, isLoading]);

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
            <h1 className="cinema-title text-3xl mb-8 text-center text-primary">Your Movie Recommendations</h1>
            <div className="grid md:grid-cols-3 gap-8">
              {recommendations.map(movie => (
                <div key={movie.id} className="cinema-card cinema-vignette group transition-transform hover:-translate-y-2">
                  <div className="h-64 overflow-hidden rounded-t-lg mb-4 relative">
                    <img 
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-40"></div>
                  </div>
                  <div className="p-4">
                    <h2 className="font-serif text-xl font-bold mb-2 text-primary">{movie.title}</h2>
                    <div className="flex items-center mb-2">
                      <span className="bg-primary text-dark text-sm font-medium px-2 py-1 rounded-md mr-2">
                        {movie.vote_average.toFixed(1)}
                      </span>
                      <span className="text-sm text-accent">
                        {movie.genres.join(', ')}
                      </span>
                    </div>
                    <p className="text-light text-sm mb-4 line-clamp-3">
                      {movie.overview}
                    </p>
                    <div className="border-t border-accent/10 pt-3 mt-2">
                      <button className="text-xs text-primary hover:text-primary/80 transition-colors font-medium cursor-pointer flex items-center gap-1" 
                              onClick={() => alert(movie.explanation)}>
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
                onClick={resetQuiz}
                className="cinema-button"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          // Show questions
          <div className="max-w-2xl mx-auto">
            <h1 className="cinema-title text-3xl mb-8 text-center text-primary">Quick Peek</h1>
            {!isLoading ? (
              <div className="cinema-card">
                <div className="mb-4 text-sm font-medium text-accent">
                  Question {currentQuestion + 1} of 6
                </div>
                <h2 className="text-xl font-bold mb-6 text-light">
                  {questions[currentQuestion].text}
                </h2>
                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSelectAnswer(option)}
                      className={`w-full text-left px-4 py-3 rounded-lg border transition-all ${
                        answers[currentQuestion] === option
                          ? 'bg-primary text-dark border-primary shadow-glow'
                          : 'bg-dark-light text-light border-accent/10 hover:border-primary/50 hover:shadow-glow/30'
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
                <p className="mt-4 text-accent">Finding the perfect movies for you...</p>
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

export default QuickPeek; 