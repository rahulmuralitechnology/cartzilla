import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { DashboardStats } from "./interfaces/dashboard";

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  data: {
    stats: DashboardStats | null;
  };
  status?: number;
  // Add other properties as needed based on your API response
}

interface IAppResponse extends IResponse {}

type ApiResponse = IAppResponse;

class DashboardService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async getDashboardStats(): Promise<IAppResponse> {
    try {
      // Simulate API delay
      const response = await this.axiosInstance.get("/dashboard/stats");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getStoreStats(storeId: string): Promise<IAppResponse> {
    try {
      // Simulate API delay
      const response = await this.axiosInstance.get(`/dashboard/store-stats/${storeId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new DashboardService(appConstant.BACKEND_API_URL);
