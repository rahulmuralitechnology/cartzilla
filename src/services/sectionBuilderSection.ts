import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { IRequestCustomTheme, IResponse } from "./interfaces/common";

export interface ISectionBuilderData {
  name: string;
  schema: any;
  formData: any;
  status: "draft" | "published";
  storeId: string;
}

interface IAppResponse extends IResponse {
  data: {
    section: any;
  };
}

type ApiResponse = IAppResponse;

class SectionBuilderService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async createSection(data: ISectionBuilderData): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/store/${data.storeId}/request`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new SectionBuilderService(`${appConstant.BACKEND_API_URL}/section`);
