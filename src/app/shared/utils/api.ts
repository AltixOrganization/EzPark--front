// Cambia la URL base - Swagger UI no es tu API
const API_BASE_URL = 'http://localhost:8080'; // ❌ Era: 'http://localhost:8080/swagger-ui/index.html'

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

        const defaultHeaders = {
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

            const responseData = await response.json();
            console.log(`✅ Success response from ${endpoint}:`, responseData);
            return responseData;

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