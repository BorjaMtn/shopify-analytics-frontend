/**
 * Formatea un número como moneda en Euros.
 * @param value El número a formatear (puede ser null o undefined)
 * @returns El valor formateado como string (ej. "€1,234.56") o "N/A".
 */
export const formatCurrency = (value: number | null | undefined): string => {
    if (value === null || value === undefined) {
      return 'N/A';
    }
    // Intl.NumberFormat es la forma estándar de JS para formato de números/moneda
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR', // Puedes cambiar a otra moneda si es necesario
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };
  
  // Puedes añadir más funciones de formato aquí (fechas, números grandes, etc.)
  // En src/lib/formatters.ts

/**
 * Formatea un número como porcentaje.
 * @param value El número a formatear (puede ser null o undefined)
 * @param fractionDigits Número de decimales a mostrar. Por defecto 1.
 * @returns El valor formateado como string (ej. "12.3%") o "N/A".
 */
export const formatPercentage = (
  value: number | null | undefined,
  fractionDigits: number = 1
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return 'N/A';
  }
  // Intl.NumberFormat es ideal para esto también
  return new Intl.NumberFormat('es-ES', { // Usa tu locale preferido
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  }).format(value / 100); // ¡Importante! Intl espera un valor decimal (0.123), no el porcentaje directo (12.3)
};

