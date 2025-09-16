import axios, { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { getLocalStorage, parseCookies } from "./utils";
import { IStore } from "./storeService";

export interface IUser {
  id: string;
  userId?: string;
  storeId?: string;
  organizationName?: string;
  email: string;
  createdAt: string;
  firstName: string;
  profileImage?: string;
  isActive?: boolean;
  verified?: boolean;
  isEmailVerified?: boolean;
  phone: string;
  whatsapp?: string;
  profileUrl?: string;
  role: UserRole;
  username: string;
  permissions?: string[];
  Store?: IStore[];
  whatsappOptIn?: boolean;
}

type SUCCESS = "SUCCESS" | "FAILED";

export interface IResponse {
  success: SUCCESS;
  message: string;
  data: {
    customers: IUser[];
    clients: IUser[];
    user: IUser;
    token: string;
    store: number;
    userId?: string;
    totalUsers: number;
  };
  error?: string;
  status?: number;
  info: boolean;
  // Add other properties as needed based on your API response
}

interface loginResponse extends IResponse {
  token: string;
  user: IUser;
  otpSend?: boolean;
}

interface LoginCredentials {
  email: string;
  password: string;
}

export type UserRole = "SUPERADMIN" | "ADMIN" | "CLIENT" | "CUSTOMER" | "USER";

export interface SignupData {
  userId?: string;
  username: string;
  email: string;
  password: string;
  organizationName: string;
  confirmPassword: string;
  role: UserRole;
  otp?: string;
}

interface ForgotPasswordData {
  email: string;
}

type ApiResponse = IResponse;

class AuthService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async login(credentials: LoginCredentials): Promise<loginResponse> {
    try {
      const response = await this.axiosInstance.post<loginResponse>(`/login`, credentials, {
        headers: {
          source: appConstant.SOURCE_TYPE,
        },
      });

      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async signup(data: SignupData): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/register`, data, {
        headers: {
          source: appConstant.SOURCE_TYPE,
        },
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }

  async getUserInfo(): Promise<loginResponse> {
    try {
      const response = await this.axiosInstance.get(`/get-userinfo?storeId=${getLocalStorage(appConstant.SELECTED_STORE_ID)}`);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }
  async userVerifyEmail(otp: string, email: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(
        "/verify-otp",
        {
          otp,
          email,
        },
        {
          headers: {
            source: appConstant.SOURCE_TYPE,
          },
        }
      );
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }

  async activateAccountByAdmin(token: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/activate/account/${token}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }

  async getAllStoreCustomer(storeId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/get-all-customer/${storeId}`, {
        headers: { storeId: storeId },
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }
  async getStoreClients(page: Number, pageSize: number): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/get-all-clients?page=${page}&pageSize=${pageSize}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }
  async getStoreClientUsers(page: Number, pageSize: number, storeId: string, tenantId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/${storeId}/${tenantId}/get-client-user?page=${page}&pageSize=${pageSize}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }

  async updateClient(data: IUser): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/update-user/${data.userId}`, data);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getUserInfoById(userId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/get-userinfo/${userId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }

  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post("/forgot-password/link", data);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw Error(errInfo.error);
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(appConstant.AUTH_TOKEN);
    if (!token) {
      return false;
    }
    return true;
  }

  logout() {
    localStorage.removeItem(appConstant.AUTH_TOKEN);
    localStorage.removeItem(appConstant.SELECTED_STORE_ID);
  }

  isAdmin(): boolean {
    const isSuperAdmin = getLocalStorage("BloomUserInfo")?.role;
    if (true) {
      return true;
    }
    return false;
  }
}

export default new AuthService(`${appConstant.BACKEND_API_URL}/auth`);
