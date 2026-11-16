/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
        },
        secondary: {
          DEFAULT: '#7C3AED',
          50: '#F5F3FF',
          100: '#EDE9FE',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
        },
        accent: {
          DEFAULT: '#06B6D4',
          50: '#ECFEFF',
          400: '#22D3EE',
          500: '#06B6D4',
          600: '#0891B2',
        },
        dark: {
          bg: '#0B0F19',
          surface: '#111827',
          card: '#1E293B',
          border: '#334155',
          text: '#F8FAFC',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 30px -5px rgba(79, 70, 229, 0.3)',
        'glow-secondary': '0 0 30px -5px rgba(124, 58, 237, 0.3)',
        'glow-cyan': '0 0 30px -5px rgba(6, 182, 212, 0.3)',
      },
    },
  },
  plugins: [],
}
