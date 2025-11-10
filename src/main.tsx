import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import App from './App.tsx'
import './core/i18n'
import { ENV } from './core/utils/env.utils'

// Function to enable mocking in development
async function enableMocking() {
  if (!ENV.MSW_ENABLED) {
    return;
  }
  const { worker } = await import('./core/mock/browser.ts')
  
  return worker.start({
    onUnhandledRequest: 'warn',
    quiet: false, 
  })
}

enableMocking().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})