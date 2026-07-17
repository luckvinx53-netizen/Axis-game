import type { Config } from "tailwindcss";

// Axis Game design tokens
// Background: near-black stadium-tunnel navy. Gold: trophy accent (used sparingly).
// Signal: electric teal for interactive/selected states. Alert: crimson for cards/negative deltas.
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#05070B",
          900: "#0A0D12",
          800: "#12161F",
          700: "#1A2029",
          600: "#242B38",
          500: "#333D4E",
        },
        gold: {
          400: "#E8C766",
          500: "#D4AF37",
          600: "#B4912A",
        },
        signal: {
          400: "#4FE8D8",
          500: "#2DD4C8",
          600: "#1FA89F",
        },
        alert: {
          500: "#E53946",
          600: "#C22733",
        },
        ink: {
          100: "#F5F6F8",
          300: "#C7CCD6",
          500: "#8A93A3",
          700: "#54606F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "stadium-glow":
          "radial-gradient(120% 120% at 50% -10%, rgba(45,212,200,0.12) 0%, rgba(10,13,18,0) 60%)",
      },
    },
  },
  plugins: [],
};

export default config;
