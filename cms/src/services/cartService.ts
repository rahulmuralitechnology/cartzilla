import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { AbandonedCart, ActiveCart, PendingPaymentOrder } from "./interfaces/common";

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;

  // Add other properties as needed based on your API response
}

interface ICartResponse extends IResponse {
  data: {
    abandonedCarts: AbandonedCart[];
    carts: ActiveCart[];
  };
}

interface PendingPaymentCart extends IResponse {
  data: PendingPaymentOrder[];
}

type ApiResponse = ICartResponse | PendingPaymentCart;

class CartService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async getAllAbandonedCarts(storeId: string): Promise<ICartResponse> {
    try {
      const response = await this.axiosInstance.get(`/cart/abandoned-carts/${storeId}`);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getAllActiveCarts(storeId: string): Promise<ICartResponse> {
    try {
      const response = await this.axiosInstance.get(`/cart/list/active/${storeId}`);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getAllPendingPaymentCarts(storeId: string): Promise<PendingPaymentCart> {
    try {
      const response = await this.axiosInstance.get(`/order/store/${storeId}/pending-payments`);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new CartService(appConstant.BACKEND_API_URL);
