
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
      id: undefined,
      type: undefined,
      title: undefined,
      suppressHydrationWarning: undefined,
      lang: undefined,
      media: undefined,
      style: undefined,
      target: undefined,
      role: undefined,
      slot: undefined,
      key: undefined,
      defaultChecked: undefined,
      defaultValue: undefined,
      suppressContentEditableWarning: undefined,
      form: undefined,
      pattern: undefined,
      "aria-activedescendant": undefined,
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
      id: undefined,
      title: undefined,
      suppressHydrationWarning: undefined,
      color: undefined,
      lang: undefined,
      style: undefined,
      role: undefined,
      tabIndex: undefined,
      slot: undefined,
      key: undefined,
      defaultChecked: undefined,
      defaultValue: undefined,
      suppressContentEditableWarning: undefined,
      "aria-activedescendant": undefined,
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
      id: undefined,
      title: undefined,
      suppressHydrationWarning: undefined,
      lang: undefined,
      style: undefined,
      role: undefined,
      tabIndex: undefined,
      slot: undefined,
      key: undefined,
      defaultChecked: undefined,
      defaultValue: undefined,
      suppressContentEditableWarning: undefined,
      "aria-activedescendant": undefined,
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
      id: undefined,
      title: undefined,
      suppressHydrationWarning: undefined,
      color: undefined,
      lang: undefined,
      style: undefined,
      role: undefined,
      tabIndex: undefined,
      slot: undefined,
      key: undefined,
      defaultChecked: undefined,
      defaultValue: undefined,
      suppressContentEditableWarning: undefined,
      "aria-activedescendant": undefined,
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
      id: undefined,
      title: undefined,
      suppressHydrationWarning: undefined,
      color: undefined,
      lang: undefined,
      style: undefined,
      role: undefined,
      tabIndex: undefined,
      slot: undefined,
      key: undefined,
      defaultChecked: undefined,
      defaultValue: undefined,
      suppressContentEditableWarning: undefined,
      "aria-activedescendant": undefined,
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
      id: undefined,
      title: undefined,
      value: undefined,
      name: undefined,
      suppressHydrationWarning: undefined,
      lang: undefined,
      style: undefined,
      role: undefined,
      tabIndex: undefined,
      slot: undefined,
      key: undefined,
      defaultChecked: undefined,
      defaultValue: undefined,
      suppressContentEditableWarning: undefined,
      form: undefined,
      pattern: undefined,
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
      id: undefined,
      type: undefined,
      title: undefined,
      value: undefined,
      name: undefined,
      suppressHydrationWarning: undefined,
      lang: undefined,
      style: undefined,
      role: undefined,
      slot: undefined,
      key: undefined,
      defaultChecked: undefined,
      defaultValue: undefined,
      suppressContentEditableWarning: undefined,
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
      id: undefined,
      title: undefined,
      children: undefined,
      suppressHydrationWarning: undefined,
      color: undefined,
      height: undefined,
      lang: undefined,
      max: undefined,
      min: undefined,
      media: undefined,
      method: undefined,
      style: undefined,
      slot: undefined,
      key: undefined,
      defaultChecked: undefined,
      defaultValue: undefined,
      suppressContentEditableWarning: undefined,
      form: undefined,
      pattern: undefined,
      placeholder: undefined,
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
      id: undefined,
      type: undefined,
      children: undefined,
      name: undefined,
      height: undefined,
      lang: undefined,
      max: undefined,
      media: undefined,
      method: undefined,
      min: undefined,
      style: undefined,
      string: undefined,
      filter: undefined,
      mask: undefined,
      path: undefined,
      key: undefined,
      role: undefined,
      tabIndex: undefined,
      clipPath: undefined,
      placeholder: undefined,
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
      id: undefined,
      type: undefined,
      title: undefined,
      children: undefined,
      value: undefined,
      suppressHydrationWarning: undefined,
      height: undefined,
      lang: undefined,
      max: undefined,
      min: undefined,
      style: undefined,
      slot: undefined,
      key: undefined,
      defaultChecked: undefined,
      defaultValue: undefined,
      suppressContentEditableWarning: undefined,
      form: undefined,
      pattern: undefined,
      placeholder: undefined,
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
