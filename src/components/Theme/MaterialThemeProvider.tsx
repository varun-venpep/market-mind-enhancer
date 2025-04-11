
import React from "react";

// Simple pass-through provider now that we're using shadcn/ui exclusively
const MaterialThemeProvider = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>;
};

export default MaterialThemeProvider;
