import axios, { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { Discount } from "./interfaces/common";

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;
  // Add other properties as needed based on your API response
}
interface IStarteFreePlan {
  userId: string;
  storeId: string;
  planId: string;
}

interface DiscountCreateResponse extends IResponse {
  data: Discount[];
}

type ApiResponse = DiscountCreateResponse;

class DiscountService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async createDiscountCoupon(data: Discount): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/cart/discount/add`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async updateDiscountCoupon(data: Discount): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.put(`/cart/discount/update`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async deleteDiscountCoupon(code: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.delete(`/cart/discount/${code}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getDiscountCouponList(storeId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/cart/discount/store/${storeId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new DiscountService(appConstant.BACKEND_API_URL);
