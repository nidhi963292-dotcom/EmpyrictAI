/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Palette 02: Oceanic Teal & Ice Blue
        teal: {
          50: '#f0f7f8',
          100: '#dbeff1',
          200: '#c2dfe3', // Soft powder ice blue
          300: '#8db8be', // Cool muted teal blue
          400: '#48a9a6', // Vibrant aqua teal
          500: '#2a8693', // Primary brand teal
          600: '#1d6e77', // Deep ocean teal
          700: '#18565d',
          800: '#163d42',
          900: '#142d30', // Deep petrol container
          950: '#0b1a1c'  // Midnight pine black
        },
        // Palette 03: Warm Sand, Peach Clay, Bone Ivory
        peach: {
          50: '#fdf7f2',
          100: '#fbf0e6',
          200: '#f7c9aa', // Soft apricot peach
          300: '#e3aa91', // Dusty blush terracotta
          400: '#d0946b', // Warm caramel ochre
          500: '#b8794f',
          600: '#9d603a',
          700: '#7c492b',
          800: '#5e3721',
          900: '#432616',
          950: '#27150a'
        },
        ivory: {
          50: '#fdfbf7',  // Ultra-light luxury cream
          100: '#f8efe0', // Warm buttermilk ivory cream
          200: '#eae8e1', // Pale linen stone
          300: '#d7d4c7',
          400: '#afa997', // Muted sage taupe
          500: '#8d8673'
        },
        // Alias brand to our palette 02/03 harmony
        brand: {
          50: '#f0f7f8',
          100: '#dbeff1',
          200: '#c2dfe3',
          300: '#8db8be',
          400: '#48a9a6',
          500: '#2a8693',
          600: '#1d6e77',
          700: '#18565d',
          800: '#163d42',
          900: '#142d30',
          950: '#0b1a1c'
        },
        slate: {
          850: '#102225',
          900: '#0d1c1e',
          950: '#071012'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        '3d-sm': '0 4px 6px -1px rgba(11, 26, 28, 0.1), 0 2px 4px -1px rgba(11, 26, 28, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        '3d-md': '0 10px 25px -5px rgba(11, 26, 28, 0.2), 0 8px 10px -6px rgba(11, 26, 28, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15)',
        '3d-lg': '0 20px 40px -10px rgba(11, 26, 28, 0.3), 0 10px 20px -5px rgba(11, 26, 28, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
        'glow-teal': '0 0 30px -5px rgba(72, 169, 166, 0.35)',
        'glow-peach': '0 0 30px -5px rgba(247, 201, 170, 0.35)',
        'glow-danger': '0 0 25px -5px rgba(239, 68, 68, 0.35)',
        'glow-success': '0 0 25px -5px rgba(72, 169, 166, 0.35)',
      },
      animation: {
        'float-slow': 'float 6s ease-in-out infinite',
        'float-reverse': 'float-reverse 7s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'tilt-3d': 'tilt 10s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-12px) rotate(1deg)' },
        },
        'float-reverse': {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(12px) rotate(-1deg)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        tilt: {
          '0%, 100%': { transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)' },
          '25%': { transform: 'perspective(1000px) rotateX(2deg) rotateY(-2deg)' },
          '75%': { transform: 'perspective(1000px) rotateX(-2deg) rotateY(2deg)' }
        }
      }
    },
  },
  plugins: [],
}
