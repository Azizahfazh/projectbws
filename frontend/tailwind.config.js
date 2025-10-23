/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Quicksand', 'sans-serif'],
      },
      colors: {
        primary: '#F4B6C2',
        secondary: '#FFD6E0',
        accent: '#E6A4B4',
        text: '#4B4B4B',
        background: '#FFFFFF',
      },
    },
  },
  plugins: [],
};
