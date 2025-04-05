const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Check if client/public directory exists
const publicDir = path.join(__dirname, 'client', 'public');
const publicExists = fs.existsSync(publicDir);

if (!publicExists) {
  console.error(`ERROR: Directory not found: ${publicDir}`);
  console.log('Creating necessary directories...');
  
  // Create the directory structure if it doesn't exist
  try {
    fs.mkdirSync(path.join(__dirname, 'client', 'public', 'images'), { recursive: true });
    console.log('Created directory structure successfully.');
  } catch (err) {
    console.error('Failed to create directories:', err);
  }
}

// API Routes
app.get('/api/test', (req, res) => {
  res.json({ msg: 'API is working!' });
});

// Quick recommendations API endpoint
app.post('/api/quick-recommendations', (req, res) => {
  const recommendations = [
    {
      id: 299536,
      title: "Avengers: Infinity War",
      poster_path: "/7WsyChQLEftFiDOVTGkv3hFpyyt.jpg",
      overview: "As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows: Thanos.",
      vote_average: 8.3,
      genres: ["Adventure", "Action", "Science Fiction"],
      explanation: "This epic adventure matches your preference for action-packed storytelling."
    },
    {
      id: 27205,
      title: "Inception",
      poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
      overview: "Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: \"inception\".",
      vote_average: 8.4,
      genres: ["Action", "Science Fiction", "Adventure"],
      explanation: "This mind-bending thriller offers both action and deep dialogues that make you think."
    },
    {
      id: 19404,
      title: "Parasite",
      poster_path: "/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg",
      overview: "All unemployed, Ki-taek's family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.",
      vote_average: 8.5,
      genres: ["Comedy", "Thriller", "Drama"],
      explanation: "This critically acclaimed film offers something different and thought-provoking."
    }
  ];
  
  // Simulate processing time
  setTimeout(() => {
    res.json(recommendations);
  }, 1000);
});

// Deep recommendations API endpoint
app.post('/api/deep-recommendations', (req, res) => {
  const recommendations = [
    {
      id: 238,
      title: "The Godfather",
      poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
      overview: "Spanning the years 1945 to 1955, a chronicle of the fictional Italian-American Corleone crime family. When organized crime family patriarch, Vito Corleone barely survives an attempt on his life, his youngest son, Michael steps in to take care of the would-be killers, launching a campaign of bloody revenge.",
      vote_average: 8.7,
      genres: ["Drama", "Crime"],
      explanation: "Given your reflective mood and interest in complex narratives, this classic should resonate deeply with you."
    },
    {
      id: 1396,
      title: "Breaking Bad",
      poster_path: "/ggFHVNu6YYI5L9pCfOacjizRGt.jpg",
      overview: "When Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of only two years left to live. He becomes filled with a sense of fearlessness and an unrelenting desire to secure his family's financial future at any cost as he enters the dangerous world of drugs and crime.",
      vote_average: 8.6,
      genres: ["Drama", "Crime"],
      explanation: "This series aligns with your need for intellectual stimulation and complex narratives."
    },
    {
      id: 569094,
      title: "Spider-Man: Across the Spider-Verse",
      poster_path: "/8Vt6mWEReuy4Of61Lnj5Xj704m8.jpg",
      overview: "After reuniting with Gwen Stacy, Brooklyn's full-time, friendly neighborhood Spider-Man is catapulted across the Multiverse, where he encounters the Spider Society, a team of Spider-People charged with protecting the Multiverse's very existence.",
      vote_average: 8.4,
      genres: ["Animation", "Action", "Adventure", "Science Fiction"],
      explanation: "This visually stunning film offers the perfect balance of excitement and emotional depth."
    }
  ];
  
  // Simulate processing time
  setTimeout(() => {
    res.json(recommendations);
  }, 1500);
});

// Quick Peek page
app.get('/quick-peek', (req, res) => {
  res.send(generateHTML('quick-peek'));
});

// Deep Down page
app.get('/deep-down', (req, res) => {
  res.send(generateHTML('deep-down'));
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'client', 'public')));

// Serve the main app for any other route
app.get('*', (req, res) => {
  res.send(generateHTML('home'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Open your browser and navigate to http://localhost:${PORT}`);
});

// HTML Generator Function
function generateHTML(page) {
  // Common header
  let html = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#1A1A1A" />
    <meta name="description" content="Premium Movie Recommendation App" />
    <title>Premium Movie Recommender</title>
    <style>
      :root {
        --primary: #8b0000;
        --accent: #D4AF37;
        --text: #f8fafc;
        --dark: #1A1A1A;
        --dark-medium: #222222;
      }
      
      * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }
      
      body {
        margin: 0;
        padding: 0;
        background-color: var(--dark);
        background-image: 
          linear-gradient(
            rgba(0, 0, 0, 0.8),
            rgba(0, 0, 0, 0.8)
          ),
          url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxQTFBMUEiLz48L3N2Zz4=');
        color: var(--text);
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
          Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        min-height: 100vh;
      }
      
      header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 2rem;
        background-color: rgba(0, 0, 0, 0.5);
        border-bottom: 1px solid rgba(139, 0, 0, 0.3);
      }
      
      .logo {
        display: flex;
        align-items: center;
        text-decoration: none;
      }
      
      .logo-icon {
        margin-right: 0.5rem;
        display: inline-block;
        animation: spin3D 5s linear infinite;
      }
      
      @keyframes spin3D {
        0% { transform: rotateY(0deg); }
        100% { transform: rotateY(360deg); }
      }
      
      .logo-text {
        color: var(--primary);
        font-size: 1.5rem;
        font-weight: bold;
      }
      
      nav a {
        color: var(--text);
        text-decoration: none;
        margin-left: 1.5rem;
        transition: color 0.3s ease;
      }
      
      nav a:hover {
        color: var(--accent);
      }
      
      main {
        max-width: 1200px;
        margin: 0 auto;
        padding: 2rem;
        text-align: center;
      }
      
      h1 {
        font-size: 3rem;
        color: var(--primary);
        margin: 2rem 0;
      }
      
      p.subtitle {
        font-size: 1.2rem;
        color: var(--text);
        margin-bottom: 3rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }
      
      .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 2rem;
        margin-top: 3rem;
      }
      
      .card {
        background-color: var(--dark-medium);
        border-radius: 8px;
        padding: 2rem;
        text-align: center;
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        border: 1px solid rgba(139, 0, 0, 0.2);
      }
      
      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 20px rgba(0, 0, 0, 0.3);
      }
      
      .card h2 {
        color: var(--primary);
        font-size: 1.8rem;
        margin-bottom: 1rem;
      }
      
      .card p {
        margin-bottom: 1.5rem;
        color: var(--text);
      }
      
      .btn {
        display: inline-block;
        padding: 10px 20px;
        background-color: var(--primary);
        color: var(--text);
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-decoration: none;
        transition: background-color 0.3s ease;
      }
      
      .btn:hover {
        background-color: #6b0000;
      }
      
      footer {
        text-align: center;
        padding: 1rem;
        background-color: rgba(0, 0, 0, 0.5);
        color: var(--text);
        margin-top: auto;
        border-top: 1px solid rgba(139, 0, 0, 0.3);
        position: relative;
        bottom: 0;
        width: 100%;
      }
      
      /* Form styles */
      .form-container {
        max-width: 600px;
        margin: 0 auto;
        background-color: var(--dark-medium);
        padding: 2rem;
        border-radius: 8px;
        border: 1px solid rgba(139, 0, 0, 0.2);
      }
      
      .form-group {
        margin-bottom: 1.5rem;
        text-align: left;
      }
      
      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        color: var(--accent);
      }
      
      .form-group select,
      .form-group input,
      .form-group textarea {
        width: 100%;
        padding: 0.8rem;
        background-color: #333;
        border: 1px solid #444;
        border-radius: 4px;
        color: var(--text);
      }
      
      /* Recommendation cards */
      .recommendation {
        background-color: var(--dark-medium);
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 2rem;
        border: 1px solid rgba(139, 0, 0, 0.2);
        display: flex;
        flex-direction: column;
      }
      
      @media (min-width: 768px) {
        .recommendation {
          flex-direction: row;
        }
      }
      
      .recommendation-image {
        flex: 0 0 200px;
        background-color: #333;
      }
      
      .recommendation-image img {
        width: 100%;
        height: auto;
      }
      
      .recommendation-content {
        padding: 1.5rem;
        flex: 1;
        text-align: left;
      }
      
      .recommendation-title {
        color: var(--primary);
        margin-bottom: 0.5rem;
      }
      
      .recommendation-genres {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }
      
      .genre-tag {
        background-color: rgba(139, 0, 0, 0.3);
        padding: 0.3rem 0.6rem;
        border-radius: 4px;
        font-size: 0.8rem;
      }
      
      .recommendation-rating {
        color: var(--accent);
        margin-bottom: 1rem;
      }
      
      .recommendation-explanation {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid rgba(255, 255, 255, 0.1);
      }
      
      /* Loading state */
      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 200px;
      }
      
      .loading-spinner {
        border: 4px solid rgba(255, 255, 255, 0.1);
        border-radius: 50%;
        border-top: 4px solid var(--primary);
        width: 40px;
        height: 40px;
        animation: spin 1s linear infinite;
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      /* Movie background pattern */
      .movie-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMxQTFBMUEiLz48L3N2Zz4=');
        z-index: -1;
        opacity: 0.2;
      }
    </style>
  </head>
  <body>
    <div class="movie-bg"></div>
    <header>
      <a href="/" class="logo">
        <svg class="logo-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--primary)">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 5c0 .55-.45 1-1 1s-1-.45-1-1 .45-1 1-1 1 .45 1 1zm-8 0c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm-2-3c0-.55.45-1 1-1s1 .45 1 1-.45 1-1 1-1-.45-1-1zm5 7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/>
        </svg>
        <span class="logo-text">Premium Movie Recommender</span>
      </a>
      <nav>
        <a href="/quick-peek">Quick Peek</a>
        <a href="/deep-down">Deep Down</a>
      </nav>
    </header>
  `;

  // Page-specific content
  if (page === 'home') {
    html += `
    <main>
      <h1>Find Your Perfect Watch</h1>
      <p class="subtitle">Discover personalized entertainment tailored to your unique taste and mood.</p>
      
      <div class="grid-container">
        <div class="card">
          <h2>Quick Peek</h2>
          <p>Answer six simple questions and get three personalized movie recommendations in under a minute.</p>
          <a href="/quick-peek" class="btn">Get Started</a>
        </div>
        
        <div class="card">
          <h2>Deep Down</h2>
          <p>Engage in a thoughtful conversation about your preferences and psychological needs for truly tailored recommendations.</p>
          <a href="/deep-down" class="btn">Dive Deeper</a>
        </div>
      </div>
    </main>
    `;
  } else if (page === 'quick-peek') {
    html += `
    <main>
      <h1>Quick Peek</h1>
      <p class="subtitle">Answer a few quick questions to get personalized recommendations in under a minute.</p>
      
      <div class="form-container">
        <div class="form-group">
          <label for="genre">What genre are you in the mood for?</label>
          <select id="genre" name="genre">
            <option value="action">Action</option>
            <option value="comedy">Comedy</option>
            <option value="drama">Drama</option>
            <option value="sci-fi">Science Fiction</option>
            <option value="horror">Horror</option>
            <option value="romance">Romance</option>
            <option value="thriller">Thriller</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="decade">Do you prefer newer or older films?</label>
          <select id="decade" name="decade">
            <option value="new">Recent releases (last 5 years)</option>
            <option value="2010s">2010s</option>
            <option value="2000s">2000s</option>
            <option value="1990s">1990s</option>
            <option value="1980s">1980s</option>
            <option value="classic">Classic films (before 1980)</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="mood">What mood are you in?</label>
          <select id="mood" name="mood">
            <option value="uplifting">Uplifting/Happy</option>
            <option value="thoughtful">Thoughtful/Reflective</option>
            <option value="excited">Excited/Thrilled</option>
            <option value="relaxed">Relaxed/Calm</option>
            <option value="dark">Dark/Intense</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="length">How much time do you have?</label>
          <select id="length" name="length">
            <option value="short">Less than 90 minutes</option>
            <option value="medium">90-120 minutes</option>
            <option value="long">Over 2 hours</option>
            <option value="series">I want to start a series</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="popular">Mainstream popularity level?</label>
          <select id="popular" name="popular">
            <option value="blockbuster">Blockbusters/Well-known</option>
            <option value="mid">Moderately popular</option>
            <option value="indie">Independent/Lesser-known</option>
            <option value="cult">Cult classics</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="rewatch">Have you been watching a lot of movies lately?</label>
          <select id="rewatch" name="rewatch">
            <option value="yes">Yes, I need something fresh</option>
            <option value="no">No, I'm open to classics I might have missed</option>
          </select>
        </div>
        
        <button id="get-recommendations" class="btn" onclick="showRecommendations()">Get Recommendations</button>
      </div>
      
      <div id="recommendations-container" style="display: none; margin-top: 3rem;">
        <h2 style="margin-bottom: 2rem;">Your Personalized Recommendations</h2>
        <div id="recommendations-list"></div>
      </div>
      
      <div id="loading" class="loading" style="display: none;">
        <div class="loading-spinner"></div>
      </div>
    </main>
    
    <script>
      function showRecommendations() {
        // Show loading indicator
        document.getElementById('loading').style.display = 'flex';
        document.getElementById('recommendations-container').style.display = 'none';
        
        // Collect form data
        const genre = document.getElementById('genre').value;
        const decade = document.getElementById('decade').value;
        const mood = document.getElementById('mood').value;
        const length = document.getElementById('length').value;
        const popular = document.getElementById('popular').value;
        const rewatch = document.getElementById('rewatch').value;
        
        // Send request to API
        fetch('/api/quick-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ answers: { genre, decade, mood, length, popular, rewatch } }),
        })
        .then(response => response.json())
        .then(data => {
          // Hide loading indicator
          document.getElementById('loading').style.display = 'none';
          
          // Show recommendations
          const container = document.getElementById('recommendations-container');
          container.style.display = 'block';
          
          const list = document.getElementById('recommendations-list');
          list.innerHTML = '';
          
          data.forEach(movie => {
            const movieElement = document.createElement('div');
            movieElement.className = 'recommendation';
            
            const genres = movie.genres.map(genre => 
              \`<span class="genre-tag">\${genre}</span>\`
            ).join('');
            
            movieElement.innerHTML = \`
              <div class="recommendation-image">
                <img src="https://image.tmdb.org/t/p/w200\${movie.poster_path}" alt="\${movie.title}">
              </div>
              <div class="recommendation-content">
                <h3 class="recommendation-title">\${movie.title}</h3>
                <div class="recommendation-genres">\${genres}</div>
                <div class="recommendation-rating">★ \${movie.vote_average}/10</div>
                <p>\${movie.overview}</p>
                <div class="recommendation-explanation">
                  <strong>Why we think you'll like it:</strong> \${movie.explanation}
                </div>
              </div>
            \`;
            
            list.appendChild(movieElement);
          });
        })
        .catch(error => {
          console.error('Error:', error);
          document.getElementById('loading').style.display = 'none';
        });
      }
    </script>
    `;
  } else if (page === 'deep-down') {
    html += `
    <main>
      <h1>Deep Down</h1>
      <p class="subtitle">Engage in a conversation about your preferences and psychological needs for truly tailored recommendations.</p>
      
      <div class="form-container">
        <div class="form-group">
          <label for="current-mood">How would you describe your current mood or emotional state?</label>
          <textarea id="current-mood" name="current-mood" rows="3" placeholder="I'm feeling..."></textarea>
        </div>
        
        <div class="form-group">
          <label for="life-situation">Are you going through any particular life situation or transition right now?</label>
          <textarea id="life-situation" name="life-situation" rows="3" placeholder="Currently I'm..."></textarea>
        </div>
        
        <div class="form-group">
          <label for="media-purpose">What do you hope to get from watching a show or movie right now?</label>
          <select id="media-purpose" name="media-purpose">
            <option value="escape">Escape from reality</option>
            <option value="comfort">Comfort and reassurance</option>
            <option value="stimulation">Intellectual stimulation</option>
            <option value="inspiration">Inspiration and motivation</option>
            <option value="connection">Emotional connection</option>
            <option value="growth">Personal growth</option>
          </select>
        </div>
        
        <div class="form-group">
          <label for="themes">Which themes resonate with you currently?</label>
          <select id="themes" name="themes" multiple>
            <option value="redemption">Redemption</option>
            <option value="transformation">Transformation</option>
            <option value="identity">Identity</option>
            <option value="relationships">Relationships</option>
            <option value="loss">Loss and grief</option>
            <option value="achievement">Achievement</option>
            <option value="justice">Justice</option>
            <option value="survival">Survival</option>
          </select>
          <small style="display: block; margin-top: 0.5rem; color: #aaa;">Hold Ctrl (or Cmd) to select multiple options</small>
        </div>
        
        <div class="form-group">
          <label for="favorite-film">Name a film or show that deeply moved you, and briefly explain why:</label>
          <textarea id="favorite-film" name="favorite-film" rows="3" placeholder="I loved..."></textarea>
        </div>
        
        <div class="form-group">
          <label for="depth-level">How deep or challenging do you want these recommendations to be?</label>
          <select id="depth-level" name="depth-level">
            <option value="light">Light and accessible</option>
            <option value="moderate">Moderately challenging</option>
            <option value="deep">Deep and thought-provoking</option>
            <option value="intense">Intensely challenging</option>
          </select>
        </div>
        
        <button id="get-deep-recommendations" class="btn" onclick="showDeepRecommendations()">Get Deep Recommendations</button>
      </div>
      
      <div id="recommendations-container" style="display: none; margin-top: 3rem;">
        <h2 style="margin-bottom: 2rem;">Your Deeply Personalized Recommendations</h2>
        <div id="recommendations-list"></div>
      </div>
      
      <div id="loading" class="loading" style="display: none;">
        <div class="loading-spinner"></div>
      </div>
    </main>
    
    <script>
      function showDeepRecommendations() {
        // Show loading indicator
        document.getElementById('loading').style.display = 'flex';
        document.getElementById('recommendations-container').style.display = 'none';
        
        // Collect form data
        const currentMood = document.getElementById('current-mood').value;
        const lifeSituation = document.getElementById('life-situation').value;
        const mediaPurpose = document.getElementById('media-purpose').value;
        
        // Get selected themes
        const themesSelect = document.getElementById('themes');
        const selectedThemes = Array.from(themesSelect.selectedOptions).map(option => option.value);
        
        const favoriteFilm = document.getElementById('favorite-film').value;
        const depthLevel = document.getElementById('depth-level').value;
        
        // Send request to API
        fetch('/api/deep-recommendations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            responses: {
              currentMood,
              lifeSituation,
              mediaPurpose,
              themes: selectedThemes,
              favoriteFilm,
              depthLevel
            }
          }),
        })
        .then(response => response.json())
        .then(data => {
          // Hide loading indicator
          document.getElementById('loading').style.display = 'none';
          
          // Show recommendations
          const container = document.getElementById('recommendations-container');
          container.style.display = 'block';
          
          const list = document.getElementById('recommendations-list');
          list.innerHTML = '';
          
          data.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'recommendation';
            
            const genres = item.genres.map(genre => 
              \`<span class="genre-tag">\${genre}</span>\`
            ).join('');
            
            const type = item.type === 'series' ? 'TV Series' : 'Movie';
            
            itemElement.innerHTML = \`
              <div class="recommendation-image">
                <img src="https://image.tmdb.org/t/p/w200\${item.poster_path}" alt="\${item.title}">
              </div>
              <div class="recommendation-content">
                <h3 class="recommendation-title">\${item.title} <small>(\${type})</small></h3>
                <div class="recommendation-genres">\${genres}</div>
                <div class="recommendation-rating">★ \${item.vote_average}/10</div>
                <p>\${item.overview}</p>
                <div class="recommendation-explanation">
                  <strong>Why this resonates with your current state:</strong> \${item.explanation}
                </div>
              </div>
            \`;
            
            list.appendChild(itemElement);
          });
        })
        .catch(error => {
          console.error('Error:', error);
          document.getElementById('loading').style.display = 'none';
        });
      }
    </script>
    `;
  }

  // Footer
  html += `
    <footer>
      <p>Premium Movie Recommender • All rights reserved</p>
    </footer>
  </body>
  </html>
  `;

  return html;
} 