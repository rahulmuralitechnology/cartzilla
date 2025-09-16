import axios, { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { IBloomi5LandingPage, RestaurantConfig, StoreSiteConfig } from "./interfaces/siteConfig";
import { LandingSiteConfig } from "./interfaces/SiteForm";
import { ScriptItem } from "./interfaces/common";

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;
}

export interface IERPNextConfiguration {
  apiKey: string;
  apiSecret: string;
  baseUrl: string;
  id?: string;
  storeId?: string;
}

interface IErpConfigResponse extends IResponse {
  data: IERPNextConfiguration;
}

interface ITestConnectionResponse extends IResponse {
  valid: boolean;
  user?: string;
  version?: string;
}

type ApiResponse = IErpConfigResponse;

class ERPNextService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async saveERPConfig(data: IERPNextConfiguration): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/erp-config/save`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getERPConfig(storeId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/erp-config/store/${storeId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  
  async erpSyncData(data: { storeId: string; tables: ["products", "categories", "customers"] }): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/erp-data/sync`, { ...data });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async saveCustomScript(storeId: string, scripts: ScriptItem[]): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/customscript/save-custom-script`, {
        storeId,
        scripts,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getCustomScript(storeId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/customscript/get-custom-script/${storeId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  
  // Test ERPNext connection through backend to avoid CORS issues
  async testConnection(config: IERPNextConfiguration): Promise<ITestConnectionResponse> {
    try {
      const response = await this.axiosInstance.post<ITestConnectionResponse>(`/erp-config/test-connection`, {
        ...config,
      });
      
      return response.data;
    } catch (error: any) {
      console.error("ERPNext connection test failed:", error);
      
      if (error.response) {
        // The request was made and the server responded with a status code
        return error.response.data;
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error("No response from server. Please check your backend service.");
      } else {
        // Something happened in setting up the request that triggered an Error
        throw new Error(`Connection test failed: ${error.message}`);
      }
    }
  }
}

export default new ERPNextService(appConstant.BACKEND_API_URL);