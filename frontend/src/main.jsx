import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Default to light theme on initial load. Users can toggle in the sidebar.
try {
  document.documentElement.classList.add('theme-light');
} catch (e) {
  // ignore when rendering on server or no DOM
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
