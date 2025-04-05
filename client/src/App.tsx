import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuickPeek from './pages/QuickPeek';
import DeepDown from './pages/DeepDown';

function App() {
  return (
    <HashRouter>
      <div className="min-h-screen bg-dark text-light relative overflow-hidden">
        {/* Movie posters background with very low opacity */}
        <div className="absolute inset-0 z-0 movie-posters-bg"></div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/quick-peek" element={<QuickPeek />} />
          <Route path="/deep-down" element={<DeepDown />} />
        </Routes>
      </div>
    </HashRouter>
  );
}

export default App; 