import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IProductFilters } from "../types/product";
import { IProduct } from "../../services/productService";
import { ProductCategoryFormData } from "../../services/interfaces/productCategory";

interface ProductState {
  products: IProduct[];
  loading: boolean;
  error: string | null;
  filters: IProductFilters;
  selectedProducts: string[];
  productCategory: ProductCategoryFormData[];
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  filters: {
    search: "",
    category: "",
    status: "all",
    sortBy: "date",
    sortOrder: "desc",
  },
  selectedProducts: [],
  productCategory: [],
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      state.products = action.payload;
    },
    addProduct: (state, action: PayloadAction<IProduct>) => {
      state.products.push(action.payload);
    },
    updateProduct: (state, action: PayloadAction<IProduct>) => {
      const index = state.products.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = action.payload;
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter((p) => p.id !== action.payload);
    },
    setFilters: (state, action: PayloadAction<Partial<IProductFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSelectedProducts: (state, action: PayloadAction<string[]>) => {
      state.selectedProducts = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setProductCategory: (state, action: PayloadAction<ProductCategoryFormData[]>) => {
      state.productCategory = action.payload;
    },
  },
});

export const {
  setProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  setFilters,
  setSelectedProducts,
  setLoading,
  setError,
  setProductCategory,
} = productSlice.actions;

export default productSlice.reducer;
