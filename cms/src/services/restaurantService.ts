import axios, { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { MenuItem } from "./interfaces/siteConfig";

export type ISiteType = "website" | "webapp";

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;
  // Add other properties as needed based on your API response
}

interface IMenuItemResponse extends IResponse {
  data: {
    menuList: MenuItem[];
  };
}

type ApiResponse = IMenuItemResponse;

class RestaurantService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async createMenu(data: MenuItem): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/restaurant/add_menu_item`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async buldUploadMenu(data: MenuItem[]): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/restaurant/menu-bulk-upload`, data);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async updateMenu(data: MenuItem): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.put(`/restaurant/update/${data.id}`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async deleteMenu(menuId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.delete(`/restaurant/menu-item/delete/${menuId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getAllMenuList(storeId: string): Promise<IMenuItemResponse> {
    try {
      const response = await this.axiosInstance.get(`/restaurant/get-all-menu/?id=${storeId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new RestaurantService(appConstant.BACKEND_API_URL);
