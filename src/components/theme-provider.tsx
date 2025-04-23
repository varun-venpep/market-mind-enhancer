
// Theme Provider - forces theme by route

import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

type Theme = "light" | "dark";

type ThemeProviderProps = {
  children: React.ReactNode;
};

type ThemeProviderState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
}: ThemeProviderProps) {
  // Determine theme by location: dashboard/app = light, website/landing = dark
  const location = useLocation();
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // All routes outside /dashboard, /profile, /workspaces, /settings are "dark" (site)
    let newTheme: Theme = "light";
    if (
      location.pathname === "/" ||
      location.pathname.startsWith("/features") ||
      location.pathname.startsWith("/pricing") ||
      location.pathname.startsWith("/login") ||
      location.pathname.startsWith("/signup") ||
      location.pathname.startsWith("/terms") ||
      location.pathname.startsWith("/privacy")
    ) {
      newTheme = "dark";
    }
    setTheme(newTheme);

    const root = window.document.documentElement;
    root.classList.remove("dark");
    root.classList.remove("light");
    root.classList.add(newTheme);
  }, [location.pathname]);

  const value = {
    theme,
    setTheme: () => {}, // No manual switching for now
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);
  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};
