import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore from '@/store/authStore'; // Importa el store

const ProtectedRoute: React.FC = () => {
  // Obtenemos el estado directamente del store.
  // Derivamos si está autenticado comprobando si existe el token.
  const isAuthenticated = useAuthStore(state => !!state.token);

  // Log para depuración (puedes quitarlo después)
  console.log('ProtectedRoute check: isAuthenticated =', isAuthenticated);

  if (!isAuthenticated) {
    // Si no está autenticado, redirige a la página de login
    // 'replace' evita que la ruta protegida quede en el historial del navegador
    console.log('Redirecting to /login from ProtectedRoute');
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza el componente hijo correspondiente a la ruta
  // <Outlet /> renderizará las rutas anidadas definidas en el router
  return <Outlet />;
};

export default ProtectedRoute;