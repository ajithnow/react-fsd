import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './core/i18n'

// Function to enable mocking in development
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const { worker } = await import('./core/mock/browser.ts')
  
  return worker.start({
    onUnhandledRequest: 'warn', // Warn about unhandled requests
    quiet: false, // Set to true to reduce console logs
  })
}

// Start the app after MSW is ready
enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})