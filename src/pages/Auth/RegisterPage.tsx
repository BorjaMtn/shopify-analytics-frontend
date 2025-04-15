import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import RegisterForm from '@/components/auth/RegisterForm';
import authService from '@/services/authService'; // <-- Importamos el servicio
import { isAxiosError } from 'axios'; // <-- Importamos type guard de Axios

// Tipo de datos del formulario (sin cambios)
type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null); // Para errores generales

  // --- Función handleRegister ACTUALIZADA ---
  const handleRegister = async (data: RegisterFormData) => {
    console.log('Enviando datos de registro a la API:', data);
    setIsLoading(true);
    setError(null); // Limpiamos errores previos

    try {
      // Llamamos a la función register de nuestro servicio
      const createdUser = await authService.register(data);

      console.log('Usuario registrado con éxito:', createdUser);
      // Idealmente, mostrar una notificación de éxito en lugar de alert
      alert(`¡Registro exitoso para ${createdUser.name}! Serás redirigido al login.`);
      navigate('/login'); // Redirige a la página de login

    } catch (err) {
      console.error('Error durante el registro:', err);
      // Verificamos si es un error de Axios para acceder a detalles
      if (isAxiosError(err)) {
        if (err.response) {
          // Error desde la API (ej. 422 Validación, 500 Server Error)
          const responseData = err.response.data;
          if (err.response.status === 422 && responseData.errors) {
            // Si es un error de validación 422 de Laravel, mostramos el primer error
            const firstErrorKey = Object.keys(responseData.errors)[0];
            setError(responseData.errors[firstErrorKey][0] || 'Error de validación.');
          } else {
            // Otro error de la API (ej. 500) o mensaje general
            setError(responseData.message || 'Ocurrió un error en el servidor.');
          }
        } else {
          // Error de red (no se pudo conectar, etc.)
          setError('No se pudo conectar con el servidor. Revisa tu conexión.');
        }
      } else {
        // Otro tipo de error (inesperado)
        setError('Ocurrió un error inesperado.');
      }
    } finally {
      // Nos aseguramos de quitar el estado de carga al final
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-8 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900 md:text-3xl">
        Crea tu cuenta nueva
      </h2>

      {/* Pasamos el error general al formulario (el form ahora lo muestra) */}
      <RegisterForm
          onSubmit={handleRegister}
          isLoading={isLoading}
          error={error}
      />

      <p className="mt-8 text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{' '}
        <Link to="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;