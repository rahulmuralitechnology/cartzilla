import { IProduct } from "../../services/productService";

export interface Product {
  id: string;
  name: string;
  description: string;
  price?: number;
  category: string;
  sku: string;
  stockQuantity: number;
  images: string[];
  status: "published" | "draft";
  specifications: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface ProductFormData extends Omit<IProduct, "createdAt" | "updatedAt"> {}

export interface IProductFilters {
  search: string;
  category: string;
  status: "all" | "published" | "draft";
  sortBy: "name" | "price" | "date";
  sortOrder: "asc" | "desc";
}
