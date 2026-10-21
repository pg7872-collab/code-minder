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
        background: {
          DEFAULT: '#0B0F19',
          light: '#F8FAFC',
          card: '#111827',
          cardLight: '#FFFFFF',
          subtle: '#1F2937',
          subtleLight: '#F1F5F9'
        },
        primary: {
          DEFAULT: '#6366F1', // Indigo
          hover: '#4F46E5',
          light: '#818CF8',
        },
        accent: {
          purple: '#A855F7',
          cyan: '#06B6D4',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
        border: {
          dark: '#1F2937',
          light: '#E2E8F0',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 20px -5px rgba(99, 102, 241, 0.4)',
        'glow-cyan': '0 0 20px -5px rgba(6, 182, 212, 0.4)',
        'glow-purple': '0 0 20px -5px rgba(168, 85, 247, 0.4)',
      }
    },
  },
  plugins: [],
}
