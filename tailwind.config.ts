import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        mono: ["JetBrains Mono", "monospace"],
        body: ["Inter", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border-default))",
        "border-subtle": "hsl(var(--border-subtle))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        surface: "hsl(var(--surface))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          bg: "hsl(var(--primary-bg))",
          border: "hsl(var(--primary-border))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          blue: "hsl(var(--blue-accent))",
          yellow: "hsl(var(--yellow-accent))",
        },
        hint: "hsl(var(--text-hint))",
        ghost: "hsl(var(--text-ghost))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        "green-cta": "hsl(var(--green-cta))",
        // Dashboard semantic tokens (b-* prefix)
        "b-base":           "hsl(var(--bg-base))",
        "b-surface":        "hsl(var(--bg-surface))",
        "b-card":           "hsl(var(--bg-card))",
        "b-elevated":       "hsl(var(--bg-elevated))",
        "b-border":         "hsl(var(--border-default))",
        "b-border-subtle":  "hsl(var(--border-subtle))",
        "b-text":           "hsl(var(--text-primary))",
        "b-text-secondary": "hsl(var(--text-secondary))",
        "b-text-muted":     "hsl(var(--text-muted))",
        "b-text-ghost":     "hsl(var(--text-ghost))",
        "b-green":          "hsl(var(--green))",
        "b-green-bg":       "hsl(var(--green-bg))",
        "b-green-border":   "hsl(var(--green-border))",
        "b-blue":           "hsl(var(--blue))",
        "b-blue-bg":        "hsl(var(--blue-bg))",
        "b-blue-border":    "hsl(var(--blue-border))",
        "b-yellow":         "hsl(var(--yellow))",
        "b-yellow-bg":      "hsl(var(--yellow-bg))",
        "b-yellow-border":  "hsl(var(--yellow-border))",
        "b-red":            "hsl(var(--red))",
        "b-red-bg":         "hsl(var(--red-bg))",
        "b-red-border":     "hsl(var(--red-border))",
        "b-purple":         "hsl(var(--purple))",
        "b-purple-bg":      "hsl(var(--purple-bg))",
        "b-purple-border":  "hsl(var(--purple-border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        btn: "6px",
        card: "8px",
        panel: "10px",
      },
      transitionDuration: {
        "150": "150ms",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
