import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { IRequestCustomTheme } from "./interfaces/common";

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;
  // Add other properties as needed based on your API response
}

interface IAppResponse extends IResponse {
  subdomain: string;
  data: IRequestCustomTheme[];
}

export interface RobotsTxt {
  id: string;
  storeId: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  store?: {
    name: string;
    domain: string;
  };
}

interface IRobotTextResponse extends IResponse {
  data: RobotsTxt[];
}

type ApiResponse = IAppResponse;

class AppService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async checkSubdomain(storeName: string): Promise<IAppResponse> {
    try {
      const response = await this.axiosInstance.get(`/domain/checkSubDomain?subDomain=${storeName}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async requestCustomeTheme(data: IRequestCustomTheme): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post("/theme/request", {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getRequestTheme(): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get("/theme/request-list");
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getRobotTxtContent(storeId: string): Promise<IRobotTextResponse> {
    try {
      const response = await this.axiosInstance.get("/robot-txt/store/" + storeId);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async saveRobotTxtContent(payload: RobotsTxt): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/robot-txt/save`, payload);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new AppService(appConstant.BACKEND_API_URL);
