
import { createTheme } from "@material-tailwind/react";

export const theme = createTheme({
  theme: {
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
  },
  components: {
    button: {
      defaultProps: {
        color: "primary",
        variant: "filled",
      },
      styles: {
        variants: {
          filled: {
            primary: {
              background: "#1DCD9F",
              color: "#ffffff",
            },
          },
          outlined: {
            primary: {
              border: "1px solid #1DCD9F",
              color: "#1DCD9F",
            },
          },
        },
      },
    },
    card: {
      defaultProps: {
        color: "blue-gray",
      },
      styles: {
        variants: {
          filled: {
            "blue-gray": {
              background: "#222222",
              color: "#ffffff",
            },
          },
        },
      },
    },
    input: {
      defaultProps: {
        color: "primary",
      },
      styles: {
        base: {
          container: {
            backgroundColor: "#2A2A2A",
          },
          input: {
            color: "#ffffff",
          },
          label: {
            color: "#9ca3af",
          },
        },
      },
    },
    textarea: {
      defaultProps: {
        color: "primary",
      },
      styles: {
        base: {
          container: {
            backgroundColor: "#2A2A2A",
          },
          textarea: {
            color: "#ffffff",
          },
          label: {
            color: "#9ca3af",
          },
        },
      },
    },
    tabs: {
      defaultProps: {
        color: "primary",
      },
      styles: {
        base: {
          tabsHeader: {
            backgroundColor: "#1a1a1a",
          },
          tabPanel: {
            color: "#ffffff",
          },
        },
      },
    },
  },
});
