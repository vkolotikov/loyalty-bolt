/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1F4B73',
          light: '#2B5C89',
          dark: '#163A5C'
        },
        secondary: {
          DEFAULT: '#2297A3',
          light: '#27ABB8',
          dark: '#1B7A84'
        },
        neutral: {
          DEFAULT: '#2B3038',
          light: '#363B45',
          dark: '#22262D'
        }
      }
    },
  },
  plugins: [],
  future: {
    hoverOnlyWhenSupported: true,
  },
}