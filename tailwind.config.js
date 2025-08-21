/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Add custom fonts here if needed
      fontFamily: {
        'Tiro_Bangla': ['Tiro Bangla', 'serif'],
        'Cairo': ['Cairo', 'sans-serif'],
        'Solaiman_Lipi': ['Solaiman Lipi', 'sans-serif'],
      },
    },
  },
  plugins: [],
}