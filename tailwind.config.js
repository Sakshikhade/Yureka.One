/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#0a0a0a', 
        ink: 'rgba(255, 255, 255, 0.9)',   
        clay: '#34d399',  
        purple: {
          light: '#a78bfa',
          DEFAULT: '#8b5cf6',
          dark: '#5b21b6',
          deep: '#1e1b4b',
          glow: 'rgba(139, 92, 246, 0.3)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Outfit', 'sans-serif'],
        serif: ['Fraunces', 'serif'], 
        blackletter: ['Fraunces', 'serif'],
      },
      lineHeight: {
        tight: '1.1',
        snug: '1.2',
      },
      animation: {
        'fade-in-up': 'fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      },
      perspective: {
        '1000': '1000px',
      }
    },
  },
  plugins: [],
}
