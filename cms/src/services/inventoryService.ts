import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { IRequestCustomTheme, IResponse } from "./interfaces/common";
import { BlogPost } from "./interfaces/blog";
import { IAvailabilityStatus, IProduct, ProductStatus } from "./productService";
import { InventoryStats, Pagination } from "./interfaces/stoctInventory";
import { ProductCategoryFormData } from "./interfaces/productCategory";

interface IInventoryResponse extends IResponse {
  data: {
    products: IProduct[];
    productCategory: ProductCategoryFormData[];
    pagination: Pagination;
    stats: InventoryStats;
  };
}

type ApiResponse = IInventoryResponse;

class InventoryService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): IInventoryResponse {
    return response.data;
  }

  async getStoreInventory(
    storeId: string,
    searchText: string,
    categoryFilter: string,
    statusFilter: string,
    page: number,
    limit: number
  ): Promise<IInventoryResponse> {
    try {
      const response = await this.axiosInstance.get(
        `/store/${storeId}/inventory?searchText=${searchText}&categoryFilter=${categoryFilter}&statusFilter=${statusFilter}&page=${page}&limit=${limit}`
      );
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async updateProductStock(
    productId: string,
    stock: number,
    reorderLevel: number,
    availabilityStatus: IAvailabilityStatus
  ): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.patch(`/product/${productId}`, {
        stock,
        availabilityStatus,
        reorderLevel,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new InventoryService(`${appConstant.BACKEND_API_URL}/invetory`);
