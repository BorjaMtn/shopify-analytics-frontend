import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import useAuthStore from '@/store/authStore'; // Importamos el store
import authService from '@/services/authService'; // Importamos el servicio de auth
// Importamos nuestro botón por si queremos usarlo aquí, aunque el ejemplo usa un <button> simple
// import Button from '@/components/ui/Button';

// --- Componente Navbar ACTUALIZADO ---
const Navbar: React.FC = () => {
  const navigate = useNavigate(); // Hook para navegar
  const storeLogout = useAuthStore((state) => state.logout); // Acción logout del store
  const user = useAuthStore((state) => state.user); // Obtenemos el usuario del store (opcional, para mostrar nombre)
  const [isLoggingOut, setIsLoggingOut] = React.useState(false); // Estado de carga para logout

  const handleLogout = async () => {
    setIsLoggingOut(true);
    console.log('Attempting logout...');
    try {
      // 1. Llama a la API para invalidar el token en el backend
      // El token actual se añade automáticamente por el interceptor de apiClient
      await authService.logout();
      console.log('Logout API call successful.');

    } catch (error) {
      console.error('Logout API call failed:', error);
      // Aunque falle la llamada API (ej. red), igual queremos desloguear del frontend
      // porque el token local probablemente ya no sirva o queramos forzar el logout.
    } finally {
      // 2. Limpia el estado local (Zustand y localStorage)
      storeLogout();
      console.log('Local auth state cleared.');

      // 3. Redirige a la página de login
      navigate('/login');
      setIsLoggingOut(false);
    }
  };

  return (
    <nav className="bg-indigo-600 p-4 text-white shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        {/* Enlace al dashboard */}
        <Link to="/dashboard" className="text-xl font-semibold hover:text-indigo-200">
          Shopify GA Dashboard
        </Link>
        <Link to="/onboarding" className="text-sm font-medium hover:text-indigo-200">
          Configuración
        </Link>

        {/* Información del usuario y botón de logout */}
        <div className='flex items-center space-x-4'>
          {/* Mostramos el nombre del usuario si está disponible */}
          {user && (
            <span className="text-sm font-medium">Hola, {user.name}!</span>
          )}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut} // Deshabilitar mientras se procesa
            className={`rounded px-3 py-1 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-indigo-600 ${
              isLoggingOut
                ? 'bg-indigo-800 opacity-70 cursor-wait'
                : 'bg-indigo-700 hover:bg-indigo-800'
            }`}
          >
            {isLoggingOut ? 'Cerrando...' : 'Logout'}
          </button>
        </div>
      </div>
    </nav>
  );
};

// --- MainLayout (sin cambios en su estructura base) ---
const MainLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <Navbar /> {/* Navbar ahora tiene la lógica de logout */}
      <main className="container mx-auto flex-grow p-4 py-6 md:p-8">
        <Outlet />
      </main>
      <footer className="mt-auto bg-gray-200 p-4 text-center text-sm text-gray-600">
        © {new Date().getFullYear()} Shopify Analytics Dashboard by YourName
      </footer>
    </div>
  );
};

export default MainLayout;