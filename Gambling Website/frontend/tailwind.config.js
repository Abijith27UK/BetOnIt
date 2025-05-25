/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        gamble: ['"Black Ops One"', 'cursive'],
        mono: ['Roboto Mono', 'monospace'],
        grotesk: ['Space Grotesk', 'sans-serif'],
        bebas: ['Bebas Neue', 'cursive']
      },
    },
  },
  plugins: [],
};
