import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuickPeek from './pages/QuickPeek';
import DeepDown from './pages/DeepDown';

function App() {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    // Fetch movies from our API
    fetch('/api/movies')
      .then(response => response.json())
      .then(data => {
        console.log('Movies from Supabase:', data);
        setMovies(data);
      })
      .catch(error => console.error('Error fetching movies:', error));
  }, []);

  return (
    <HashRouter>
      <div className="min-h-screen bg-dark text-light relative overflow-hidden">
        {/* Movie posters background with very low opacity */}
        <div className="absolute inset-0 z-0 movie-posters-bg"></div>
        <Routes>
          <Route path="/" element={<LandingPage movies={movies} />} />
          <Route path="/quick-peek" element={<QuickPeek />} />
          <Route path="/deep-down" element={<DeepDown />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App; 