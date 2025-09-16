// src/lib/api.ts
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_MASTER_API_URL;

// Define interface for product params
interface ProductParams {
  page?: number;
  limit?: number;
  category?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  // Add other possible parameters as needed
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const productAPI = {
  getProducts: (params?: ProductParams) => 
    api.get(`/product/get-product-list/?storeId=${process.env.NEXT_PUBLIC_STORE_ID}`, { params }),
  
  getProduct: (id: number) => 
    api.get(`/product/get-product/${id}?storeId=${process.env.NEXT_PUBLIC_STORE_ID}`),
};

export const categoryAPI = {
  getCategories: () => 
    api.get(`/product-category/get-all-categories/${process.env.NEXT_PUBLIC_STORE_ID}`),
  
  getCategory: (id: number) => 
    api.get(`/product-category/get-category/${id}?storeId=${process.env.NEXT_PUBLIC_STORE_ID}`),
};

export default api;