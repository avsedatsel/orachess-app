import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "ora-gold": "#D4AF37",
        "ora-dark": "#0F0E1A",
        "ora-slate": "#1A1929",
        "ora-accent": "#6B21A8",
        "chess-light": "#E8D5B7",
        "chess-dark": "#6B4423",
        error: "#EF4444",
      },
    },
  },
  plugins: [],
};
export default config;
