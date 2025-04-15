// (Idealmente en src/types/api.ts o un archivo dedicado)

export interface ShopifyShopInfo {
    name: string | null;
    domain: string | null;
    // Añade otros campos si los necesitas/devuelves desde getShopInfo
  }
  
  export interface SalesTrendPoint {
    date: string; // "YYYY-MM-DD"
    sales: number;
  }
  
  export interface ShopifyMetrics {
    shop_name: string | null;
    total_orders_last_7_days: number | null;
    paid_sales_last_7_days: number | null;
    aov_last_7_days: number | null; // Nuevo
    sales_trend_last_7_days: SalesTrendPoint[] | null;
  }
  
  export interface GaTrafficSource {
    channel: string;
    sessions: number;
  }
  
  export interface GaMetrics {
    sessions_last_7_days: number | null;
    active_users_last_7_days: number | null;
    traffic_sources_last_7_days: GaTrafficSource[] | null; // Nuevo
    error?: string | null; // Mantenemos el campo de error por si acaso
  }
  
  export interface CalculatedMetrics {
    conversion_rate_last_7_days: number | null; // Nuevo
  }
  
  export interface PeriodInfo {
    label: string;
    start_date: string;
    end_date: string;
  }
  
  export interface DashboardData {
    user_name: string;
    connections: {
      shopify_connected: boolean;
      ga4_connected: boolean;
      ga4_property_set: boolean; // Nuevo
    };
    shopify_metrics: ShopifyMetrics | null; // Clave actualizada
    ga_metrics: GaMetrics | null;         // Clave actualizada
    calculated_metrics: CalculatedMetrics | null; // Clave nueva
    period: PeriodInfo;                  // Clave nueva
  }

  export interface InventoryInsight {
    productId: string | number;
    productName: string;
    status: 'stockout_risk' | 'promotion_candidate'; // Tipos de estado posibles
    stock: number;
    views: number;
    message: string; // Mensaje descriptivo del backend
  }