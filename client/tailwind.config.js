/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        obsidian: "#020202",
        charcoal: "#0a0a0b",
        volt: {
          DEFAULT: "#ccff00",
          dark: "#a3cc00",
        },
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        glow: "glow 2s infinite alternate",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 224, 255, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 224, 255, 0.6)" },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        apexTheme: {
          primary: "#ccff00",
          secondary: "#0a0a0b",
          accent: "#ccff00",
          neutral: "#0a0a0b",
          "base-100": "#020202",
          "base-200": "#0a0a0b",
          "base-300": "#151516",
        },
      },
    ],
  },
};
