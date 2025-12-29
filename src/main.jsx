import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { GirafProvider } from './giraf/index'
import ErrorBoundary from './components/ErrorBoundary'

import App from './App.jsx'

const resolveBasename = () => {
  if (typeof window === 'undefined') {
    return import.meta.env.BASE_URL || '/'
  }

  if (window.location.protocol === 'file:') {
    return '/'
  }

  const { pathname } = window.location
  if (pathname.endsWith('/index.html')) {
    const rawBase = pathname.slice(0, -'index.html'.length) || '/'
    const withLeading = rawBase.startsWith('/') ? rawBase : `/${rawBase}`
    const sanitizedBase = withLeading.length > 1 ? withLeading.replace(/\/+$/, '') : withLeading

    if (window.location.protocol !== 'file:' || typeof window.history?.replaceState === 'function') {
      try {
        const normalized = sanitizedBase.endsWith('/') ? sanitizedBase : `${sanitizedBase}/`
        window.history.replaceState(null, '', normalized)
      } catch {
        // ignore history errors
      }
    }
    return sanitizedBase || '/'
  }
  // comment for deployment something more

  return import.meta.env.BASE_URL || '/'
}

const isFileProtocol =
  typeof window !== 'undefined' && window.location?.protocol === 'file:'
const RouterComponent = isFileProtocol ? HashRouter : BrowserRouter
const basename = isFileProtocol ? undefined : resolveBasename()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterComponent basename={basename}>
      <GirafProvider>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </GirafProvider>
    </RouterComponent>
  </StrictMode>
)
