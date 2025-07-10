import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { GirafProvider } from './giraf/index'

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
          <App />
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
