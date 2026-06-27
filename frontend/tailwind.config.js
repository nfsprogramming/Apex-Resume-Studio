/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'midnight-slate': '#051424',
        'electric-cyan': '#00f0ff',
        'deep-card': '#0a1a2e',
        'sidebar-bg': '#020b14',
        'accent-yellow': '#eab308',
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
