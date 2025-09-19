/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 10s linear infinite',
        gradient: "gradient 6s ease infinite", // un poco más lento para que se note
      },
      keyframes: {
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "0% 100%" },
        },
      },
    },
  },
  plugins: [],
};
