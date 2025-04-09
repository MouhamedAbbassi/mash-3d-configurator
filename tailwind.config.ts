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
          inter: ["Inter", "sans-serif"], // Add your custom font
        },
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",   // ✅ THIS is the one you need!
        xl: "1280px",
        "2xl": "1536px",
      }
    },
    plugins: [],
  }
  