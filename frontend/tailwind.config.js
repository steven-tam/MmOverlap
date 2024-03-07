/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-gold': '#ffde7a',
        'light-maroon': '#900021',
        'gopher-maroon': '#7a0019',
        
      }
    },
  },
  plugins: [],
}
