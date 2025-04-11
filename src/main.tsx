
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Don't include a ThemeProvider here as we're using it in App.tsx
createRoot(document.getElementById("root")!).render(<App />);
