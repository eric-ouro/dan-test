import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
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
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        "custom-red": {
          DEFAULT: "#FF6B6B", // Original color
          darker: "#B34747", // 30% darker color
          lighter: "#FF9E9E", // 25% lighter color
        },
        "custom-blue": {
          DEFAULT: "#6B67FF",
          darker: "#4743B3",
          lighter: "#9E9BFF", // 25% lighter color
        },
        "custom-brown": {
          DEFAULT: "#7A5A3A", // 30% desaturated color
          darker: "#523D28", // 30% desaturated and 30% darker color
          lighter: "#8F6A4A", // 30% desaturated and 25% lighter color
        },
        "custom-yellow": {
          DEFAULT: "#EDCF0E",
          darker: "#A5910A",
          lighter: "#F3E55F", // 25% lighter color
        },
        "custom-sky": {
          DEFAULT: "#80D4FA",
          darker: "#5996B3",
          lighter: "#A3E3FD", // 25% lighter color
        },
        "custom-orange": {
          DEFAULT: "#FFB300",
          darker: "#B37C00",
          lighter: "#FFC94D", // 25% lighter color
        },
        "custom-pink": {
          DEFAULT: "#DE82E0",
          darker: "#9A5B9B",
          lighter: "#E8A3E9", // 25% lighter color
        },
        "custom-green": {
          DEFAULT: "#4CAF51",
          darker: "#347136",
          lighter: "#79D17D", // 25% lighter color
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
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
