import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from 'axios';
// ¡Importamos nuestro store de autenticación!
import useAuthStore from '@/store/authStore';

// URL Base (sin cambios)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
console.log(`API Base URL: ${API_BASE_URL}`);

// Instancia de Axios (sin cambios)
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// --- INTERCEPTORES ---

// >>> Interceptor de Petición (ACTUALIZADO) <<<
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // console.log('Starting Request:', config.method?.toUpperCase(), config.url); // Log opcional

    // --- LÓGICA PARA AÑADIR TOKEN ---
    // Obtenemos el estado actual del store (usamos getState porque estamos fuera de un componente React)
    const token = useAuthStore.getState().token;

    // Si existe un token y la petición tiene cabeceras (siempre debería)
    if (token && config.headers) {
      // Añadimos la cabecera Authorization con el Bearer token
      config.headers.Authorization = `Bearer ${token}`;
      // console.log('Token added to request headers.'); // Log opcional
    } else {
      // console.log('No token found, request sent without Authorization header.'); // Log opcional
    }
    // --------------------------------

    return config; // Devuelve la configuración modificada (o sin modificar si no hay token)
  },
  (error: AxiosError) => {
    // console.error('Request Error Interceptor:', error); // Log opcional
    // Si hay un error al configurar la petición, lo rechazamos
    return Promise.reject(error);
  }
);

// Interceptor de Respuesta (sin cambios por ahora, lo configuraremos mejor después)
apiClient.interceptors.response.use(
  (response) => {
    // console.log('Response Received:', response.status, response.config.url); // Log opcional
    return response;
  },
  (error: AxiosError) => {
    console.error('Response Error Interceptor:', {
        status: error.response?.status,
        url: error.config?.url,
        message: error.message,
        // responseData: error.response?.data // Cuidado al loguear data sensible
    });

    if (error.response?.status === 401) {
      console.warn('Unauthorized (401) detected by interceptor.');
      const { logout } = useAuthStore.getState(); // Obtenemos la acción logout
      logout(); // Llamamos a logout para limpiar el estado
    
      if (window.location.pathname !== '/login') {
         console.log('Redirecting to /login due to 401.');
         window.location.href = '/login'; // O usar el router si está disponible
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;