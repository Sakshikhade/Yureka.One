/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#0a0a0a', 
        ink: 'rgba(255, 255, 255, 0.9)',   
        clay: '#34d399',  
        surface: '#111111',
        'surface-hi': '#1a1a1a',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
      },
      fontFamily: {
        sans: ['Almarai', 'sans-serif'],
        heading: ['Almarai', 'sans-serif'],
        serif: ['"Instrument Serif"', 'serif'], 
        blackletter: ['"Instrument Serif"', 'serif'],
        kanit: ['Kanit', 'sans-serif'],
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
