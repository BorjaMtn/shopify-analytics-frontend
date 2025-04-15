// En src/types/index.ts (o src/types/user.ts)
export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string | null; // Puede ser null si no está verificado
    created_at?: string;
    updated_at?: string;
    // Añade aquí cualquier otro campo que tu API devuelva para el usuario
  }