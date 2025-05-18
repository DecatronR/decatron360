/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"], // Default font
        nasalization: ["Nasalization Rg", "sans-serif"],
        raleway: ["Raleway", "sans-serif"],
      },
      backdropBlur: {
        sm: "blur(5px)",
      },
      gridTemplateColumns: {
        "70/30": "70% 28%",
      },
      colors: {
        primary: {
          100: "#eceaff",
          200: "#c9c4ff",
          300: "#a59eff",
          400: "#8177ff",
          500: "#5a47fb",
          600: "#432cde",
          700: "#3019b8",
          800: "#1e0892",
        },
        success: "#10b981",
        error: "#f04438",
      },
    },
  },
  plugins: [],
};
