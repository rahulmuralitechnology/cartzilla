import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { IResponse } from "./interfaces/common";

interface IAddClientUserData {
  username: string;
  organization: string;
  phone: string;
  password: string;
  permissions: string[];
  tenantId: string;
  role: string;
  confirmPassword: string;
  token: string;
}

interface ForgotPasswordData {
  email?: string;
  token?: string;
  newPassword?: string;
}

interface ForgortPasswordResponse extends IResponse {
  data: {
    token: string;
  };
}

type ApiResponse = ForgortPasswordResponse;

class UserService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async forgotPasswordLink(data: ForgotPasswordData): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post("/forgot-password/link", data);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post("/reset-password", data);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async AddClientUser(data: IAddClientUserData): Promise<IResponse> {
    try {
      const response = await this.axiosInstance.post("/add-client-user", data);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async sendAddUserInvitation(email: string, storeId: string, userId: string, role: string): Promise<IResponse> {
    try {
      const response = await this.axiosInstance.post("/add/send-invitation", { email, storeId, userId, role });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new UserService(`${appConstant.BACKEND_API_URL}/user`);
