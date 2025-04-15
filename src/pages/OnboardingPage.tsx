import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiClient from '@/services/apiClient';
import Button from '@/components/ui/Button';
import { isAxiosError } from 'axios';

const OnboardingPage: React.FC = () => {
    const navigate = useNavigate();

    // Estados Shopify
    const [shopDomain, setShopDomain] = useState('');
    const [shopifyAccessToken, setShopifyAccessToken] = useState('');
    const [isShopifyLoading, setIsShopifyLoading] = useState(false);
    const [shopifyError, setShopifyError] = useState<string | null>(null);
    const [shopifySuccess, setShopifySuccess] = useState<string | null>(null);

    // Estados Google
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const [googleError, setGoogleError] = useState<string | null>(null);

    // GA Property ID
    const [gaPropertyId, setGaPropertyId] = useState('');
    const [isGaPropLoading, setIsGaPropLoading] = useState(false);
    const [gaPropError, setGaPropError] = useState<string | null>(null);
    const [gaPropSuccess, setGaPropSuccess] = useState<string | null>(null);

    // Handlers (sin cambios)
    const handleShopifySubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); setIsShopifyLoading(true); setShopifyError(null); setShopifySuccess(null);
        if (!shopDomain.includes('.myshopify.com')) {
            setShopifyError('El formato del dominio debe ser "tu-tienda.myshopify.com"');
            setIsShopifyLoading(false); return;
        }
        if (!shopifyAccessToken.startsWith('shp') || shopifyAccessToken.length < 30) {
            setShopifyError('El token de acceso no parece válido.');
            setIsShopifyLoading(false); return;
        }
        try {
            const response = await apiClient.post('/connect/shopify/token', {
                shop_domain: shopDomain,
                access_token: shopifyAccessToken,
            });
            setShopifySuccess(response.data.message || '¡Tienda Shopify conectada con éxito!');
            setTimeout(() => { navigate('/dashboard'); }, 2000);
        } catch (err) {
            console.error('Error al guardar conexión Shopify:', err);
            if (isAxiosError(err)) {
                if (err.response) {
                    setShopifyError(err.response.data.message || 'Error del servidor al guardar la conexión.');
                } else {
                    setShopifyError('No se pudo conectar con el servidor.');
                }
            } else {
                setShopifyError('Ocurrió un error inesperado.');
            }
        } finally {
            setIsShopifyLoading(false);
        }
    };

    const handleConnectGoogleClick = async () => {
        setIsGoogleLoading(true);
        setGoogleError(null);
        try {
            const response = await apiClient.get<{ authorization_url: string }>('/connect/google');
            const googleAuthUrl = response.data.authorization_url;
            if (googleAuthUrl) {
                window.location.href = googleAuthUrl;
            } else {
                throw new Error('No se recibió la URL de autorización de Google.');
            }
        } catch (err) {
            console.error('Error al iniciar conexión con Google:', err);
            let errorMessage = 'Error al iniciar la conexión con Google.';
            if (isAxiosError(err) && err.response) {
                errorMessage = err.response.data.message || errorMessage;
            }
            setGoogleError(errorMessage);
            setIsGoogleLoading(false);
        }
    };

    const handleSaveGaPropertyId = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsGaPropLoading(true);
        setGaPropError(null);
        setGaPropSuccess(null);

        if (!gaPropertyId.startsWith('properties/') || !/^\d+$/.test(gaPropertyId.split('/')[1])) {
            setGaPropError('Formato inválido. Debe ser "properties/123456789".');
            setIsGaPropLoading(false);
            return;
        }

        try {
            const response = await apiClient.put('/connect/google/property', {
                property_id: gaPropertyId
            });
            setGaPropSuccess(response.data.message || 'ID de Propiedad GA4 guardado.');
        } catch (err) {
            console.error('Error al guardar GA Property ID:', err);
            let errorMessage = 'Error al guardar el ID de Propiedad.';
            if (isAxiosError(err) && err.response) {
                errorMessage = err.response.data?.message || errorMessage;
                if (err.response.status === 404) {
                    errorMessage = 'Primero conecta tu cuenta de Google Analytics.';
                }
            }
            setGaPropError(errorMessage);
        } finally {
            setIsGaPropLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-12 py-10 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-6">
                Configura tus Integraciones
            </h1>

            {/* Shopify */}
            <section className="rounded-2xl bg-white p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">1. Conectar tu Tienda Shopify</h2>
                <p className="text-gray-600 text-sm mb-6">
                    Ingresa el dominio y tu token de acceso de Admin API para conectar tu tienda.
                </p>
                <form onSubmit={handleShopifySubmit} className="space-y-4">
                    <div>
                        <label htmlFor="shopDomain" className="block text-sm font-medium text-gray-700">Dominio Shopify</label>
                        <input
                            id="shopDomain"
                            value={shopDomain}
                            onChange={(e) => setShopDomain(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="ejemplo.myshopify.com"
                        />
                    </div>
                    <div>
                        <label htmlFor="accessToken" className="block text-sm font-medium text-gray-700">Token de Acceso</label>
                        <textarea
                            id="accessToken"
                            rows={3}
                            value={shopifyAccessToken}
                            onChange={(e) => setShopifyAccessToken(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="Pega aquí el token 'shp...'"
                        />
                    </div>
                    {shopifyError && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                            {shopifyError}
                        </div>
                    )}
                    {shopifySuccess && (
                        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                            {shopifySuccess}
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isShopifyLoading}
                        disabled={isShopifyLoading || !!shopifySuccess}
                    >
                        {isShopifyLoading ? 'Guardando...' : 'Guardar Conexión Shopify'}
                    </Button>
                </form>
            </section>

            {/* Google */}
            <section className="rounded-2xl bg-white p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">2. Conectar Google Analytics</h2>
                <p className="text-gray-600 text-sm mb-6">
                    Autoriza tu cuenta de Google Analytics para sincronizar datos de tráfico.
                </p>
                {googleError && (
                    <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200 mb-4">
                        {googleError}
                    </div>
                )}
                <Button
                    type="button"
                    className="w-full"
                    variant="primary"
                    onClick={handleConnectGoogleClick}
                    isLoading={isGoogleLoading}
                    disabled={isGoogleLoading}
                >
                    {isGoogleLoading ? 'Redirigiendo...' : 'Conectar con Google'}
                </Button>
                <p className="mt-4 text-center text-xs text-gray-500">Serás redirigido a Google para autorizar el acceso.</p>
            </section>

            {/* GA Property ID */}
            <section className="rounded-2xl bg-white p-8 shadow-lg border border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">3. Configurar Propiedad GA4</h2>
                <p className="text-gray-600 text-sm mb-6">
                    Ingresa el ID de la propiedad GA4 que deseas monitorear (ej. <code>properties/123456789</code>).
                </p>
                <form onSubmit={handleSaveGaPropertyId} className="space-y-4">
                    <div>
                        <label htmlFor="gaPropertyId" className="block text-sm font-medium text-gray-700">ID de Propiedad GA4</label>
                        <input
                            id="gaPropertyId"
                            type="text"
                            value={gaPropertyId}
                            onChange={(e) => setGaPropertyId(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-4 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            placeholder="properties/123456789"
                        />
                    </div>
                    {gaPropError && (
                        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                            {gaPropError}
                        </div>
                    )}
                    {gaPropSuccess && (
                        <div className="rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
                            {gaPropSuccess}
                        </div>
                    )}
                    <Button
                        type="submit"
                        className="w-full"
                        isLoading={isGaPropLoading}
                        disabled={isGaPropLoading || !!gaPropSuccess}
                    >
                        {isGaPropLoading ? 'Guardando...' : 'Guardar ID Propiedad GA4'}
                    </Button>
                </form>
            </section>

            {/* Link al dashboard */}
            <div className="text-center">
                <Link to="/dashboard" className="text-sm font-medium text-indigo-600 hover:underline">
                    Ir al Dashboard
                </Link>
            </div>
        </div>
    );
};

export default OnboardingPage;
