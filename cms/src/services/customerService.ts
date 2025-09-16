import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { IRequestCustomTheme } from "./interfaces/common";
import { CustomerProfile } from "./interfaces/customerDetail";

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;
  // Add other properties as needed based on your API response
}

interface IAppResponse extends IResponse {
  data: CustomerProfile;
}

type ApiResponse = IAppResponse;

class CustomerService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async getCustomerInfoById(userId: string): Promise<IAppResponse> {
    try {
      const response = await this.axiosInstance.get(`/customer/info/${userId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new CustomerService(appConstant.BACKEND_API_URL);
