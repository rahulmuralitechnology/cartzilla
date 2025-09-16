import axios, { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
interface ICreateSiteProps {
  domain: string;
  storeId: string;
  storeCategory: string;
  operation: string;
  siteType: string;
  uniqueId?: string;
}

export type IOperation = "create" | "update" | "delete";

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;
  // Add other properties as needed based on your API response
}

interface IAppResponse extends IResponse {}

type ApiResponse = IAppResponse;

class SiteService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async createSite(siteInfo: ICreateSiteProps): Promise<IAppResponse> {
    try {
      const response = await this.axiosInstance.post(
        `/store/create-site?storeId=${siteInfo.storeId}&storeCategory=${siteInfo.storeCategory}&operation=${
          siteInfo.operation
        }&environment=${import.meta.env.VITE_API_ENV}&type=${siteInfo.siteType}&domain=${siteInfo.domain}&uniqueId=${siteInfo.uniqueId}`,
        siteInfo
      );
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async validateCustomDomain(customeDoamain: string, ipAddress: string): Promise<IAppResponse> {
    try {
      const response = await this.axiosInstance.get(`/store/validate-custom-domain?domain=${customeDoamain}&ipAddress=${ipAddress}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new SiteService(appConstant.BACKEND_API_URL);
