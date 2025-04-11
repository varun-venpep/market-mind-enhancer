
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
  },
  card: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
    },
  },
  cardHeader: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      floated: false,
    },
  },
  cardBody: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
    },
  },
  cardFooter: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      divider: false,
    },
  },
  button: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      fullWidth: false,
    },
  },
  iconButton: {
    defaultProps: {
      placeholder: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      fullWidth: false,
    },
  },
  input: {
    defaultProps: {
      crossOrigin: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      shrink: false,
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
