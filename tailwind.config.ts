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
				primary: {
					"50": "#ecfdf5",
					"100": "#d1fae5",
					"200": "#a7f3d0",
					"300": "#6ee7b7",
					"400": "#34d399",
					"500": "#1DCD9F",
					"600": "#059669",
					"700": "#047857",
					"800": "#065f46",
					"900": "#064e3b",
				},
				secondary: {
					"50": "#eff6ff",
					"100": "#dbeafe",
					"200": "#bfdbfe",
					"300": "#93c5fd",
					"400": "#60a5fa",
					"500": "#169976",
					"600": "#2563eb",
					"700": "#1d4ed8",
					"800": "#1e40af",
					"900": "#1e3a8a",
				},
				dark: {
					"50": "#f9fafb",
					"100": "#f3f4f6",
					"200": "#e5e7eb",
					"300": "#d1d5db",
					"400": "#9ca3af",
					"500": "#6b7280",
					"600": "#4b5563",
					"700": "#374151",
					"800": "#222222",
					"900": "#111827",
					"950": "#000000",
				},
				border: "#2A2A2A",
				input: "#2A2A2A",
				ring: "#1DCD9F",
				background: "#121212",
				foreground: "#FFFFFF",
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
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
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config);
