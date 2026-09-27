/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        forest: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#0b3319",
        },
        primary: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        earth: {
          50: "#faf8f5",
          100: "#f5f1e8",
          200: "#e9dfce",
          300: "#d7c5ab",
          400: "#b99d7a",
          500: "#8b6f47",
          600: "#765c38",
          700: "#5d472a",
          800: "#43321d",
          900: "#2d2112",
        },
        leaf: {
          400: "#a3e635",
          500: "#84cc16",
          600: "#65a30d",
        },
        skywater: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
        warm: {
          50: "#fcfdfa",
          100: "#f7f9f3", // Warm Off-White
          200: "#eff4e7",
          300: "#e1ebd3",
        },
        darkforest: "#17351F",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 15px -3px rgba(23, 53, 31, 0.05), 0 4px 6px -2px rgba(23, 53, 31, 0.025)",
        lift: "0 10px 25px -3px rgba(20, 83, 45, 0.08), 0 4px 6px -2px rgba(20, 83, 45, 0.04)",
      },
    },
  },
  plugins: [],
};
