export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    seller_id: number;
    image_url_1?: string;
    image_url_2?: string;
    image_url_3?: string;
    image_url_4?: string;
    created_at?: string;
    updated_at?: string;
}

export interface ProductFormData {
    name: string;
    description: string;
    price: number;
    seller_id: number;
    image_base64_1?: string;
    image_name_1?: string;
    image_base64_2?: string;
    image_name_2?: string;
    image_base64_3?: string;
    image_name_3?: string;
    image_base64_4?: string;
    image_name_4?: string;
    product_id?: number; // For updates
}

export interface ApiResponse<T = any> {
    success: boolean;
    message: string;
    data?: T;
}

export interface ProductImage {
    uri: string;
    name: string;
    base64?: string;
    type?: string;
}
