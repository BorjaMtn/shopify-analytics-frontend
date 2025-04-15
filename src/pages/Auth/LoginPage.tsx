import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm'; // Asegúrate que la importación esté descomentada
import authService from '@/services/authService'; // Importamos el servicio de auth
import useAuthStore from '@/store/authStore'; // <-- Importamos el store de Zustand
import { isAxiosError } from 'axios'; // Para verificar errores de Axios

// Tipo de datos del formulario (sin cambios)
type LoginFormData = {
  email: string;
  password: string;
  remember?: boolean;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Obtenemos la acción 'login' de nuestro store Zustand
  // Es la función que definimos para guardar user y token
  const storeLogin = useAuthStore((state) => state.login);

  // --- Función handleLogin ACTUALIZADA ---
  const handleLogin = async (data: LoginFormData) => {
    console.log('Enviando datos de login a la API:', data);
    setIsLoading(true);
    setError(null);

    try {
      // Llamamos a la función login de nuestro servicio
      // Esperamos recibir { user, token } como respuesta
      const { user, token } = await authService.login(data);

      console.log('Login API exitoso:', user.email);

      // --- ¡Paso Clave: Actualizar el Estado Global! ---
      storeLogin(user, token);
      // -------------------------------------------------

      console.log('Token y usuario guardados en Zustand. Redirigiendo...');
      navigate('/dashboard'); // Redirige al dashboard tras éxito

    } catch (err) {
      console.error('Error durante el login:', err);
      if (isAxiosError(err)) {
        if (err.response) {
          // Error desde la API (ej. 401 Unauthorized, 422 Validación)
          const status = err.response.status;
          const responseData = err.response.data;

          if (status === 422 && responseData.errors) {
             // Error de validación de Laravel (aunque login no suele tener muchos)
             const firstErrorKey = Object.keys(responseData.errors)[0];
             setError(responseData.errors[firstErrorKey][0] || 'Error de validación.');
          } else if (status === 401 || (status === 422 && responseData.message)) {
             // Error de credenciales incorrectas (Laravel devuelve 422 con mensaje general a veces, o 401)
             setError(responseData.message || 'Las credenciales proporcionadas son incorrectas.');
          }
           else {
             // Otro error de la API (ej. 500)
             setError(responseData.message || 'Ocurrió un error en el servidor.');
          }
        } else {
          // Error de red
          setError('No se pudo conectar con el servidor.');
        }
      } else {
        // Otro tipo de error
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 md:text-3xl">
        Inicia sesión en tu cuenta
      </h2>

      {/* Asegúrate de que LoginForm esté descomentado y recibe las props */}
      <LoginForm
         onSubmit={handleLogin}
         isLoading={isLoading}
         error={error}
      />

      <p className="mt-8 text-center text-sm text-gray-500">
        ¿No tienes cuenta?{' '}
        <Link to="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Regístrate aquí
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;