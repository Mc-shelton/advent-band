import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GirafProvider } from './giraf/index'
import ErrorBoundary from './components/ErrorBoundary'

// Lazy load App component
const App = lazy(() => import('./App.jsx'))

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter basename="/">
      <GirafProvider>
        <Suspense fallback={<div style={{
          display:'flex',
          height:'100%',
          width:"100%",
          justifyContent:'center',
          alignItems:'center',
          color:'black',
          fontSize:'12px'
        }}>Loading app...</div>}>
          <ErrorBoundary>
            <App />
          </ErrorBoundary>
        </Suspense>
      </GirafProvider>
    </BrowserRouter>
  </StrictMode>,
)

// const Root = () => {
//   return (
//     <Suspense fallback={<div>Loading Components...</div>}>
//       <BrowserRouter>
//         <GirafProvider>
//           <App />
//         </GirafProvider>
//       </BrowserRouter>
//     </Suspense>
//   );
// };

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <Root />
//   </StrictMode>
// );
// Global runtime error logging to catch silent failures
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    // Avoid noisy logs from passive network errors
    // eslint-disable-next-line no-console
    console.error('[GlobalError]', e?.error || e?.message, e?.filename, e?.lineno, e?.colno, e?.error?.stack)
  });
  window.addEventListener('unhandledrejection', (e) => {
    // eslint-disable-next-line no-console
    console.error('[UnhandledRejection]', e?.reason);
  });
}
