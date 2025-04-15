// src/pages/DashboardPage.tsx
import React, { useState, useEffect } from 'react';
import apiClient from '@/services/apiClient'; // Asume que está configurado
import { isAxiosError } from 'axios';
import KpiCard from '@/components/ui/KpiCard'; // Asume ruta correcta
import { formatCurrency, formatPercentage } from '@/lib/formatters'; // Asume ruta correcta
import SalesTrendChart from '@/components/charts/SalesTrendChart'; // Asume ruta correcta
import TrafficSourcesChart from '@/components/charts/TrafficSourcesChart'; // Asume ruta correcta
import InventoryInsights from '@/components/dashboard/InventoryInsights'; // <<<--- 1. IMPORTADO

// --- Importar Heroicons ---
import {
    BuildingStorefrontIcon, ListBulletIcon, CurrencyEuroIcon, ChartBarIcon,
    UsersIcon, CursorArrowRaysIcon, ScaleIcon, InformationCircleIcon, ExclamationCircleIcon // Añadidos para mensajes
} from '@heroicons/react/24/outline';
// ------------------------

// --- Interfaces (Idealmente importar desde src/types/api.ts) ---
// Tipos existentes...
interface SalesTrendPoint { date: string; sales: number; }
interface ShopifyMetrics { shop_name: string | null; total_orders_period: number | null; paid_sales_period: number | null; aov_period: number | null; sales_trend_period: SalesTrendPoint[] | null; }
interface GaTrafficSource { channel: string; sessions: number; }
type GaSimpleMetricKey = 'sessions_period' | 'active_users_period';
interface GaMetrics { sessions_period: number | null; active_users_period: number | null; traffic_sources_period: GaTrafficSource[] | null; error?: string | null; }
interface CalculatedMetrics { conversion_rate_period: number | null; }
interface PeriodInfo { label: string; start_date: string; end_date: string; }
interface DashboardData { user_name: string; connections: { shopify_connected: boolean; ga4_connected: boolean; ga4_property_set: boolean; }; shopify_metrics: ShopifyMetrics | null; ga_metrics: GaMetrics | null; calculated_metrics: CalculatedMetrics | null; period: PeriodInfo; }

// Tipo para Inventory Insights (Asegúrate que la ruta es correcta)
import type { InventoryInsight } from '@/types/api'; // <<<--- 1. IMPORTADO TIPO

// -------------------------

const DashboardPage: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedPeriod, setSelectedPeriod] = useState<string>('7d'); // O el valor por defecto que prefieras

    // --- 2. NUEVO ESTADO para los insights ---
    const [inventoryInsightsData, setInventoryInsightsData] = useState<InventoryInsight[] | null>(null);
    // Opcional: Estado de error específico para insights si quieres manejarlo diferente
    const [insightsError, setInsightsError] = useState<string | null>(null);
    // ------------------------------------

    // --- 3. Hook para obtener datos (MODIFICADO) ---
    useEffect(() => {
        const fetchData = async (periodToFetch: string) => {
            setIsLoading(true);
            setError(null);
            setInventoryInsightsData(null); // Resetea al cargar
            setInsightsError(null); // Resetea error específico

            try {
                // Llamada principal para datos del dashboard
                const response = await apiClient.get<DashboardData>(`/dashboard?period=${periodToFetch}`);
                console.log(`Respuesta Dashboard recibida (Periodo: ${periodToFetch}):`, response.data);
                setData(response.data);

                // --- LLAMADA ADICIONAL para Inventory Insights ---
                // ¡¡¡ AJUSTA ESTE ENDPOINT A TU BACKEND !!!
                try {
                    const insightsResponse = await apiClient.get<{ insights: InventoryInsight[] }>(`/inventory-insights?period=${periodToFetch}`);
                    console.log(`Respuesta Insights recibida (Periodo: ${periodToFetch}):`, insightsResponse.data);
                    // Validar si insights es un array antes de guardar
                    if (Array.isArray(insightsResponse.data.insights)) {
                         setInventoryInsightsData(insightsResponse.data.insights);
                    } else {
                        console.warn("La respuesta de insights no contenía un array:", insightsResponse.data);
                        setInventoryInsightsData([]); // Asumir vacío si la estructura no es correcta
                    }

                } catch (insightsErr) {
                    console.error(`Error fetching inventory insights for period ${periodToFetch}:`, insightsErr);
                    setInsightsError('No se pudieron cargar las alertas de inventario.'); // Mensaje de error específico
                    setInventoryInsightsData([]); // Poner vacío para que el componente muestre su mensaje "no hay insights"
                }
                // --------------------------------------------------

            } catch (err) {
                console.error(`Error fetching dashboard data for period ${periodToFetch}:`, err);
                let errorMessage = 'Ocurrió un error al cargar los datos.';
                if (isAxiosError(err)) {
                    if (err.response) {
                        errorMessage = err.response.data?.message || `Error ${err.response.status} desde el servidor.`;
                    } else {
                        errorMessage = 'No se pudo conectar con el servidor.';
                    }
                }
                setError(errorMessage); // Error general
                setData(null); // Limpia datos principales
                setInventoryInsightsData(null); // Limpia insights en error general
            } finally {
                setIsLoading(false);
            }
        };

        fetchData(selectedPeriod); // Llama con el período actual en estado

    }, [selectedPeriod]); // Se re-ejecuta cuando selectedPeriod cambia


    // --- Renderizado Condicional (Loading State Mejorado) ---
    if (isLoading && !data) { // Muestra skeleton solo en la carga inicial
        return ( <div className="space-y-8 animate-pulse"> <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4"> {Array.from({ length: 8 }).map((_, index) => ( /* Incrementado a 8 para incluir hueco visual para insights */ <div key={index} className="h-32 rounded-xl bg-gray-200"></div> ))} </div> <div className="grid grid-cols-1 gap-6 lg:grid-cols-3"> <div className="h-80 rounded-lg bg-gray-200 lg:col-span-2"></div> <div className="h-80 rounded-lg bg-gray-200 lg:col-span-1"></div> </div> <div className="h-40 rounded-lg bg-gray-200"></div> {/* Skeleton para insights */} </div> );
    }

    // --- Renderizado Error Principal ---
    if (error && !data) { // Muestra error solo si no hay datos previos
        return <div className="rounded-md border border-red-300 bg-red-50 p-4 text-center text-red-800">Error al cargar: {error}</div>;
    }

    // --- Renderizado Exitoso (O Parcial si hay error de insights) ---
    if (data) {
        const {
            user_name, connections, shopify_metrics, ga_metrics, calculated_metrics, period
        } = data;
        const shopifyConnected = connections.shopify_connected;
        const gaReady = connections.ga4_connected && connections.ga4_property_set;
        const gaErrorMessage = gaReady ? ga_metrics?.error : null;

        // --- Helpers (sin cambios, asegúrate que funcionan con tus datos) ---
        const getShopifyValue = (key: keyof Omit<ShopifyMetrics, 'sales_trend_period'>, formatter?: (value: number | null | undefined) => string): string | number => {
            if (!shopifyConnected) return 'No Conectado';
            if (!shopify_metrics) return 'N/A';
            const value = shopify_metrics[key];
            if (value === null || value === undefined) return 'N/A';
            if (Array.isArray(value)) return 'N/A'; // Seguridad
            return formatter && typeof value === 'number' ? formatter(value) : value.toString();
        };
        const getGaSimpleValue = (key: GaSimpleMetricKey, formatter?: (value: number | null | undefined) => string): string | number => {
            if (!gaReady) return 'No Configurado';
            if (gaErrorMessage) return 'Error GA';
            if (!ga_metrics) return 'N/A';
            const value = ga_metrics[key];
            if (value === null || value === undefined) return 'N/A';
            if (Array.isArray(value)) return 'N/A'; // Seguridad
            return formatter && typeof value === 'number' ? formatter(value) : value.toString();
        };
        const getCalculatedValue = (key: keyof CalculatedMetrics, formatter?: (value: number | null | undefined) => string): string | number => {
            if (!shopifyConnected || !gaReady) return 'N/A';
            if (gaErrorMessage) return 'N/A'; // Si GA tiene error, calculada tampoco funciona
            if (!calculated_metrics) return 'N/A';
            const value = calculated_metrics[key];
            if (value === null || value === undefined) return 'N/A';
            return formatter && typeof value === 'number' ? formatter(value) : value.toString();
        };
        // --------------------------------------------------------

        const periodDisplayLabels: { [key: string]: string } = {
             '7d': 'Últimos 7 días', // Añadir etiquetas para los valores usados
             '30d': 'Últimos 30 días',
             'this_month': 'Este mes',
             'last_month': 'Mes anterior',
             // Añade más si usas otros valores
             // Fallback por si 'period.label' no coincide:
             [period.label]: period.label // Usa la etiqueta del backend si no hay mapeo
         };
        const displayPeriodLabel = periodDisplayLabels[selectedPeriod] || period.label; // Usar selectedPeriod para consistencia

        return (
            <div className="space-y-8">
                {/* --- Cabecera y Selector de Periodo --- */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">
                        Bienvenido, {user_name}!
                    </h1>
                    {/* Selector de Periodo */}
                    <div className="flex space-x-2 flex-wrap">
                         {['7d', '30d', 'this_month', 'last_month'].map((p) => (
                             <button
                                 key={p}
                                 onClick={() => setSelectedPeriod(p)}
                                 disabled={isLoading} // Deshabilitar mientras carga CUALQUIER dato
                                 className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
                                     selectedPeriod === p
                                         ? 'bg-indigo-600 text-white shadow-sm'
                                         : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                                 } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                             >
                                 {periodDisplayLabels[p] || p}
                             </button>
                         ))}
                     </div>
                </div>

                {/* --- Sección de KPIs --- */}
                <section aria-labelledby="kpi-title">
                    <h2 id="kpi-title" className="sr-only">Indicadores Clave</h2>
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {/* Shopify KPIs */}
                         <KpiCard title="Tienda Shopify" value={getShopifyValue('shop_name')} subtitle={shopifyConnected?(shopify_metrics?.shop_name??''):'Necesita conexión'} icon={<BuildingStorefrontIcon className="h-6 w-6 text-gray-600" />} isLoading={isLoading} className={!shopifyConnected?'opacity-60':''} />
                         <KpiCard title="Pedidos Totales" value={getShopifyValue('total_orders_period')} subtitle={displayPeriodLabel} icon={<ListBulletIcon className="h-6 w-6 text-gray-600" />} isLoading={isLoading} className={!shopifyConnected?'opacity-60':''} />
                         <KpiCard title="Ventas Pagadas" value={getShopifyValue('paid_sales_period', formatCurrency)} subtitle={displayPeriodLabel} icon={<CurrencyEuroIcon className="h-6 w-6 text-green-600" />} isLoading={isLoading} className={!shopifyConnected?'opacity-60':''} />
                         <div title="Importe medio de los pedidos pagados">
                            <KpiCard title="Valor Medio Pedido" value={getShopifyValue('aov_period', formatCurrency)} subtitle={displayPeriodLabel} icon={<ScaleIcon className="h-6 w-6 text-blue-600" />} isLoading={isLoading} className={!shopifyConnected?'opacity-60':''} />
                         </div>
                         {/* Google Analytics KPIs */}
                         <KpiCard title="Sesiones" value={getGaSimpleValue('sessions_period')} subtitle={displayPeriodLabel} icon={<ChartBarIcon className="h-6 w-6 text-purple-600" />} isLoading={isLoading} className={!gaReady ? 'opacity-60' : ''} />
                         <KpiCard title="Usuarios Activos" value={getGaSimpleValue('active_users_period')} subtitle={displayPeriodLabel} icon={<UsersIcon className="h-6 w-6 text-purple-600" />} isLoading={isLoading} className={!gaReady ? 'opacity-60' : ''} />
                         {/* Calculated KPIs */}
                         <div title="Porcentaje de sesiones que resultaron en un pedido">
                              <KpiCard title="Tasa Conversión" value={getCalculatedValue('conversion_rate_period', formatPercentage)} subtitle={displayPeriodLabel} icon={<CursorArrowRaysIcon className="h-6 w-6 text-teal-600" />} isLoading={isLoading} className={(!shopifyConnected || !gaReady || gaErrorMessage) ? 'opacity-60': ''}/>
                          </div>
                    </div>
                </section>

                {/* --- Sección de Avisos (Conexiones / Errores GA) --- */}
                {(!isLoading && (!shopifyConnected || !gaReady || gaErrorMessage || error)) && ( // Añadido error general aquí también
                    <div className={`rounded-lg p-4 shadow-sm border ${error || gaErrorMessage ? 'bg-red-50 border-red-200 text-red-700' : 'bg-yellow-50 border-yellow-200 text-yellow-700'}`}>
                        <div className="flex">
                            <div className="flex-shrink-0">
                                {error || gaErrorMessage ? (
                                    <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                                ) : (
                                    <InformationCircleIcon className="h-5 w-5 text-yellow-400" aria-hidden="true" />
                                )}
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium">
                                    {error ? "Error Principal" : gaErrorMessage ? "Error de Google Analytics" : "Atención Requerida"}
                                </h3>
                                <div className="mt-2 text-sm">
                                    {error && <p>{error}</p>}
                                    {gaErrorMessage && <p>{gaErrorMessage}</p>}
                                    {!shopifyConnected && <p>Conecta tu tienda Shopify para ver todas las métricas.</p>}
                                    {!gaReady && shopifyConnected && <p>Configura Google Analytics 4 para obtener datos de tráfico y conversión.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* --- Sección de Gráficos --- */}
                <section aria-labelledby="charts-title">
                    <h2 id="charts-title" className="sr-only">Visualizaciones</h2>
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Gráfico de Tendencia de Ventas */}
                         {shopifyConnected && shopify_metrics?.sales_trend_period ? (
                             <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6 lg:col-span-2 border border-gray-200">
                                 <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Tendencia de Ventas ({displayPeriodLabel})</h3>
                                 <div className="h-72 w-full">
                                     {shopify_metrics.sales_trend_period.length > 0 ? (
                                         <SalesTrendChart data={shopify_metrics.sales_trend_period} />
                                     ) : (
                                         <div className="flex h-full items-center justify-center text-sm text-gray-500">No hay datos de tendencia para este período.</div>
                                     )}
                                 </div>
                             </div>
                         ) : shopifyConnected && !isLoading ? (
                               <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6 lg:col-span-2 flex items-center justify-center text-sm text-gray-500 h-80 border border-gray-200">No se pudo cargar la tendencia de ventas.</div>
                         ) : null }

                        {/* Gráfico de Fuentes de Tráfico */}
                         {gaReady && !gaErrorMessage && ga_metrics?.traffic_sources_period ? (
                             <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6 lg:col-span-1 border border-gray-200">
                                 <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Fuentes de Tráfico ({displayPeriodLabel})</h3>
                                 <div className="h-72 w-full">
                                      {ga_metrics.traffic_sources_period.length > 0 ? (
                                          <TrafficSourcesChart data={ga_metrics.traffic_sources_period} />
                                      ) : (
                                           <div className="flex h-full items-center justify-center text-sm text-gray-500">No hay datos de tráfico para este período.</div>
                                      )}
                                 </div>
                             </div>
                         ) : gaReady && !gaErrorMessage && !isLoading ? (
                                <div className="rounded-lg bg-white p-4 shadow-sm sm:p-6 lg:col-span-1 flex items-center justify-center text-sm text-gray-500 h-80 border border-gray-200">No se pudieron cargar las fuentes de tráfico.</div>
                           ) : null }
                    </div>
                </section>

                {/* --- 4. SECCIÓN DE INVENTORY INSIGHTS --- */}
                {insightsError ? ( // Muestra error específico si existe
                     <div className="rounded-md border border-red-300 bg-red-50 p-4 text-center text-sm text-red-700">
                         {insightsError}
                     </div>
                 ) : ( // Si no hay error específico, renderiza el componente (que gestionará su propio loading/empty state)
                     <InventoryInsights
                        insights={inventoryInsightsData} // Pasa los datos del estado
                        isLoading={isLoading && inventoryInsightsData === null} // Pasa true si estamos cargando Y aún no hay datos de insights
                     />
                 )}
                {/* --------------------------------------- */}

            </div> // Fin del space-y-8
        );
    }

    // Fallback si data es null después de cargar (poco probable si no hay error, pero por seguridad)
    if (!isLoading && !error) {
       return <div className="text-center p-10">No se pudieron cargar los datos del dashboard.</div>;
    }

    // Si isLoading es true pero ya hay 'data' (ej. recargando por cambio de periodo),
    // no se renderiza nada aquí, se usa el estado 'isLoading' en los botones/componentes para feedback visual.
    return null; // Evitar renderizado vacío si ninguna condición anterior se cumple
};

export default DashboardPage;