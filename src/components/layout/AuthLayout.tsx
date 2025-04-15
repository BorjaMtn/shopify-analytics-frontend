import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet renderiza la ruta hija

const AuthLayout: React.FC = () => {
  return (
    // Contenedor principal que ocupa toda la pantalla y centra el contenido
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-4">
      {/* La "tarjeta" blanca centrada con sombra donde irá el formulario */}
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-xl">
         {/* Aquí es donde React Router renderizará el componente de la ruta anidada */}
         {/* (es decir, LoginPage o RegisterPage) */}
         <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;