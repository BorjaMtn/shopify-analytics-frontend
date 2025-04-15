import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '@/lib/formatters'; // Importa nuestro formateador
import { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent'; // Tipos de Recharts

// Tipo para los datos que espera el gráfico
interface ChartDataPoint {
  date: string; // Formato 'YYYY-MM-DD'
  sales: number;
}

interface SalesTrendChartProps {
  data: ChartDataPoint[] | null | undefined; // Los datos vienen del backend
}

const SalesTrendChart: React.FC<SalesTrendChartProps> = ({ data }) => {
  // Si no hay datos o están vacíos, muestra un mensaje
  if (!data || data.length === 0) {
    return <div className="flex h-64 items-center justify-center rounded-lg border bg-gray-50 text-gray-500">No hay datos de ventas para mostrar.</div>;
  }

  // Formateador para el eje Y (moneda)
  const yAxisTickFormatter = (value: number) => formatCurrency(value);

  // Formateador para el Tooltip (información al pasar el ratón) - CORREGIDO
const tooltipFormatter = (
    value: ValueType, // <-- Usamos el tipo ValueType de Recharts
    _name: NameType, // <-- Usamos el tipo NameType de Recharts (y mantenemos _)
    props: any // Mantenemos 'any' para props por simplicidad
  ): [string, string | null] | null => {
  
    // Comprobamos si el valor existe y es un número antes de formatear
    if (typeof value !== 'number' || value === null || value === undefined) {
      // Si no es un número válido, podríamos devolver null o un valor por defecto
      return null; // No mostrar tooltip si el valor no es numérico
    }
  
    // props.payload existe si hay un punto de datos activo
    const payload = props?.payload;
    const date = payload?.date;
  
    // Si no tenemos fecha en el payload, tampoco mostramos (o mostramos solo valor)
    if (!date) {
      // Podrías devolver solo el valor formateado si quisieras:
      // return [formatCurrency(value), null];
      return null;
    }
  
    // Formateamos la fecha
    const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
  
    // Formateamos el valor (ahora sabemos que es un número)
    const formattedValue = formatCurrency(value);
    const label = formattedDate; // Usamos la fecha como label
  
    // Devolvemos el array [valor_formateado, label]
    return [formattedValue, label];
  };


  return (
    // ResponsiveContainer hace que el gráfico se ajuste al tamaño de su contenedor padre
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5, // Márgenes para ejes/leyenda
        }}
      >
        {/* Rejilla de fondo */}
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />

        {/* Eje X (Fechas) */}
        <XAxis
          dataKey="date"
          tickFormatter={(dateStr) => new Date(dateStr + 'T00:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} // Formato corto ej. '13 abr'
          tick={{ fontSize: 12, fill: '#6b7280' }} // Estilo de las etiquetas
          padding={{ left: 10, right: 10 }} // Espaciado extra
        />

        {/* Eje Y (Ventas) */}
        <YAxis
           tickFormatter={yAxisTickFormatter} // Usa nuestro formateador de moneda
           tick={{ fontSize: 12, fill: '#6b7280' }}
           width={80} // Ancho para acomodar etiquetas de moneda
        />

        {/* Tooltip al pasar el ratón */}
        <Tooltip formatter={tooltipFormatter} />

        {/* Leyenda (opcional) */}
        {/* <Legend /> */}

        {/* La línea del gráfico */}
        <Line
          type="monotone" // Tipo de curva
          dataKey="sales" // Usa la propiedad 'sales' de nuestros datos
          name="Ventas" // Nombre para tooltip/leyenda
          stroke="#4f46e5" // Color índigo
          strokeWidth={2}
          activeDot={{ r: 6 }} // Punto resaltado al pasar el ratón
          dot={{ r: 3, fill: '#4f46e5' }} // Puntos en cada dato
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SalesTrendChart;