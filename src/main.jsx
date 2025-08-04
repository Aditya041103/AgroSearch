import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
