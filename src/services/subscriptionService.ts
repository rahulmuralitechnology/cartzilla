import axios, { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { RestaurantConfig, StoreSiteConfig } from "./interfaces/siteConfig";
import { LandingSiteConfig } from "./interfaces/SiteForm";

export interface IResponse {
  success: boolean | string;
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
  isAnnualSubscription?: boolean;
  price: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
}

export type SiteTypeConfig = StoreSiteConfig | LandingSiteConfig | RestaurantConfig;

interface ISiteConfigResponse extends IResponse {
  data: any;
}

type ApiResponse = ISiteConfigResponse;

interface IGetAllPlansResponse extends IResponse {
  data: any[];
}

class ActivatePlan extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async activatePlan(data: IStarteFreePlan): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.put(`/plan/subscription/store/update-plan`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getAllPlans(): Promise<IGetAllPlansResponse> {
    try {
      const response = await this.axiosInstance.get(`/plan/all`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new ActivatePlan(appConstant.BACKEND_API_URL);
