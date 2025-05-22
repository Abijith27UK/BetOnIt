/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        gamble: ['"Black Ops One"', 'cursive'],
      },
    },
  },
  plugins: [],
};
