import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { ProductCategoryFormData } from "./interfaces/productCategory";

export type ProductStatus = "DRAFT" | "PUBLISHED";
export type IAvailabilityStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK" | "BACKORDER" | "DISCONTINUED";
export interface ProductVariant {
  name: string;
  price: number;
  strikePrice?: number;
  stock: number;
}

export interface IProduct {
  id: string;
  userId: string;
  storeId: string;
  title: string;
  description: string;
  category: string;
  price?: number;
  strikePrice?: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku?: string;
  weight: number;
  umo?: string;
  umoValue?: string;
  dimensions: Dimensions;
  warrantyInformation: string;
  shippingInformation: string;
  reviews: Review[];
  returnPolicy: string;
  minimumOrderQuantity?: number;
  sellEvenInZeroQuantity: boolean;
  meta: Meta;
  images: string[];
  thumbnail: string;
  status: ProductStatus;
  hsnCode?: string;
  gstRate?: number;
  gstInclusive?: boolean;
  variants?: ProductVariant[];

  reservedStock?: number;
  availableStock?: number;
  reorderLevel?: number;
  availabilityStatus: IAvailabilityStatus;
  lastStockUpdate?: string;
  isTrackingEnabled?: boolean;
}

interface Dimensions {
  width: number;
  height: number;
  depth: number;
}

interface Review {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
  reviewerEmail: string;
}

interface Meta {
  createdAt: string;
  updatedAt: string;
  barcode: string;
  qrCode: string;
}

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;
  // Add other properties as needed based on your API response
}

interface IProductResponse extends IResponse {
  data: {
    errors: { message: string }[];
    products: IProduct[];
    productCategory: ProductCategoryFormData[];
  };
}

type ApiResponse = IProductResponse;

class ProductService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async createProduct(data: IProduct): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/product/create`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async productBulkUpload(data: IProduct[], storeId: string, userId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/product/bulk-upload-products?storeId=${storeId}&userId=${userId}`, {
        products: data,
        storeId: storeId,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async updateProduct(data: IProduct): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.put(`/product/update/${data.id}`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async deleteProduct(productId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.delete(`/product/delete/${productId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  //   ********************** | GET All Product list | **************************
  async getAllProductList({ storeId, userId }: { storeId: string; userId: string }): Promise<IProductResponse> {
    try {
      const response = await this.axiosInstance.get(`/product/get-product-list/?storeId=${storeId}&userId=${userId}&pageSize=1000`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  //   ********************** |  Product Category  | **************************

  async createProductCategory(data: ProductCategoryFormData): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/product-category/create`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async updateProductCategory(data: ProductCategoryFormData): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.put(`/product-category/update/${data.id}`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async deleteProductCategory(id: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.delete(`/product-category/delete/${id}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getAllProductCategoyList(storeId: string): Promise<IProductResponse> {
    try {
      const response = await this.axiosInstance.get(`/product-category/get-all-categories/${storeId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new ProductService(appConstant.BACKEND_API_URL);
