
import type { Config } from "tailwindcss";
import withMT from "@material-tailwind/react/utils/withMT";

export default withMT({
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
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: '#7A1CAC',
          foreground: '#fff'
        },
        secondary: {
          DEFAULT: '#AD49E1',
          foreground: '#fff'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        muted: {
          DEFAULT: '#F3E8FF',
          foreground: '#7A1CAC'
        },
        accent: {
          DEFAULT: '#AD49E1',
          foreground: '#fff'
        },
        popover: {
          DEFAULT: '#251833',
          foreground: '#fff'
        },
        card: {
          DEFAULT: '#212121',
          foreground: '#fff'
        },
        // "brand" for gradients, overlays, badges, etc.
        brand: {
          50: '#f7f3fd',
          100: '#e7d9fa',
          200: '#d0b4f5',
          300: '#b58ae9',
          400: '#a25cd8',
          500: '#7A1CAC',
          600: '#7A1CAC',
          700: '#681590',
          800: '#3a103d',
          900: '#212121',
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        shimmer: {
          '100%': {
            transform: 'translateX(100%)',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s infinite',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config);

