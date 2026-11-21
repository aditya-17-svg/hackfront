import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: "#07080B",
        surface: "#0E1016",
        elevated: "#151822",
        ink: "#F4F5F7",
        signal: {
          DEFAULT: "#FF5A1F",
          hover: "#FF7340",
          glow: "rgba(255, 90, 31, 0.28)",
        },
        obsidian: {
          bg: "#07080B",
          surface: "#0E1016",
          elevated: "#151822",
          sidebar: "#0A0C11",
          border: "rgba(255, 255, 255, 0.08)",
          muted: "#9CA3B4",
          subtle: "#646C7E",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(14px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "aurora-drift": {
          "0%": { transform: "translate3d(0px, 0px, 0) scale(1)" },
          "50%": { transform: "translate3d(3%, -4%, 0) scale(1.06)" },
          "100%": { transform: "translate3d(-2%, 3%, 0) scale(0.98)" },
        },
      },
      animation: {
        "fade-up": "fade-up 520ms cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee 38s linear infinite",
        "aurora-drift": "aurora-drift 18s ease-in-out infinite alternate",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
