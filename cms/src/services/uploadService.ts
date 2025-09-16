import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { ProductCategoryFormData } from "./interfaces/productCategory";

export interface IUploadResponse {
  data: {
    url: string;
  };
}

export interface IResponse extends IUploadResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;

  // Add other properties as needed based on your API response
}

type ApiResponse = IResponse;

class UploadService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async uploadAsset(file: any, contentType: string, filename: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(appConstant.COMMON_SERVICE, {
        path: `/api/upload-file`,
        method: "POST",
        params: {
          fileName: `${new Date().getTime()}-${filename}`,
          contentType: contentType,
        },
      });
      await fetch(response.data.data.url, {
        method: "PUT",
        headers: { "Content-Type": contentType, "x-ms-blob-type": "BlockBlob" },
        body: file.originFileObj,
      });
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error uploading asset:", error);
      throw error;
    }
  }
}

export default new UploadService(appConstant.BACKEND_API_URL);
