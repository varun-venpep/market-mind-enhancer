
import React from "react";

// Simple pass-through provider since we're removing Material Tailwind theme
const MaterialThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default MaterialThemeProvider;
