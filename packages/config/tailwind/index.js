/** @type {import('tailwindcss').Config} */
const swiftmaliPreset = {
  theme: {
    extend: {
      colors: {
        gold: { 50:'#FDF8EC', 100:'#F7EFD1', 200:'#F0DFA0', 400:'#C9A84C', 600:'#A5831A' },
        neutral: { 50:'#F7F6F2', 100:'#ECEAE3', 200:'#E5E3DC', 400:'#888780', 700:'#3D3B36', 900:'#1A1917', 950:'#0E0D0B' },
        success: '#1A7A4A', warning: '#D4720C', error: '#CC2E2E', info: '#378ADD',
      },
      fontFamily: {
        display: ['var(--font-syne)', 'system-ui', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      borderRadius: { sm:'4px', md:'8px', lg:'14px', xl:'20px', '2xl':'28px' },
    },
  },
};
module.exports = swiftmaliPreset;
