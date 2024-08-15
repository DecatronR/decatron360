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
          100: '#ffebeb', // very light tint
          200: '#ffd7d7', // light tint
          300: '#ffc5c5', // primary light
          400: '#fb4747', // primary
          500: '#c91313', // primary dark
          600: '#7f0000', // very dark shade
        },
        success: '#10b981',
        error: '#f04438',
      },
    },
  },
  plugins: [],
};
