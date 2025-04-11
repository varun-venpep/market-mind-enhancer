
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Material Tailwind requires specific configuration
import { ThemeProvider } from "@material-tailwind/react";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
