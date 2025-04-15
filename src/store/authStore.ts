import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'; // Asegúrate de importar StateStorage si usas createJSONStorage
import type { User } from '@/types/user'; // Asegúrate de que la ruta sea correcta

// Define la forma del estado (SIN isAuthenticated)
interface AuthState {
  token: string | null;
  user: User | null;
}

// Define las acciones
interface AuthActions {
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// Tipo completo del store
type FullAuthState = AuthState & AuthActions;

// --- AJUSTE CLAVE AQUÍ ---
// Especificamos explícitamente el tipo del estado completo (FullAuthState)
// y el tipo del estado que se persistirá (AuthState) como último argumento genérico.
const useAuthStore = create(
  persist<FullAuthState, [], [], AuthState>( // <--- ¡Cambio aquí! Le decimos que persistimos solo AuthState
    (set) => ({
      // Estado inicial
      token: null,
      user: null,

      // Acciones
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      login: (user, token) => {
        set({ user, token });
      },
      logout: () => {
        set({ user: null, token: null });
      },
    }),
    {
      name: 'auth-storage', // Nombre en localStorage
      storage: createJSONStorage(() => localStorage), // Usa localStorage
      // Partialize ahora devuelve un objeto que coincide con el tipo 'AuthState' que especificamos arriba
      partialize: (state): AuthState => ({ token: state.token, user: state.user }),
    }
  )
);

export default useAuthStore;