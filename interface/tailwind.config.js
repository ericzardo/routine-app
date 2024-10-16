/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "selector",
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        skyBlue: "#46B1C9",
        oceanMist: "#84C0C6",
        paleStone: "#9FB7B9",
        softSage: "#BCC1BA",
        warmSand: "#F2E2D2",
        stormyTeal: "#4F6364",
        ironMoss: "#5D615C",
        obsidianVeil: "#2C2A28",
      },
      fontFamily: {
        adlam: ["ADLaMDisplay"],
      },
      fontSize: {
        primary: 32,
        secondary: 20,
        large: 18,
        medium: 16,
        small: 14,
        caption: 12,
        note: 10,
      },
    },
  },
  plugins: [],
};
