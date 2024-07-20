/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*",
    "./node_modules/tailwind-datepicker-react/dist/**/*.js",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      colors: {
        lightgray: "#8F8F8F",
        primary: "#F08110",
      },
    },
  },
  plugins: [],
};
