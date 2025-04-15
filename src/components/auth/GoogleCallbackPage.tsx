import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '@/services/apiClient';
import { isAxiosError } from 'axios';

const GoogleCallbackPage: React.FC = () => {
    const [message, setMessage] = useState<string>('Procesando autenticación de Google...');
    const [isError, setIsError] = useState<boolean>(false);
    const location = useLocation(); // Hook para leer la URL actual (incluyendo query params)
    const navigate = useNavigate(); // Hook para redirigir

    useEffect(() => {
        const processCallback = async () => {
            // Extraer parámetros 'code' y 'error' de la URL (ej. /callback?code=ABC&state=XYZ)
            const params = new URLSearchParams(location.search);
            const code = params.get('code');
            const errorParam = params.get('error');
            // TODO: const state = params.get('state'); // Extraer y verificar state por seguridad

            // 1. Comprobar si Google devolvió un error
            if (errorParam) {
                console.error('Error en callback de Google:', errorParam);
                setMessage(`Error de Google: ${errorParam}. Serás redirigido...`);
                setIsError(true);
                // Esperar un poco y volver a onboarding/settings
                setTimeout(() => navigate('/onboarding'), 4000);
                return;
            }

            // 2. Comprobar si tenemos el código de autorización
            if (!code) {
                console.error('Callback de Google sin código ni error.');
                setMessage('Respuesta inválida de Google. Serás redirigido...');
                setIsError(true);
                setTimeout(() => navigate('/onboarding'), 4000);
                return;
            }

            // 3. Si tenemos código, enviarlo al backend
            try {
                setMessage('Verificando código con nuestro servidor...');
                console.log('Enviando código al backend:', code);

                // Hacemos POST al endpoint del backend que espera el código
                // apiClient añade el token Bearer del usuario automáticamente
                const response = await apiClient.post('/connect/google/callback', { code });

                // 4. Manejar respuesta del backend
                console.log('Respuesta del backend al callback:', response.data);
                setMessage(response.data.message || '¡Google Analytics conectado con éxito! Redirigiendo al dashboard...');
                setIsError(false);
                // Redirigir al dashboard tras éxito
                setTimeout(() => navigate('/dashboard'), 2500); // Un poco más de tiempo para leer el mensaje

            } catch (err) {
                // 5. Manejar error del backend
                console.error('Error al enviar código al backend:', err);
                let backendErrorMessage = 'Error al finalizar la conexión con Google.';
                 if (isAxiosError(err) && err.response) {
                    // Usamos el mensaje de error que devuelve nuestro backend
                    backendErrorMessage = err.response.data?.message || backendErrorMessage;
                 }
                setMessage(backendErrorMessage + ' Serás redirigido...');
                setIsError(true);
                // Redirigir a onboarding (o settings) si falla el guardado del token
                setTimeout(() => navigate('/onboarding'), 4000);
            }
        };

        // Ejecutamos el proceso al cargar la página
        processCallback();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]); // Solo se ejecuta cuando cambia la location (al cargar la página)

    // --- Renderizado ---
    // Muestra un mensaje de estado mientras se procesa el callback
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-center">
             {/* Podríamos añadir un spinner aquí */}
             <svg className="mb-4 h-12 w-12 animate-spin text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <h1 className="mb-4 text-xl font-semibold text-gray-800">Conectando con Google...</h1>
            <p className={`text-lg ${isError ? 'text-red-600' : 'text-gray-700'}`}>
                {message}
            </p>
        </div>
    );
};

export default GoogleCallbackPage;