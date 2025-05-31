import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))", // #334155
        input: "hsl(var(--input))", // #1E293B
        ring: "hsl(var(--ring))", // #7C3AED
        background: "hsl(var(--background))", // #0F172A
        foreground: "hsl(var(--foreground))", // #F8FAFC (near white)
        primary: {
          DEFAULT: "hsl(var(--primary))", // #7C3AED
          foreground: "hsl(var(--primary-foreground))", // #F8FAFC (near white for text on primary)
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))", // #10B981
          foreground: "hsl(var(--secondary-foreground))", // #F8FAFC (near white for text on secondary)
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))", // #334155 (for muted backgrounds)
          foreground: "hsl(var(--muted-foreground))", // #A0AEC0 (lighter gray for text on muted)
        },
        accent: {
          DEFAULT: "hsl(var(--accent))", // #10B981 (can use secondary as accent)
          foreground: "hsl(var(--accent-foreground))", // #F8FAFC
        },
        popover: {
          DEFAULT: "hsl(var(--popover))", // #1E293B (same as card)
          foreground: "hsl(var(--popover-foreground))", // #F0F0F0
        },
        card: {
          DEFAULT: "hsl(var(--card))", // #1E293B
          foreground: "hsl(var(--card-foreground))", // #E2E8F0 (light gray for text on cards)
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
