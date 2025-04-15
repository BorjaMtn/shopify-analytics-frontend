import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '@/components/ui/Button'; // Importa el botón reutilizable
import { Link } from 'react-router-dom'; // Para el enlace de "Olvidaste contraseña"

// Tipos para los datos del formulario
type LoginFormData = {
  email: string;
  password: string;
  remember?: boolean; // Checkbox opcional
};

// Props que recibirá el componente
interface LoginFormProps {
  onSubmit: SubmitHandler<LoginFormData>;
  isLoading?: boolean;
  error?: string | null;
}

// Componente reutilizable para el contenedor del input + label + error
// (Podríamos moverlo a /ui si lo usamos mucho)
const InputField: React.FC<{ label: string; id: keyof LoginFormData; children: React.ReactNode; error?: string }> = ({ label, id, children, error }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
            {label}
        </label>
        <div className="mt-2">
            {children}
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
);

const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, isLoading = false, error = null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormData>({ mode: 'onBlur' });

  // Clases base para los inputs (igual que en RegisterForm)
  const inputClasses = (hasError: boolean): string =>
  `block w-full rounded-lg border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ${
    hasError ? 'ring-red-500 focus:ring-red-600' : 'ring-gray-300 focus:ring-indigo-600'
  } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition duration-150 ease-in-out`;


  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <InputField label="Correo Electrónico" id="email" error={errors.email?.message}>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className={inputClasses(!!errors.email)}
          placeholder="tu@email.com"
          {...register('email', {
            required: 'El correo es obligatorio',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Formato de correo inválido'
            }
          })}
        />
      </InputField>

      <InputField label="Contraseña" id="password" error={errors.password?.message}>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className={inputClasses(!!errors.password)}
          placeholder="Tu contraseña"
          {...register('password', {
            required: 'La contraseña es obligatoria',
          })}
        />
      </InputField>

      {/* Fila para "Recordarme" y "Olvidaste contraseña" */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            {...register('remember')} // Registramos el checkbox
          />
          <label htmlFor="remember" className="ml-2 block text-sm text-gray-900">
            Recordarme
          </label>
        </div>

        <div className="text-sm">
          <Link to="/forgot-password" // Necesitaremos crear esta ruta/página más adelante
             className="font-semibold text-indigo-600 hover:text-indigo-500">
            ¿Olvidaste tu contraseña?
          </Link>
        </div>
      </div>

      {/* Mensaje de error general */}
      {error && (
         <div className="rounded-md border border-red-300 bg-red-50 p-3">
             <p className="text-sm font-medium text-red-800">{error}</p>
         </div>
      )}

      {/* Botón de Envío */}
      <div>
        <Button
          type="submit"
          className="w-full"
          variant="primary"
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;