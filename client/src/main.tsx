import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
// Clean up Razorpay tracking fingerprints immediately on load
try {
  localStorage.removeItem('rzp_device_id');
  localStorage.removeItem('rzp_checkout_anon_id');
  localStorage.removeItem('unified_session_id');
} catch (e) {
  /* ignore */
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
