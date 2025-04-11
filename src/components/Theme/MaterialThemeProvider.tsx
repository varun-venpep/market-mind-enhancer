
import React from "react";
import { ThemeProvider } from "@material-tailwind/react";

const MaterialThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
};

export default MaterialThemeProvider;
