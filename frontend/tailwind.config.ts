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
        bx: {
          bg: "#080808",
          alt: "#0A0A0A",
          darkest: "#090909",
          dark: "#0C0C0C",
          surface: "#0D0D0D",
          chart: "#030303",
          menu: "#202020",
          border: "#1A1A1A",
          darker: "#181818",
          ink: "#F2F2F0",
          prose: "#C6C6C2",
          secondary: "#858582",
          muted: "#82827F",
          meta: "#7A7A78",
          soft: "#585857",
          accent: "#FF6901",
          "accent-hover": "#FF8533",
        },
        paper: "#080808",
        surface: "#0C0C0C",
        elevated: "#181818",
        ink: "#F2F2F0",
        signal: {
          DEFAULT: "#FF6901",
          hover: "#FF8533",
          glow: "rgba(255, 105, 1, 0.28)",
        },
        obsidian: {
          bg: "#080808",
          surface: "#0C0C0C",
          elevated: "#181818",
          sidebar: "#0A0A0A",
          border: "#1A1A1A",
          muted: "#858582",
          subtle: "#585857",
        },
        warm: {
          bg: "#080808",
          surface: "#0C0C0C",
          secondary: "#181818",
          sidebar: "#0A0A0A",
          border: "#1A1A1A",
          hover: "#181818",
          text: "#F2F2F0",
          muted: "#858582",
          subtle: "#585857",
        },
        terracotta: {
          DEFAULT: "#FF6901",
          dark: "#E05500",
          light: "rgba(255, 105, 1, 0.14)",
          subtle: "rgba(255, 105, 1, 0.08)",
        },
        status: {
          success: "#4ADE80",
          "success-bg": "rgba(74, 222, 128, 0.12)",
          warning: "#FBBF24",
          "warning-bg": "rgba(251, 191, 36, 0.12)",
          error: "#FF6B6B",
          "error-bg": "rgba(255, 107, 107, 0.12)",
          info: "#38BDF8",
          "info-bg": "rgba(56, 189, 248, 0.12)",
        },
        background: "#080808",
        foreground: "#F2F2F0",
        card: {
          DEFAULT: "#0C0C0C",
          foreground: "#F2F2F0",
          border: "#1A1A1A",
        },
        primary: {
          DEFAULT: "#FF6901",
          foreground: "#0C0C0C",
          hover: "#FF8533",
        },
        border: "#1A1A1A",
        input: "#1F1F1F",
        ring: "#FF6901",
      },
      fontFamily: {
        display: ["var(--font-display)", "Space Grotesk", "sans-serif"],
        sans: ["var(--font-sans)", "Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        warm: "0 1px 2px 0 rgba(0, 0, 0, 0.55)",
        "warm-md": "0 8px 24px -6px rgba(0, 0, 0, 0.65)",
        "warm-lg": "0 20px 48px -12px rgba(0, 0, 0, 0.85)",
        obsidian: "0 16px 40px -14px rgba(0, 0, 0, 0.85)",
        signal: "0 0 28px -4px rgba(255, 105, 1, 0.42)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        indeterminate: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(320%)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        blink: {
          "0%, 49%": { opacity: "1" },
          "50%, 100%": { opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 480ms cubic-bezier(0.22, 1, 0.36, 1) both",
        marquee: "marquee 36s linear infinite",
        indeterminate: "indeterminate 1.4s cubic-bezier(0.65, 0, 0.35, 1) infinite",
        shimmer: "shimmer 2.2s linear infinite",
        blink: "blink 1.1s step-end infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
