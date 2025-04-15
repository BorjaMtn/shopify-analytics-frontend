// src/components/dashboard/InventoryInsights.tsx
import React from 'react';
import { ExclamationTriangleIcon, TagIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

// Importar el tipo (ajusta la ruta si es necesario)
import type { InventoryInsight } from '@/types/api'; // Asegúrate de que la ruta sea correcta

interface InventoryInsightsProps {
  insights: InventoryInsight[] | null | undefined;
  isLoading: boolean; // Pasar el estado de carga general
}

const InventoryInsights: React.FC<InventoryInsightsProps> = ({ insights, isLoading }) => {

  // Nota: El backend devuelve [] tanto si no hay insights como si falta tracking view_item.
  // Mostramos una nota sobre view_item si el array está vacío pero GA está conectado.
  const showTrackingNote = !isLoading && insights?.length === 0;
  // Podríamos hacer la lógica más compleja si el backend devolviera un status específico.

  // No mostrar nada si está cargando, o si no hay insights y no aplica la nota de tracking
  if (isLoading || (!insights && !showTrackingNote)) {
     // Se podría poner un skeleton aquí si se prefiere
    return null;
  }

  return (
    <section aria-labelledby="inventory-insights-title">
      <h2 id="inventory-insights-title" className="text-lg font-medium text-gray-700 mb-3">
        Alertas de Inventario y Tráfico
      </h2>

      {/* Mensaje si no hay insights (y tracking podría faltar) */}
      {showTrackingNote && (
         <div className="rounded-lg bg-blue-50 p-4 border border-blue-200">
              <div className="flex">
                <div className="flex-shrink-0">
                    <InformationCircleIcon className="h-5 w-5 text-blue-400" aria-hidden="true" />
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">
                    <p className="text-sm text-blue-700">
                        No se han detectado alertas de inventario o tráfico para el período seleccionado.
                        <span className="block sm:ml-2 sm:inline-block">
                            (Nota: Esta función requiere el evento 'view_item' de GA4 E-commerce para máxima precisión).
                        </span>
                    </p>
                </div>
              </div>
          </div>
      )}

      {/* Lista de Insights si existen */}
      {insights && insights.length > 0 && (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm border border-gray-200">
          <ul role="list" className="divide-y divide-gray-200">
            {insights.map((insight) => (
              <li key={insight.productId} className="px-4 py-4 sm:px-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                   {/* Icono y Status */}
                   <div className="flex-shrink-0 flex items-center">
                     {insight.status === 'stockout_risk' ? (
                       <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-1.5" aria-hidden="true"/>
                     ) : (
                       <TagIcon className="h-5 w-5 text-yellow-500 mr-1.5" aria-hidden="true" /> // Icono para promoción
                     )}
                     <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                        insight.status === 'stockout_risk' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                     }`}>
                       {insight.status === 'stockout_risk' ? 'Riesgo Stockout' : 'Potencial Promo'}
                     </span>
                   </div>
                   {/* Nombre y Mensaje */}
                   <div className="min-w-0 flex-1">
                     <p className="truncate text-sm font-medium text-gray-900">{insight.productName}</p>
                     <p className="truncate text-sm text-gray-500">{insight.message}</p>
                   </div>
                   {/* Stock y Vistas */}
                   <div className="flex-shrink-0 text-sm text-gray-700 text-left sm:text-right">
                     <div>Stock: <span className="font-medium">{insight.stock}</span></div>
                     <div>Vistas: <span className="font-medium">{insight.views}</span></div>
                   </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default InventoryInsights;