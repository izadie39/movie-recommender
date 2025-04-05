# Movie Recommender Application

A cinematic web application that provides personalized movie and content recommendations based on user input. The app helps users find the perfect entertainment options tailored to their preferences with a dark, slick theater-inspired design.

## Features

- **Dark Cinematic UI**: Premium theater-inspired design with dark theme, gold accents, and subtle animations
- **Quick Peek**: Answer six simple questions to get three personalized movie recommendations quickly
- **Deep Down**: Engage in a conversational interface to receive detailed and highly personalized content recommendations
- **Data-Driven Recommendations**: Uses The Movie Database (TMDB) API to provide accurate and up-to-date content suggestions

## Design Elements

- **Color Scheme**: Dark backgrounds (#1A1A1A, #222222, #333333) with gold (#D4AF37), silver (#C0C0C0), and deep red (#8B0000) accents
- **Typography**: Montserrat for body text and Playfair Display for headings, creating a modern yet classic feel
- **Animations**: Subtle hover effects, card transitions, and vignette styling to enhance the cinematic experience
- **Layout**: Clean, focused interface with theatrical movie card presentations

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **API**: The Movie Database (TMDB) API

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API key (get it from [TMDB website](https://www.themoviedb.org/settings/api))

### Installation

1. Clone the repository
```
git clone <repository-url>
cd movie-recommender
```

2. Install server dependencies
```
npm install
```

3. Install client dependencies
```
cd client
npm install
```

4. Create a `.env` file in the root directory and add your TMDB API key
```
TMDB_API_KEY=your_tmdb_api_key_here
```

### Running the Application

1. Start the development server (runs both backend and frontend)
```
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

## Usage

### Quick Peek

1. From the landing page, click on "Get Started" under the Quick Peek section
2. Answer the six questions by selecting the options that best match your preferences
3. View your personalized movie recommendations with cinematic card displays

### Deep Down

1. From the landing page, click on "Dive Deeper" under the Deep Down section
2. Engage in the conversational interface by selecting responses that match your current mood and preferences
3. Receive highly tailored content recommendations presented in a theater-inspired style

## Project Structure

- `/client` - React frontend application
  - `/src` - Source code
    - `/pages` - Main page components (LandingPage, QuickPeek, DeepDown)
    - `/index.css` - Global styles and cinematic component classes
- `server.js` - Node.js backend server
- `package.json` - Project dependencies and scripts

## API Documentation

The backend server provides the following API endpoints:

- `POST /api/quick-recommendations` - Get movie recommendations based on Quick Peek answers
- `POST /api/deep-recommendations` - Get content recommendations based on Deep Down conversation

## License

This project is licensed under the MIT License. 