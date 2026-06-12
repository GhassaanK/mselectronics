import type { Config } from "tailwindcss"

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },

      colors: {
        // Core semantic colors
        primary: "rgb(var(--primary))",

        background: "rgb(var(--background))",
        surface: "rgb(var(--surface))",
        card: "rgb(var(--card))",

        foreground: "rgb(var(--foreground))",
        muted: "rgb(var(--muted))",

        border: "rgb(var(--border))",

        // Brand colors
        brand: {
          DEFAULT: "rgb(var(--brand))",
          dark: "rgb(var(--brand-dark))",
        },

        // Status colors
        success: "rgb(var(--success))",
        warning: "rgb(var(--warning))",
        danger: "rgb(var(--danger))",
      },

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        xl: "var(--radius-xl)",
      },

      boxShadow: {
        soft: "var(--shadow-soft)",
        lift: "var(--shadow-lift)",
      },

      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
        "3xl": "var(--space-3xl)",
        "4xl": "var(--space-4xl)",
      },

      transitionDuration: {
        premium: "var(--duration-premium)",
      },
    },
  },
  plugins: [],
}

export default config