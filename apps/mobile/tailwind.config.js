/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        gold: { 50: '#FDF8EC', 400: '#C9A84C', 600: '#A5831A' },
        neutral: { 50: '#F7F6F2', 100: '#ECEAE3', 200: '#DEDAD1', 400: '#888780', 700: '#3D3B36', 950: '#0E0D0B' },
      },
    },
  },
  plugins: [],
};
