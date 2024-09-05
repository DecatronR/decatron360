/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
      },
      gridTemplateColumns: {
        '70/30': '70% 28%',
      },
      colors: {
        primary: {
          100: '#eceaff', // very light tint
          200: '#c9c4ff', // light tint
          300: '#a59eff', // primary light
          400: '#8177ff', // lighter primary
          500: '#5a47fb', // primary (your original color)
          600: '#432cde', // primary dark
          700: '#3019b8', // darker shade
          800: '#1e0892', // very dark shade
        },
        success: '#10b981',
        error: '#f04438',
      },
    },
  },
  plugins: [],
};
