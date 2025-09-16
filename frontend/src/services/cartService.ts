import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface CartItem {
  id: number;
  name: string;
  price: number;
  oldPrice?: number;
  color: string;
  model: string;
  quantity: number;
  image: string;
  productId: string;
}

export interface Cart {
  id: string;
  userId: string;
  storeId: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  discount?: number;
  discountCode?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartResponse {
  success: string;
  data: {
    cart: Cart;
    activeCart?: Cart;
  };
  message?: string;
}

// Get user's cart
export const getCart = async (userId: string): Promise<CartResponse> => {
  try {
    const response = await api.get(`/cart/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching cart:', error);
    throw error;
  }
};

// Add or update item in cart
export const addOrUpdateCartItem = async (
  userId: string,
  storeId: string,
  productId: string,
  quantity: number,
  price: number,
  name: string,
  images: string[]
) => {
  try {
    const response = await api.post('/cart/create', {
      userId,
      storeId,
      productId,
      quantity,
      price,
      name,
      images,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding/updating cart item:', error);
    throw error;
  }
};

// Remove item from cart
export const removeCartItem = async (cartItemId: string) => {
  try {
    const response = await api.delete(`/cart/item/${cartItemId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing cart item:', error);
    throw error;
  }
};

// Clear entire cart
export const clearCart = async (userId: string) => {
  try {
    const response = await api.delete(`/cart/clear/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
};

// Apply discount code
export const applyDiscount = async (userId: string, discountCode: string) => {
  try {
    const response = await api.post('/cart/apply-discount', {
      userId,
      discountCode,
    });
    return response.data;
  } catch (error) {
    console.error('Error applying discount:', error);
    throw error;
  }
};

export default api;