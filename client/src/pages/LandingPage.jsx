import React from 'react';
import { Link } from 'react-router-dom';

function LandingPage({ movies }) {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-cine relative z-10">
      <div className="container mx-auto px-4 py-16 text-center max-w-4xl">
        <div className="mb-12">
          <div className="relative w-80 h-80 mx-auto">
            {/* Film reel */}
            <div className="absolute inset-0 rounded-full bg-dark-light border-8 border-primary shadow-glow flex items-center justify-center">
              {/* Inner film reel holes */}
              <div className="absolute top-8 left-8 w-10 h-10 rounded-full bg-dark border-2 border-primary/60"></div>
              <div className="absolute top-8 right-8 w-10 h-10 rounded-full bg-dark border-2 border-primary/60"></div>
              <div className="absolute bottom-8 left-8 w-10 h-10 rounded-full bg-dark border-2 border-primary/60"></div>
              <div className="absolute bottom-8 right-8 w-10 h-10 rounded-full bg-dark border-2 border-primary/60"></div>
              {/* Center sprocket */}
              <div className="w-16 h-16 rounded-full bg-dark-medium border-4 border-primary flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-primary/20 border-2 border-primary/60"></div>
              </div>
            </div>
            
            {/* Popcorn container at bottom */}
            <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 w-48 h-32 bg-primary/90 rounded-b-lg rounded-t-sm border-4 border-dark-light flex items-center justify-center shadow-glow">
              <span className="text-dark text-4xl font-serif font-bold">MOVIE</span>
            </div>
          </div>
          
          <div className="mt-20 mb-8">
            <h2 className="text-2xl text-accent font-medium">RECOMMENDATION APP</h2>
          </div>
        </div>
        
        <h1 className="cinema-title text-5xl mb-6 text-primary">Find Your Perfect Watch</h1>
        <p className="text-xl text-accent mb-12">
          Discover personalized entertainment tailored to your unique taste and mood.
        </p>
        
        {/* Movies from Supabase */}
        {movies && movies.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl text-primary mb-4">Featured Movies</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {movies.map(movie => (
                <div key={movie.id} className="cinema-card p-4">
                  <h3 className="font-serif text-xl font-bold text-primary mb-2">{movie.title}</h3>
                  <p className="text-accent mb-2">Genre: {movie.genre}</p>
                  <p className="text-light">Rating: {movie.rating}/10</p>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-8 mt-12">
          <div className="cinema-card cinema-vignette group">
            <h2 className="font-serif text-2xl font-bold text-primary mb-4">Quick Peek</h2>
            <p className="text-light mb-6">
              Answer six simple questions and get three personalized movie recommendations in under a minute.
            </p>
            <Link 
              to="/quick-peek" 
              className="cinema-button inline-block group-hover:shadow-glow"
            >
              Get Started
            </Link>
          </div>
          
          <div className="cinema-card cinema-vignette group">
            <h2 className="font-serif text-2xl font-bold text-primary mb-4">Deep Down</h2>
            <p className="text-light mb-6">
              Engage in a thoughtful conversation about your preferences and psychological needs for truly tailored recommendations.
            </p>
            <Link 
              to="/deep-down" 
              className="cinema-button inline-block group-hover:shadow-glow"
            >
              Dive Deeper
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="w-full py-6 mt-auto bg-dark-medium text-accent text-center border-t border-primary/20 relative z-10">
        <p className="text-sm">
          Movie Recommender • Powered by Supabase
        </p>
      </footer>
    </div>
  );
}

export default LandingPage; 