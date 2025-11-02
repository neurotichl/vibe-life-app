import type { Config } from 'tailwindcss'

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        // Ocean theme colors - Blue/Lavender palette
        ocean: {
          50: '#F0F4FF',   // Very light lavender blue
          100: '#E0EBFF',  // Light lavender blue
          200: '#C3D9FF',  // Soft blue
          300: '#90B8F8',  // Light blue
          400: '#5B9DF7',  // Medium blue
          500: '#3B82F6',  // Bright blue
          600: '#2563EB',  // Deep blue
          700: '#1E40AF',  // Dark blue
          800: '#1E3A8A',  // Darker blue
          900: '#172554',  // Navy blue
        },
        // Pastel color palette - Soft and aesthetic
        pastel: {
          blue: '#BDE0FE',      // Uranian Blue - Light sky blue
          pink: '#FFC8DD',      // Fairy Tale - Soft pink
          rose: '#FFAFCC',      // Carnation Pink - Rose pink
          mint: '#D8F7F2',      // Mint Green - Soft mint
          lavender: '#CDB4DB',  // Thistle - Soft lavender
          // Extended pastel shades for more flexibility
          50: '#F8FCFF',        // Very light pastel
          100: '#E8F4FF',       // Light pastel blue
          200: '#D8F7F2',       // Mint (reused)
          300: '#CDB4DB',       // Lavender (reused)
          400: '#BDE0FE',       // Uranian Blue (reused)
          500: '#FFAFCC',       // Carnation Pink (reused)
          600: '#FFC8DD',       // Fairy Tale (reused)
          700: '#A69BC1',       // Darker lavender
          800: '#8B7FA8',       // Deep lavender
          900: '#6B5B95',       // Purple
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
} satisfies Config

export default config
