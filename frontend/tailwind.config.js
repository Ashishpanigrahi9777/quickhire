/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        background: '#F8FAFC',
        card: '#FFFFFF',
        primary: {
          DEFAULT: '#4F46E5', // Indigo 600
          hover: '#4338CA', // Indigo 700
          light: '#EEF2FF', // Indigo 50
        },
        text: {
          primary: '#1E293B', // Slate 800
          secondary: '#64748B', // Slate 500
        },
        border: '#E2E8F0', // Slate 200
      }
    },
  },
  plugins: [],
}
