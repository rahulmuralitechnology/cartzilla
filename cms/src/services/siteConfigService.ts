import axios, { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { IBloomi5LandingPage, RestaurantConfig, StoreSiteConfig } from "./interfaces/siteConfig";
import { LandingSiteConfig } from "./interfaces/SiteForm";
import { ScriptItem } from "./interfaces/common";
import { CodeSnippets } from "./interfaces/CodeSnippets";

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;
  // Add other properties as needed based on your API response
}

export type SiteTypeConfig = StoreSiteConfig | LandingSiteConfig | RestaurantConfig | IBloomi5LandingPage;

interface ISiteConfigResponse extends IResponse {
  data: {
    siteConfig: SiteTypeConfig;
    scripts: CodeSnippets[];
  };
}

type ApiResponse = ISiteConfigResponse;

class SiteConfigService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async saveSiteConfig(data: SiteTypeConfig): Promise<ApiResponse> {
    try {
      // console.log("data", data);
      // return {
      //   success: true,
      //   data: {
      //     siteConfig: data,
      //     scripts: [],
      //   },
      // };

      const response = await this.axiosInstance.post(`/site/save-site-config`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getSiteConfig(storeId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/site/get-site-config/?storeId=${storeId}`);
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
}

export default new SiteConfigService(appConstant.BACKEND_API_URL);
