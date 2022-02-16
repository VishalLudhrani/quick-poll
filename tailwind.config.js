module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      flex: {
        "2": "2 2 0%",
        "10": "10 10 0%"
      }
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("daisyui")
  ],
}