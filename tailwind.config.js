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
        // Sitewide type system: Cirka for headings, Almarai for everything else
        // (subheadings, body, context). Legacy class names are kept so existing
        // markup doesn't need touching, but they all resolve to one of these two.
        sans: ['Almarai', 'sans-serif'],
        heading: ['Cirka', '"Instrument Serif"', 'Georgia', 'serif'],
        serif: ['Almarai', 'sans-serif'],
        blackletter: ['Cirka', '"Instrument Serif"', 'Georgia', 'serif'],
        kanit: ['Almarai', 'sans-serif'],
        cirka: ['Cirka', '"Instrument Serif"', 'Georgia', 'serif'],
        'overpass-mono': ['Almarai', 'sans-serif'],
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
