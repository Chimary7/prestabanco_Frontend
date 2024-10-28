/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-blue': '#3b28cc',
        'custom-blue-light': '#2667ff',
      },
      height:{
        '98,5p': '98.5%',
        '1/10': '10%',
        '87/100': '87%',
        'p92': '92%',
      },
      width:{
        'pSidemenu': '13%',
        'pContainer': '86%',
        '45/100': '45%'
      }
    },
  },
  plugins: [],
}