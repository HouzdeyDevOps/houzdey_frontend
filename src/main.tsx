import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import './index.css'
import { UserProvider } from './components/Provider/UserContext.js';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
     <UserProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    <ToastContainer />
    </UserProvider>
  </StrictMode>,
)
