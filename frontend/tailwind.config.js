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
        'github-black': '#1B1F23',
        'blueish-black': '#213547',
        'offwhite': '#f9f7f6',
        'navgray':'#ebe9e8'
        
      },
      keyframes: {
        bounceTwice: {
          '0%, 100%': { transform: 'translateY(0)' },
          '25%, 75%': { transform: 'translateY(-10px)' },
          '50%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'bounce-twice': 'bounceTwice 2s ease-in-out',
      },
    },
  },
  plugins: [
  ],
}
