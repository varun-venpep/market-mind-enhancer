
import React from "react";
import { ThemeProvider } from "@material-tailwind/react";

// This is the solution to fix Material Tailwind TypeScript errors by adding event handlers
const eventHandlerProps = {
  onPointerEnterCapture: () => {},
  onPointerLeaveCapture: () => {},
  placeholder: null,
  crossOrigin: undefined,
};

// Wrap Material Tailwind components to add missing props required by TypeScript
const MaterialThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider value={{ 
      card: { defaultProps: eventHandlerProps },
      cardHeader: { defaultProps: eventHandlerProps },
      cardBody: { defaultProps: eventHandlerProps },
      cardFooter: { defaultProps: eventHandlerProps },
      typography: { defaultProps: eventHandlerProps },
      input: { defaultProps: { ...eventHandlerProps, shrink: false } },
      button: { defaultProps: eventHandlerProps },
      iconButton: { defaultProps: eventHandlerProps },
      checkbox: { defaultProps: eventHandlerProps },
      spinner: { defaultProps: eventHandlerProps }
    }}>
      {children}
    </ThemeProvider>
  );
};

export default MaterialThemeProvider;
