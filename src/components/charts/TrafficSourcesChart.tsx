// src/components/charts/TrafficSourcesChart.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { GaTrafficSource } from '@/types/api';
interface TrafficSourcesChartProps {
  data: GaTrafficSource[] | null | undefined;
}

// Colores de ejemplo (puedes definirlos mejor o generarlos)
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const TrafficSourcesChart: React.FC<TrafficSourcesChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex h-full items-center justify-center text-gray-500">No hay datos de fuentes de tráfico disponibles.</div>;
  }

  // Asegúrate de que los datos tengan sesiones > 0 para que el gráfico sea útil
  const filteredData = data.filter(item => item.sessions > 0);

  if (filteredData.length === 0) {
      return <div className="flex h-full items-center justify-center text-gray-500">No hay sesiones registradas por canal.</div>;
  }


  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={filteredData}
          cx="50%"
          cy="50%"
          labelLine={false}
          // label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // Etiqueta opcional en el gráfico
          outerRadius={80}
          fill="#8884d8"
          dataKey="sessions" // La clave que representa el valor de cada sección
          nameKey="channel"  // La clave que representa el nombre de cada sección
        >
          {filteredData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value: number) => `${value.toLocaleString('es-ES')} sesiones`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default TrafficSourcesChart;