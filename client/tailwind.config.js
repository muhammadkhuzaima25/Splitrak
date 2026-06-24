/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        base: '#080E0D',
        surface: '#0D1A17',
        border: '#1A3028',
        primary: '#00C27A',
        'primary-light': '#4DFDB3',
        'text-main': '#DFF5EE',
        'text-muted': '#4D7A6C',
        'text-dim': '#2A4A42',
        warning: '#F5A623',
      }
    },
  },
  plugins: [],
}
