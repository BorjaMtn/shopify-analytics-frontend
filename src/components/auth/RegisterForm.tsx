import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import Button from '@/components/ui/Button'; // Importa el botón reutilizable

// Tipos para los datos del formulario
type RegisterFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

// Props que recibirá el componente
interface RegisterFormProps {
  onSubmit: SubmitHandler<RegisterFormData>;
  isLoading?: boolean;
  error?: string | null;
}

// Componente reutilizable para el contenedor del input + label + error
const InputField: React.FC<{ label: string; id: keyof RegisterFormData; children: React.ReactNode; error?: string }> = ({ label, id, children, error }) => (
    <div>
        <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
            {label}
        </label>
        <div className="mt-2"> {/* Añadido margen superior para separar del label */}
            {children}
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>} {/* Margen superior para error */}
    </div>
);


const RegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, isLoading = false, error = null }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm<RegisterFormData>({ mode: 'onBlur' }); // Añadimos mode: 'onBlur' para validar al perder foco

  const passwordValue = watch('password');

  // Clases base para los inputs, un poco más estilizadas
  const inputClasses = (hasError: boolean): string =>
    `block w-full rounded-lg border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ${
      hasError ? 'ring-red-500 focus:ring-red-600' : 'ring-gray-300 focus:ring-indigo-600'
    } placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6 transition duration-150 ease-in-out`;


  return (
    // Cambiamos space-y-6 por flex flex-col gap-y-6 para control más fino si quisiéramos
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <InputField label="Nombre Completo" id="name" error={errors.name?.message}>
        <input
          id="name"
          type="text"
          autoComplete="name"
          className={inputClasses(!!errors.name)}
          placeholder="Tu Nombre Apellido"
          {...register('name', { required: 'El nombre es obligatorio' })}
        />
      </InputField>

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
          autoComplete="new-password"
          className={inputClasses(!!errors.password)}
          placeholder="Mínimo 8 caracteres"
          {...register('password', {
            required: 'La contraseña es obligatoria',
            minLength: { value: 8, message: 'Debe tener al menos 8 caracteres' }
            // Aquí podríamos añadir las reglas complejas del backend si las tenemos en el frontend
          })}
        />
        <p className="mt-1 text-xs text-gray-500">Debe incluir mayúsculas, minúsculas, números y símbolos.</p>
      </InputField>

      <InputField label="Confirmar Contraseña" id="password_confirmation" error={errors.password_confirmation?.message}>
        <input
          id="password_confirmation"
          type="password"
          autoComplete="new-password"
          className={inputClasses(!!errors.password_confirmation)}
          placeholder="Repite la contraseña"
          {...register('password_confirmation', {
            required: 'Confirma tu contraseña',
            validate: value =>
              value === passwordValue || 'Las contraseñas no coinciden'
          })}
        />
      </InputField>

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
          className="w-full" // El botón ya es flex y justify-center por defecto
          variant="primary" // Aseguramos que usa el estilo primario
          isLoading={isLoading}
          disabled={isLoading}
        >
          {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>
      </div>
    </form>
  );
};

export default RegisterForm;