/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./src/**/*.{js,ts,jsx,tsx}",
      "./src/**/**/*.{js,ts,jsx,tsx}",
      "./stories/**/*.{js,ts,jsx,tsx}",
      "./lib/**/*.{js,ts,jsx,tsx}",

    ],
    theme: {
      extend: {
        fontFamily: {
          inter: ["Inter", "sans-serif"], // Add custom font
        },
      },
    },
    plugins: [],
  }
  