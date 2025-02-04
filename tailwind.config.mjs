/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "neon-blue": "#42a5f5",
        "neon-pink": "#ff69b4",
      },
      boxShadow: {
        "neon-blue":
          "0 0 10px rgba(66, 165, 245, 0.8), 0 0 20px rgba(66, 165, 245, 0.6)",
        "neon-blue-lg":
          "0 0 20px rgba(66, 165, 245, 0.8), 0 0 40px rgba(66, 165, 245, 0.6)",
      },
    },
  },
  plugins: [require("daisyui")],
};

export default config;
