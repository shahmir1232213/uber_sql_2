import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import UserContext from './context/userContext.jsx'
import CaptinProvider from './context/captinContext.jsx'
import SocketContextProvider from './context/UserSocketContext.jsx'
import CaptinSocketContextProvider from './context/CaptinSocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CaptinSocketContextProvider>
      <SocketContextProvider>
        <CaptinProvider>
          <UserContext>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </UserContext>
        </CaptinProvider>
      </SocketContextProvider>
    </CaptinSocketContextProvider>
  </StrictMode>
)
