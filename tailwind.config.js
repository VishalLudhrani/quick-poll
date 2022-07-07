const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      flex: {
        "2": "2 2 0%",
        "10": "10 10 0%"
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms")
  ],
})