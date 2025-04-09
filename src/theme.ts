
const baseTheme = {
  colors: {
    primary: {},
    "blue-gray": {},
  },
  fontFamily: {
    sans: "Inter, sans-serif",
  },
};

export const theme = {
  ...baseTheme,
  colors: {
    ...baseTheme.colors,
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
    "blue-gray": {
      "50": "#f8fafc",
      "100": "#f1f5f9",
      "200": "#e2e8f0",
      "300": "#cbd5e1",
      "400": "#94a3b8",
      "500": "#64748b",
      "600": "#475569",
      "700": "#334155",
      "800": "#222222",
      "900": "#1a202c",
      "950": "#000000",
    },
  },
  fontFamily: {
    sans: ["Inter, sans-serif"],
  },
};
