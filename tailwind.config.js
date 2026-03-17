/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: '#000000',      // Pure black for OLED/cinematic look
        surface: '#0a0a0a',    // Very dark gray for depth
        accent: '#0066ff',     // Deep neon electric blue 
        accentGlow: '#4da6ff', // Lighter neon blue for glows
      },
      fontFamily: {
        sans: ['Inter', 'Space Grotesk', 'sans-serif'],
        display: ['Space Grotesk', 'Michroma', 'sans-serif'],
      },
      animation: {
        blob: "blob 10s infinite",
        float: "float 6s ease-in-out infinite",
        pulseGlow: "pulseGlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: 0.4 },
          "50%": { opacity: 0.8 },
        }
      }
    },
  },
  plugins: [],
}
