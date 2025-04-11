
import React from "react";
import { ThemeProvider } from "@material-tailwind/react";

// Define custom theme with all the required properties for Material Tailwind components
const theme = {
  typography: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      textGradient: undefined,
    },
    styles: {
      variants: {}
    },
  },
  card: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
    },
    styles: {
      variants: {}
    },
  },
  cardHeader: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      floated: false,
    },
    styles: {
      variants: {}
    },
  },
  cardBody: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
    },
    styles: {
      variants: {}
    },
  },
  cardFooter: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      divider: false,
    },
    styles: {
      variants: {}
    },
  },
  button: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      fullWidth: false,
    },
    styles: {
      variants: {}
    },
  },
  iconButton: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      fullWidth: false,
    },
    styles: {
      variants: {}
    },
  },
  input: {
    defaultProps: {
      crossOrigin: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      shrink: false,
      error: false,
    },
    styles: {
      variants: {}
    },
  },
  spinner: {
    defaultProps: {
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
    },
  },
  checkbox: {
    defaultProps: {
      crossOrigin: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      iconProps: {},
    },
    styles: {
      variants: {}
    },
  },
};

const MaterialThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider value={theme}>
      {children}
    </ThemeProvider>
  );
};

export default MaterialThemeProvider;
