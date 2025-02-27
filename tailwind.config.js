/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          veryLight: "#f2f8ff",
          light: "#0f457a",
          DEFAULT: "#05203c",
          dark: "#091016",
        },
        cutomGrey: {
          light: "#f7f7f7",
          DEFAULT: "#adadad",
          dark: "#565656",
        },
        toastColor: {
          DEFAULT: "#dbedff",
          error: "#db2e32",
          normal: "#05203c",
          success: "#06a550",
          successBg: "#aaffd0",
          errorBg: "#ffa0a2",
          normalBg: "#b5dafc",
        },
      },
    },
  },
  plugins: [],
};
