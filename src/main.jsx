import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// React ka power button — application yahan se start hoti hai
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)