import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Load Cloudflare Web Analytics only in production. On localhost the beacon's
// RUM endpoint rejects the origin via CORS, producing a noisy (harmless) error.
if (import.meta.env.PROD) {
  const beacon = document.createElement('script')
  beacon.defer = true
  beacon.src = 'https://static.cloudflareinsights.com/beacon.min.js'
  beacon.setAttribute(
    'data-cf-beacon',
    '{"token": "4a12057b89c841adb7a6f3dc1d798950"}',
  )
  document.head.appendChild(beacon)
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
