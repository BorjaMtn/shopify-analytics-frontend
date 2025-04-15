import apiClient from './apiClient';
import type { User } from '@/types/user'; // Asegúrate de que la ruta sea correcta

// --- Tipos de Datos para las Peticiones ---
// (Podríamos moverlos a @/types/auth.ts o similar)

// Datos necesarios para el registro (igual que en RegisterForm)
interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

// Datos necesarios para el login (igual que en LoginForm)
interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

// --- Tipo Esperado para la Respuesta de Login ---
// Basado en lo que devuelve nuestro AuthController en Laravel
interface LoginResponse {
  user: User;
  token: string;
}

// --- Funciones del Servicio ---

/**
 * Envía una petición para registrar un nuevo usuario.
 * @param data Datos del formulario de registro.
 * @returns Promise<User> - El usuario creado devuelto por la API.
 */
const register = async (data: RegisterData): Promise<User> => {
  try {
    // Llama al endpoint POST /register de la API
    // Especificamos que esperamos recibir un objeto User como respuesta
    const response = await apiClient.post<User>('/register', data);
    return response.data; // Devuelve los datos del usuario desde la respuesta
  } catch (error) {
    console.error('Error en authService.register:', error);
    // Relanzamos el error para que sea manejado por el componente que llama
    throw error;
  }
};

/**
 * Envía una petición para iniciar sesión.
 * @param credentials Credenciales del formulario de login.
 * @returns Promise<LoginResponse> - Un objeto con el usuario y el token.
 */
const login = async (credentials: LoginData): Promise<LoginResponse> => {
  try {
    // Llama al endpoint POST /login de la API
    // Especificamos que esperamos recibir un objeto LoginResponse
    const response = await apiClient.post<LoginResponse>('/login', credentials);
    return response.data; // Devuelve { user, token }
  } catch (error) {
    console.error('Error en authService.login:', error);
    throw error;
  }
};

/**
 * Envía una petición para cerrar la sesión del usuario actual.
 * El token se añade automáticamente por el interceptor de apiClient.
 * @returns Promise<void> - No devuelve contenido en caso de éxito.
 */
const logout = async (): Promise<void> => {
  try {
    // Llama al endpoint POST /logout de la API (ruta protegida)
    await apiClient.post('/logout');
    // No necesitamos devolver nada, el éxito es status 204
  } catch (error) {
    console.error('Error en authService.logout:', error);
    throw error;
  }
};

// Exportamos las funciones para poder usarlas en otros lugares
const authService = {
  register,
  login,
  logout,
};

export default authService;