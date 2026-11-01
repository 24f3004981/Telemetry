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
        bg: "var(--color-bg)",
        surface: "var(--color-surface)",
        sunk: "var(--color-sunk)",
        line: "var(--color-line)",
        "line-2": "var(--color-line-2)",
        ink: "var(--color-ink)",
        "ink-2": "var(--color-ink-2)",
        "ink-3": "var(--color-ink-3)",
        teal: {
          DEFAULT: "var(--color-teal)",
          2: "var(--color-teal-2)",
          soft: "var(--color-teal-soft)",
        },
        saffron: {
          DEFAULT: "var(--color-saffron)",
          soft: "var(--color-saffron-soft)",
          ink: "var(--color-saffron-ink)",
        },
        pass: {
          DEFAULT: "var(--color-pass)",
          soft: "var(--color-pass-soft)",
        },
        fail: {
          DEFAULT: "var(--color-fail)",
          soft: "var(--color-fail-soft)",
        },
        wait: {
          DEFAULT: "var(--color-wait)",
          soft: "var(--color-wait-soft)",
        },
        // Backwards compatibility with earlier components
        background: "var(--color-bg)",
        "surface-muted": "var(--color-sunk)",
        border: "var(--color-line)",
        "border-strong": "var(--color-line-2)",
        "text-primary": "var(--color-ink)",
        "text-secondary": "var(--color-ink-2)",
        "text-muted": "var(--color-ink-3)",
        accent: {
          DEFAULT: "var(--color-teal)",
          hover: "var(--color-teal-2)",
          soft: "var(--color-teal-soft)",
          foreground: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
        serif: ["var(--font-display)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "Menlo", "monospace"],
      },
      borderRadius: {
        card: "16px",
        "2xl": "20px",
        "3xl": "28px",
      },
    },
  },
  plugins: [],
};

export default config;
