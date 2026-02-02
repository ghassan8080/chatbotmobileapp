import axios, { AxiosInstance, AxiosError } from 'axios';
import { config, API_ENDPOINTS } from '../config/api.config';
import { Product, ProductFormData, ApiResponse } from '../types/product';

class ApiService {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: config.apiBaseUrl,
            timeout: config.apiTimeout,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor - add API key to all requests
        this.client.interceptors.request.use(
            (requestConfig) => {
                if (config.apiKey) {
                    requestConfig.headers['X-API-Key'] = config.apiKey;
                }

                // Add timestamp for request signing
                requestConfig.headers['X-Request-Time'] = new Date().toISOString();

                if (config.enableDebugLogs) {
                    console.log('API Request:', {
                        url: requestConfig.url,
                        method: requestConfig.method,
                        data: requestConfig.data,
                    });
                }

                return requestConfig;
            },
            (error) => {
                if (config.enableDebugLogs) {
                    console.error('Request Error:', error);
                }
                return Promise.reject(error);
            }
        );

        // Response interceptor - handle errors
        this.client.interceptors.response.use(
            (response) => {
                if (config.enableDebugLogs) {
                    console.log('API Response:', response.data);
                }
                return response;
            },
            (error: AxiosError) => {
                if (config.enableDebugLogs) {
                    console.error('Response Error:', error.response?.data || error.message);
                }
                return Promise.reject(this.handleError(error));
            }
        );
    }

    private handleError(error: AxiosError): Error {
        if (error.response) {
            // Server responded with error status
            const message = (error.response.data as any)?.message ||
                'حدث خطأ في الخادم';
            return new Error(message);
        } else if (error.request) {
            // Request made but no response
            return new Error('فشل الاتصال بالخادم. تحقق من اتصال الإنترنت');
        } else {
            // Something else happened
            return new Error(error.message || 'حدث خطأ غير متوقع');
        }
    }

    // Get all products (if endpoint exists, otherwise products come from initial HTML render)
    async getProducts(): Promise<Product[]> {
        try {
            const response = await this.client.get<ApiResponse<Product[]>>(
                API_ENDPOINTS.GET_PRODUCTS
            );
            return response.data.data || [];
        } catch (error) {
            console.warn('Get products not implemented, using static data');
            return [];
        }
    }

    // Add new product
    async addProduct(data: ProductFormData): Promise<ApiResponse> {
        try {
            const response = await this.client.post<ApiResponse>(
                API_ENDPOINTS.ADD_PRODUCT,
                data
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Update existing product
    async updateProduct(productId: number, data: ProductFormData): Promise<ApiResponse> {
        try {
            const payload = {
                ...data,
                product_id: productId,
            };

            const response = await this.client.post<ApiResponse>(
                API_ENDPOINTS.UPDATE_PRODUCT,
                payload
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }

    // Delete product
    async deleteProduct(productId: number): Promise<ApiResponse> {
        try {
            const response = await this.client.post<ApiResponse>(
                API_ENDPOINTS.DELETE_PRODUCT,
                { product_id: productId }
            );
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}

export default new ApiService();
