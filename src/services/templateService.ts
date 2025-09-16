import axios, { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { IResponse, TemplateType } from "./interfaces/common";
import { Template } from "./interfaces/template";

interface ITemplateResponse extends IResponse {
  data: {
    templates: Template[];
  };
}

class TemplateService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ITemplateResponse>): ITemplateResponse {
    return response.data;
  }

  async createTemplate(data: Template): Promise<ITemplateResponse> {
    try {
      const response = await this.axiosInstance.post(`/template/create`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async updateTemplate(data: Template): Promise<ITemplateResponse> {
    try {
      const response = await this.axiosInstance.put(`/template/update/${data.id}`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async deleteTemplate(templateId: string): Promise<ITemplateResponse> {
    try {
      const response = await this.axiosInstance.delete(`/template/delete/${templateId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getAllTemplates(all?: boolean): Promise<ITemplateResponse> {
    try {
      const response = await this.axiosInstance.get(`/template/list?all=${all}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new TemplateService(appConstant.BACKEND_API_URL);
