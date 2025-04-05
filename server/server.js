const express = require('express');
const cors = require('cors');
const axios = require('axios');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const TMDB_API_KEY = process.env.TMDB_API_KEY || 'YOUR_TMDB_API_KEY'; // Replace with your actual API key for production

// Middleware
app.use(cors());
app.use(express.json());

// TMDB API base URL
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Helper function to get movie details from TMDB
 * @param {number} movieId - The TMDB movie ID
 * @returns {Promise<Object>} - Movie details
 */
async function getMovieDetails(movieId) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US'
      }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching movie details for ID ${movieId}:`, error.message);
    return null;
  }
}

/**
 * Searches for movies based on given parameters
 * @param {Object} params - Search parameters
 * @returns {Promise<Array>} - List of movies
 */
async function searchMovies(params) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        language: 'en-US',
        sort_by: 'popularity.desc',
        include_adult: false,
        ...params
      }
    });
    return response.data.results;
  } catch (error) {
    console.error('Error searching movies:', error.message);
    return [];
  }
}

/**
 * Maps user answers from Quick Peek to TMDB API parameters
 * @param {Array} answers - User's answers to the quick peek questions
 * @returns {Object} - TMDB API parameters
 */
function mapQuickAnswersToParams(answers) {
  // Example mapping logic - customize based on your questions and TMDB API
  const params = {};
  
  // How do you want to feel?
  if (answers[0]) {
    switch (answers[0].toLowerCase()) {
      case 'happy':
      case 'relaxed':
        params.with_genres = '35,10749'; // Comedy, Romance
        break;
      case 'inspired':
        params.with_genres = '18,36'; // Drama, History
        break;
      case 'thoughtful':
        params.with_genres = '18,99'; // Drama, Documentary
        break;
      case 'thrilled':
        params.with_genres = '28,53,27'; // Action, Thriller, Horror
        break;
    }
  }
  
  // What kind of story?
  if (answers[1]) {
    const genreMap = {
      'adventure': '12',
      'romance': '10749',
      'mystery': '9648',
      'drama': '18',
      'comedy': '35'
    };
    
    const genre = answers[1].toLowerCase();
    if (genreMap[genre]) {
      params.with_genres = params.with_genres 
        ? `${params.with_genres},${genreMap[genre]}` 
        : genreMap[genre];
    }
  }
  
  // Action or dialogue driven?
  if (answers[2]) {
    if (answers[2].toLowerCase().includes('action')) {
      params.with_genres = params.with_genres 
        ? `${params.with_genres},28` // Action
        : '28';
    }
  }
  
  // Familiar or different?
  if (answers[3]) {
    if (answers[3].toLowerCase().includes('familiar')) {
      params.sort_by = 'popularity.desc';
    } else if (answers[3].toLowerCase().includes('different') || 
               answers[3].toLowerCase().includes('indie')) {
      params.sort_by = 'vote_count.asc';
      params.vote_count_gte = 100; // Ensure some quality threshold
    }
  }
  
  // Critically acclaimed or hidden gem?
  if (answers[4]) {
    if (answers[4].toLowerCase().includes('acclaimed') || 
        answers[4].toLowerCase().includes('award')) {
      params.vote_average_gte = 7.5;
      params.sort_by = 'vote_average.desc';
    } else if (answers[4].toLowerCase().includes('hidden') || 
               answers[4].toLowerCase().includes('gem')) {
      params.vote_count_lte = 1000;
      params.vote_average_gte = 6.5;
    }
  }
  
  // Content restrictions
  if (answers[5]) {
    if (answers[5].toLowerCase().includes('no violence')) {
      params.without_genres = '28,27,53'; // Exclude Action, Horror, Thriller
    } else if (answers[5].toLowerCase().includes('family-friendly')) {
      params.certification_country = 'US';
      params.certification = 'G|PG';
    }
  }
  
  return params;
}

/**
 * Generates an explanation for why a movie was recommended based on user answers
 * @param {Object} movie - Movie details
 * @param {Array} answers - User's answers
 * @returns {string} - Personalized explanation
 */
function generateExplanation(movie, answers) {
  // This is a simplified version - in production this would be more sophisticated
  const genreNames = movie.genres.map(g => g.name);
  const genreString = genreNames.join(', ');
  
  let explanation = `This ${genreString} film was selected because `;
  
  // How you want to feel
  if (answers[0]) {
    const feelingMap = {
      'happy': 'its uplifting story will leave you feeling joyful',
      'inspired': 'it contains inspiring themes that can motivate you',
      'thoughtful': 'it offers deep themes that will make you reflect',
      'thrilled': 'its exciting narrative will keep you on the edge of your seat',
      'relaxed': 'its gentle pacing and tone can help you unwind'
    };
    
    const key = Object.keys(feelingMap).find(k => answers[0].toLowerCase().includes(k));
    if (key) {
      explanation += feelingMap[key];
    }
  } else {
    explanation += `it matches your genre preferences (${genreString})`;
  }
  
  // Action vs dialogue
  if (answers[2] && answers[2].toLowerCase().includes('action')) {
    explanation += ' and delivers the action-packed experience you requested';
  } else if (answers[2] && answers[2].toLowerCase().includes('dialogue')) {
    explanation += ' and features the rich dialogue you enjoy';
  }
  
  // Critically acclaimed
  if (answers[4] && answers[4].toLowerCase().includes('acclaimed') && movie.vote_average > 7.5) {
    explanation += `. With a strong rating of ${movie.vote_average.toFixed(1)}, it's well-received by critics and audiences`;
  }
  
  // Hidden gem
  if (answers[4] && answers[4].toLowerCase().includes('hidden') && movie.vote_count < 1000) {
    explanation += '. It\'s a hidden gem that hasn\'t received mainstream attention yet';
  }
  
  return explanation + '.';
}

/**
 * Maps Deep Down conversation responses to content parameters
 * @param {Object} responses - User's responses in the conversation
 * @returns {Object} - Parameters for content search
 */
function mapDeepDownResponsesToParams(responses) {
  const params = {};
  
  // Current feeling
  if (responses.welcome) {
    const feeling = responses.welcome.toLowerCase();
    if (feeling.includes('great') || feeling.includes('energetic')) {
      params.with_genres = '28,12,35'; // Action, Adventure, Comedy
    } else if (feeling.includes('relaxed') || feeling.includes('calm')) {
      params.with_genres = '18,10749'; // Drama, Romance
    } else if (feeling.includes('down') || feeling.includes('stressed')) {
      params.with_genres = '35,10751'; // Comedy, Family
    } else if (feeling.includes('bored')) {
      params.with_genres = '28,12,14'; // Action, Adventure, Fantasy
    } else if (feeling.includes('reflective') || feeling.includes('introspective')) {
      params.with_genres = '18,99'; // Drama, Documentary
    }
  }
  
  // Content type preference
  if (responses['content-type']) {
    const contentType = responses['content-type'].toLowerCase();
    params.media_type = contentType.includes('movies') 
      ? 'movie' 
      : contentType.includes('series') ? 'tv' : 'all';
  }
  
  // Life situation
  if (responses['life-situation']) {
    const situation = responses['life-situation'].toLowerCase();
    if (situation.includes('change')) {
      params.keywords = '818,9715'; // transformation, change
    } else if (situation.includes('inspiration')) {
      params.keywords = '161527,161664'; // inspiration, motivational
    } else if (situation.includes('celebrating')) {
      params.keywords = '8866,183'; // celebration, joy
    } else if (situation.includes('escape')) {
      params.keywords = '4344,9663'; // fantasy, escapism
    } else if (situation.includes('learn')) {
      params.vote_average_gte = 7.0; // Quality threshold for educational content
    }
  }
  
  // Emotional need
  if (responses['emotional-need']) {
    const need = responses['emotional-need'].toLowerCase();
    if (need.includes('comfort')) {
      params.with_genres = '10751,35,18'; // Family, Comedy, Drama
    } else if (need.includes('motivation')) {
      params.with_genres = '18,36'; // Drama, History
    } else if (need.includes('laugh')) {
      params.with_genres = '35'; // Comedy
    } else if (need.includes('intellectual')) {
      params.with_genres = '99,878,9648'; // Documentary, Science Fiction, Mystery
    } else if (need.includes('cathartic')) {
      params.with_genres = '18,10752'; // Drama, War
    }
  }
  
  // Themes
  if (responses.themes) {
    const theme = responses.themes.toLowerCase();
    if (theme.includes('growth')) {
      params.keywords = '818,187686'; // transformation, personal-growth
    } else if (theme.includes('relationships')) {
      params.keywords = '9823,6054'; // relationship, family
    } else if (theme.includes('adventure')) {
      params.keywords = '4344,9882'; // adventure, exploration
    } else if (theme.includes('social issues')) {
      params.keywords = '10153,15099'; // social-issues, politics
    } else if (theme.includes('philosophical')) {
      params.keywords = '6152,6003'; // philosophy, existentialism
    }
  }
  
  // Pace preference
  if (responses.pace) {
    const pace = responses.pace.toLowerCase();
    if (pace.includes('fast-paced')) {
      params.with_genres = '28,53,80'; // Action, Thriller, Crime
    } else if (pace.includes('slow')) {
      params.with_genres = '18,36,99'; // Drama, History, Documentary
    }
  }
  
  // Content restrictions
  if (responses.final) {
    const restrictions = responses.final.toLowerCase();
    if (restrictions.includes('avoid violence')) {
      params.without_genres = '28,27,53,10752'; // Exclude Action, Horror, Thriller, War
    } else if (restrictions.includes('uplifting')) {
      params.keywords = '183,6582'; // joy, happiness
    }
  }
  
  return params;
}

/**
 * Generates a detailed explanation for a deep down recommendation
 * @param {Object} content - Content details
 * @param {Object} responses - User's responses
 * @returns {string} - Personalized explanation
 */
function generateDeepExplanation(content, responses) {
  // This would be more sophisticated in production
  let explanation = '';
  
  // Current mood
  if (responses.welcome) {
    const feeling = responses.welcome.toLowerCase();
    if (feeling.includes('great') || feeling.includes('energetic')) {
      explanation += 'This choice matches your energetic mood with its dynamic pacing. ';
    } else if (feeling.includes('relaxed') || feeling.includes('calm')) {
      explanation += 'This selection complements your relaxed state with its soothing narrative flow. ';
    } else if (feeling.includes('down') || feeling.includes('stressed')) {
      explanation += 'Given your current stress levels, this content offers a comforting escape. ';
    } else if (feeling.includes('reflective')) {
      explanation += 'This thoughtful piece aligns with your reflective mood. ';
    }
  }
  
  // Life situation
  if (responses['life-situation']) {
    const situation = responses['life-situation'].toLowerCase();
    if (situation.includes('change')) {
      explanation += 'The transformation themes mirror your own life changes. ';
    } else if (situation.includes('inspiration')) {
      explanation += 'Its inspiring narrative may provide the motivation you\'re seeking. ';
    } else if (situation.includes('celebrating')) {
      explanation += 'The uplifting elements complement your celebratory mood. ';
    } else if (situation.includes('escape')) {
      explanation += 'It offers the perfect escape from routine you mentioned wanting. ';
    }
  }
  
  // Themes interest
  if (responses.themes) {
    const theme = responses.themes.toLowerCase();
    if (theme.includes('growth')) {
      explanation += 'The personal growth journey at its core addresses your interest in transformation. ';
    } else if (theme.includes('relationships')) {
      explanation += 'Its exploration of human connections matches your interest in relationships. ';
    } else if (theme.includes('adventure')) {
      explanation += 'The adventurous spirit of this content aligns with your desire for exploration. ';
    } else if (theme.includes('social')) {
      explanation += 'Its examination of social issues resonates with your interest in justice and society. ';
    } else if (theme.includes('philosophical')) {
      explanation += 'The philosophical questions it raises should satisfy your interest in life\'s deeper meanings. ';
    }
  }
  
  return explanation;
}

// ROUTES

// Quick Peek recommendations endpoint
app.post('/api/quick-recommendations', async (req, res) => {
  try {
    const { answers } = req.body;
    
    if (!answers || !Array.isArray(answers) || answers.length !== 6) {
      return res.status(400).json({ 
        error: 'Invalid input. Please provide answers to all six questions.' 
      });
    }
    
    // Convert user answers to TMDB API parameters
    const searchParams = mapQuickAnswersToParams(answers);
    
    // Search for movies based on parameters
    let movies = await searchMovies(searchParams);
    
    // If no results, try with more lenient parameters
    if (movies.length === 0) {
      const lenientParams = { sort_by: 'popularity.desc' };
      movies = await searchMovies(lenientParams);
    }
    
    // Get detailed information for top 3 movies
    const recommendedMovies = [];
    
    for (let i = 0; i < Math.min(3, movies.length); i++) {
      const movie = movies[i];
      const movieDetails = await getMovieDetails(movie.id);
      
      if (movieDetails) {
        recommendedMovies.push({
          id: movieDetails.id,
          title: movieDetails.title,
          poster_path: movieDetails.poster_path,
          overview: movieDetails.overview,
          vote_average: movieDetails.vote_average,
          genres: movieDetails.genres.map(g => g.name),
          explanation: generateExplanation(movieDetails, answers)
        });
      }
    }
    
    res.json(recommendedMovies);
    
  } catch (error) {
    console.error('Error processing quick recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations. Please try again later.' });
  }
});

// Deep Down conversation recommendations endpoint
app.post('/api/deep-recommendations', async (req, res) => {
  try {
    const { responses } = req.body;
    
    if (!responses || typeof responses !== 'object' || Object.keys(responses).length === 0) {
      return res.status(400).json({ 
        error: 'Invalid input. Please provide conversation responses.' 
      });
    }
    
    // Convert conversation responses to search parameters
    const searchParams = mapDeepDownResponsesToParams(responses);
    
    // For simplicity, we're using the movie search endpoint here
    // In production, you might use different endpoints based on content type
    let movies = await searchMovies(searchParams);
    
    // If no results, try with more lenient parameters
    if (movies.length === 0) {
      const lenientParams = { sort_by: 'popularity.desc' };
      movies = await searchMovies(lenientParams);
    }
    
    // Get detailed information for top 3 movies
    const recommendedContent = [];
    
    for (let i = 0; i < Math.min(3, movies.length); i++) {
      const movie = movies[i];
      const movieDetails = await getMovieDetails(movie.id);
      
      if (movieDetails) {
        recommendedContent.push({
          id: movieDetails.id,
          title: movieDetails.title,
          poster_path: movieDetails.poster_path,
          overview: movieDetails.overview,
          vote_average: movieDetails.vote_average,
          genres: movieDetails.genres.map(g => g.name),
          type: 'movie', // This would vary in production
          explanation: generateDeepExplanation(movieDetails, responses)
        });
      }
    }
    
    res.json(recommendedContent);
    
  } catch (error) {
    console.error('Error processing deep recommendations:', error);
    res.status(500).json({ error: 'Failed to get recommendations. Please try again later.' });
  }
});

// Simple test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Movie Recommender API is working!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`TMDB API Key status: ${TMDB_API_KEY ? 'Configured' : 'Missing'}`);
}); 