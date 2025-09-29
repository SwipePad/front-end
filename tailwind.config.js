// const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
      },
    },
    extend: {
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        DrukWideBold: ["DrukWideBold", "sans-serif"],
      },

      keyframes: {
        "scroll-bg": {
          "0%": { backgroundPosition: "100% 0%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
      },
      animation: {
        "scroll-bg": "scroll-bg 10s linear infinite",
      },
    },
  },
  plugins: [import("tailwindcss-animate")],
};
