
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
      color: undefined,
      variant: undefined,
      className: undefined,
      children: undefined,
      as: undefined,
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
      className: undefined,
      children: undefined,
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
      className: undefined,
      children: undefined,
      variant: undefined,
      color: undefined,
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
      className: undefined,
      children: undefined,
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
      className: undefined,
      children: undefined,
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
      className: undefined,
      children: undefined,
      type: undefined,
      variant: undefined,
      color: undefined,
      onClick: undefined,
      disabled: undefined,
      size: undefined,
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
      className: undefined,
      children: undefined,
      variant: undefined,
      color: undefined,
      size: undefined,
      onClick: undefined,
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
      className: undefined,
      label: undefined,
      type: undefined,
      value: undefined,
      onChange: undefined,
      containerProps: undefined,
      required: undefined,
      icon: undefined,
      size: undefined,
      name: undefined,
    },
    styles: {
      variants: {}
    },
  },
  spinner: {
    defaultProps: {
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      className: undefined,
      color: undefined,
    },
  },
  checkbox: {
    defaultProps: {
      crossOrigin: undefined,
      onPointerEnterCapture: undefined,
      onPointerLeaveCapture: undefined,
      iconProps: {},
      name: undefined,
      checked: undefined,
      onChange: undefined,
      color: undefined,
      className: undefined,
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
