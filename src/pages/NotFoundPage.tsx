import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/ui/Button'; // Podemos usar nuestro botón

const NotFoundPage: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-indigo-600">404</h1>
      <h2 className="mb-4 text-2xl font-semibold text-gray-800">
        ¡Ups! Página no encontrada
      </h2>
      <p className="mb-8 max-w-md text-gray-600">
        Lo sentimos, la página que buscas no existe o ha sido movida.
        Verifica la URL o vuelve al inicio.
      </p>
      <Button
        onClick={() => window.location.href = '/dashboard'} // O usar navigate si prefieres
        variant="primary"
        className="px-6 py-3 text-lg" // Hacemos el botón un poco más grande
      >
         Volver al Dashboard
         {/* Alternativamente, podrías enlazar a '/' o '/login' dependiendo de la lógica */}
         <Link to="/dashboard">Volver al Dashboard</Link> {' '}
         {/* Si usas Link, quita onClick y ajusta clases si es necesario */}
      </Button>
    </div>
  );
};

export default NotFoundPage;