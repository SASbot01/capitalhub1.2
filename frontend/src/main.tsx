import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
// 🟢 Importamos el AuthProvider que acabamos de crear
import { AuthProvider } from './context/AuthContext'; 
import { router } from './routes';
import './index.css';

// Importamos los estilos globales de tu proyecto
// Aquí iría el import de los estilos de Tailwind/CSS si aplica

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* 🟢 ENVOLVEMOS TODA LA APP con el proveedor de autenticación */}
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>,
);