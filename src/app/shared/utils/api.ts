const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://18.225.149.199';
export class ApiService {
    private static instance: ApiService;

    private constructor() { }

    public static getInstance(): ApiService {
        if (!ApiService.instance) {
            ApiService.instance = new ApiService();
        }
        return ApiService.instance;
    }

    private async makeRequest<T>(
        endpoint: string,
        options: RequestInit = {}
    ): Promise<T> {
        const url = `${API_BASE_URL}${endpoint}`;

        const defaultHeaders: Record<string, string> = {
            'Content-Type': 'application/json',
        };

        // Add token if exists
        const token = localStorage.getItem('ezpark_token');
        if (token) {
            defaultHeaders['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            headers: { ...defaultHeaders, ...options.headers },
            ...options,
        };

        console.log(`🌐 API Request to ${endpoint}:`, {
            method: config.method || 'GET',
            headers: config.headers,
            body: config.body ? JSON.parse(config.body as string) : null
        });

        try {
            const response = await fetch(url, config);

            console.log(`📡 Response from ${endpoint}:`, {
                status: response.status,
                statusText: response.statusText,
                ok: response.ok
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                    console.error(`❌ Error data from ${endpoint}:`, errorData);
                    // Log details array specifically if it exists
                    if (errorData.details && Array.isArray(errorData.details)) {
                        console.error(`🔍 Error details:`, errorData.details);
                        errorData.details.forEach((detail: any, index: number) => {
                            console.error(`  ${index + 1}. ${detail}`);
                        });
                    }
                } catch (parseError) {
                    console.error(`❌ Error parsing response from ${endpoint}:`, parseError);
                    errorData = { message: `Error ${response.status}: ${response.statusText}` };
                }

                // Si el backend devuelve un mensaje de error específico, usarlo
                let errorMessage = `Error ${response.status}: ${response.statusText}`;

                if (errorData.message) {
                    errorMessage = errorData.message;
                } else if (errorData.details && Array.isArray(errorData.details)) {
                    errorMessage = errorData.details.join(', ');
                } else if (errorData.code) {
                    errorMessage = `${errorData.code}: ${errorData.message || 'Error desconocido'}`;
                }

                throw new Error(errorMessage);
            }

            // Verificar si la respuesta tiene contenido para parsear
            const contentLength = response.headers.get('content-length');
            const contentType = response.headers.get('content-type');

            // Si la respuesta está vacía (204 No Content o content-length 0), retornar null
            if (response.status === 204 || contentLength === '0' || !contentType?.includes('application/json')) {
                console.log(`✅ Success response from ${endpoint}: Empty response (${response.status})`);
                return null as T;
            }

            try {
                const responseData = await response.json();
                console.log(`✅ Success response from ${endpoint}:`, responseData);
                return responseData;
            } catch (parseError) {
                // Si no puede parsear JSON pero la respuesta fue exitosa, asumir que es una respuesta vacía
                console.log(`✅ Success response from ${endpoint}: Empty or non-JSON response`);
                return null as T;
            }

        } catch (error) {
            console.error(`💥 API Error (${endpoint}):`, error);

            // Si es un error de red
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error('Error de conexión. Verifica tu conexión a internet.');
            }

            // Si es nuestro error personalizado, mantenerlo
            if (error instanceof Error) {
                throw error;
            }

            // Error genérico
            throw new Error('Ocurrió un error inesperado');
        }
    }

    async get<T>(endpoint: string): Promise<T> {
        return this.makeRequest<T>(endpoint, { method: 'GET' });
    }

    async post<T>(endpoint: string, data: any): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async put<T>(endpoint: string, data: any): Promise<T> {
        return this.makeRequest<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async delete<T>(endpoint: string): Promise<T> {
        return this.makeRequest<T>(endpoint, { method: 'DELETE' });
    }
}

export const apiService = ApiService.getInstance();