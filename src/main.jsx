import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import Login from './login.jsx'
import Admin from './admin.jsx'
import './index.css'

// Componente de seguridad: Protege la ruta de Admin
// Si no hay un token "simulado" en el navegador, te expulsa al Login
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('contre_auth') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Ruta Pública: La web principal (Home) */}
        <Route path="/" element={<App />} />
        
        {/* Ruta Pública: Login del Administrador */}
        <Route path="/login" element={<Login />} />
        
        {/* Ruta Privada: Panel de Control (Solo si tiene acceso) */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          } 
        />
        
        {/* Cualquier otra ruta desconocida redirige al Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)