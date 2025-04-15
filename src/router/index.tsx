import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// --- Layouts ---
// Verifica que estas rutas sean correctas según tu estructura
import AuthLayout from '@/components/layout/AuthLayout';
import MainLayout from '@/components/layout/MainLayout';

// --- Componente de Ruta Protegida ---
// Verifica que esta ruta sea correcta
import ProtectedRoute from './ProtectedRoute'; // Asume que está en src/router/

// --- Páginas ---
// Verifica que estas rutas sean correctas
import LoginPage from '@/pages/Auth/LoginPage';
import RegisterPage from '@/pages/Auth/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import NotFoundPage from '@/pages/NotFoundPage'; // Ruta corregida
import OnboardingPage from '@/pages/OnboardingPage';
import GoogleCallbackPage from '@/components/auth/GoogleCallbackPage'; // Componente que maneja el callback de Google
// import SettingsPage from '@/pages/SettingsPage'; // Placeholder para futuro

// --- Creación del Router ---
const router = createBrowserRouter([
  // --- Rutas de Autenticación (Públicas) ---
  // Usan AuthLayout
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
    ],
  },

  // --- Rutas Principales / Protegidas ---
  // Envueltas primero por ProtectedRoute para verificar autenticación
  {
    element: <ProtectedRoute />, // Verifica si está logueado
    children: [
      // Si está logueado, renderiza MainLayout
      {
        element: <MainLayout />,
        // Las páginas reales van como hijas de MainLayout
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
          {
            path: '/onboarding',
            element: <OnboardingPage />,
          },
          // { // Placeholder para futuro
          //   path: '/settings',
          //   element: <SettingsPage />,
          // },

          // La ruta raíz '/' dentro de las protegidas va al Dashboard
          {
            index: true, // Ruta por defecto si ninguna otra coincide dentro de MainLayout
            element: <DashboardPage />,
          },
        ]
      }
    ]
  },

  // --- RUTA DE CALLBACK DE GOOGLE ---
  // Fuera de los layouts principales y de ProtectedRoute
  {
    path: '/oauth/google/callback', // La URL a la que Google redirige (debe coincidir en Google Cloud)
    element: <GoogleCallbackPage />, // Componente que procesa el callback
  },
  // ---------------------------------

  // --- Ruta 404 (Comodín) ---
  // Se usa si ninguna de las rutas anteriores coincide
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// --- Componente Proveedor del Router ---
// Este componente simplemente envuelve la app con el router configurado
const AppRouterProvider = () => {
  // Podrías añadir lógica aquí si fuera necesario (ej. context providers globales)
  return <RouterProvider router={router} />;
};

// --- Exportación ---
export default AppRouterProvider;