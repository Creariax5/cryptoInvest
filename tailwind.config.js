/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundColor: {
        'app-dark': '#242424',
        'app-light': '#ffffff',
        'button-dark': '#1a1a1a',
        'button-light': '#f9f9f9',
      },
      textColor: {
        'app-dark': 'rgba(255, 255, 255, 0.87)',
        'app-light': '#213547',
      },
      colors: {
        link: {
          DEFAULT: '#646cff',
          hover: '#535bf2',
        },
      },
    },
  },
  plugins: [],
}