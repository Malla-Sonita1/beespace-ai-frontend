/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Point d'entrée racine — ConfigProvider global via AppThemeProvider.
 */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'antd/dist/antd.css'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
