import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { DemoUserProvider } from "./context/DemoUserContext.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DemoUserProvider>
      <App />
    </DemoUserProvider>
  </StrictMode>,
)
