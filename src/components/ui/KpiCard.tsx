import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number | undefined | null;
  subtitle?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  isLoading = false,
  className = '',
}) => {
  const displayValue = isLoading
    ? <div className="h-8 w-24 animate-pulse rounded bg-gray-300"></div> // Buen estado de carga
    : (value === null || value === undefined || value === 'N/A' || value === '') // Añadido chequeo para string vacío
      ? <span className="text-gray-500">N/A</span>
      : value;

  return (
    <div
      // --- Cambios de Estilo ---
      className={`
        overflow-hidden rounded-xl border border-gray-200
        bg-slate-50 shadow-sm // Fondo sutil y sombra base
        transition-shadow duration-200 hover:shadow-lg // Efecto hover mejorado
        ${className}
      `}
      // -----------------------
    >
      <div className="flex items-start justify-between p-4"> {/* Mantenido p-4 */}
        <div className="flex-1">
          <dt className="truncate text-sm font-medium text-gray-500">
            {title}
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {displayValue}
          </dd>
          {/* Subtítulo (sin cambios) */}
          {subtitle && !isLoading && (
            <p className="mt-1 truncate text-xs text-gray-500">
              {subtitle}
            </p>
          )}
        </div>
        {/* --- Contenedor del Icono (Estilo Neutralizado) --- */}
        {icon && (
          <div className="ml-4 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
             {/* El icono en sí debería tener su color/tamaño definido al pasarlo como prop */}
             {/* Ejemplo: <MiIcono className="h-6 w-6 text-blue-600" /> */}
            {icon}
          </div>
        )}
         {/* --------------------------------------------- */}
      </div>
    </div>
  );
};

export default KpiCard;