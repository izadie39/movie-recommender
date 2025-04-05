/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#D4AF37', // Gold for primary actions
        secondary: '#8B0000', // Deep red for secondary elements
        accent: '#C0C0C0', // Silver for accents
        dark: {
          DEFAULT: '#1A1A1A', // Base dark background
          light: '#333333', // Lighter dark for gradients
          medium: '#222222', // Medium dark for cards
        },
        light: '#f8fafc'
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
        serif: ['Playfair Display', 'serif']
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-cine': 'linear-gradient(to bottom, #1A1A1A, #333333)',
        'movie-covers': "url('/images/movie-covers-bg.jpg')",
      },
      boxShadow: {
        'glow': '0 0 10px rgba(212, 175, 55, 0.5)',
        'cinema': '0 10px 30px -10px rgba(0, 0, 0, 0.5)'
      },
    },
  },
  plugins: [],
} 