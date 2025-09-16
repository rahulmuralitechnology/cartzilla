// src/types/index.ts
export interface Product {
  id: number;
  title: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: 'new' | 'sale';
  description?: string;
  stock?: number;
  category?: string;
  discount?: number;
}

export interface Category {
  id: number;
  name: string;
  icon: string;
  categoryImage?: string;
  description?: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: number;
  name: string;
  categoryId?: number;
}

export interface Feature {
  id: number;
  title: string;
  description: string;
  icon: string;
}

export interface Video {
  id: number;
  title: string;
  duration: string;
  thumbnail: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}