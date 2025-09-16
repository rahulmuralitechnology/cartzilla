import axios, { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { EmailNotificationProps } from "./interfaces/emailNotification";
import { Reservation } from "./interfaces/restaurant";
import { ISiteType, TemplateVersion, WebAppType, WebsiteType } from "./interfaces/common";
import { SubscriptionPlan } from "./subscriptionValidation";
import { PaymentConfig } from "../component/PaymentMethod/PaymentMehod";

export type DomainValidation = "waiting" | "validating" | "success" | "failed";
export type DomainAddStatus = "waiting" | "adding" | "success" | "failed";

export interface TemplateItem {
  key: WebAppType | WebsiteType;
  value: string;
  image: string;
}

export interface IStore {
  name: string;
  description: string;
  logo: string;
  storeCategory: WebAppType | WebsiteType;
  subdomain: string;
  storeId?: string;
  createdAt?: string;
  updatedAt?: string;
  isPublished?: boolean;
  publishUrl?: string;
  previewUrl?: string;
  appType?: string;
  siteType: ISiteType;
  userId?: string;
  buildStatus?: boolean;
  paymentStatus?: string;
  subscriptionEndDate?: string;
  subscriptionStartDate?: string;
  subscriptionPlan?: SubscriptionPlan;
  subscriptionPlanId?: string;
  currentVersion?: string;
  latestVersion?: string;
  favicon?: string;
  isCustomDomain?: boolean;
  customDomain?: {
    record: {
      cname?: string;
      txt?: string;
    };
    hostname: string;
    added: DomainAddStatus;
    validated: DomainValidation;
  };
  ipAddress?: string;
  domain?: string;
  uniqueId?: string;
  hostname?: string;
  id?: string;
}

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;
  // Add other properties as needed based on your API response
}

interface IStoreResponse extends IResponse {
  data: {
    stores: IStore[];
    store: IStore;
    versions: TemplateVersion[];
    shippingInfo: IShippingInfo;
  };
}
interface IEmailResponse extends IResponse {
  data: EmailNotificationProps[];
}
interface IReservaionResponse extends IResponse {
  data: Reservation[];
}
interface IPaymentMehodResponse extends IResponse {
  paymentMethods: PaymentConfig;
}

type ApiResponse = IStoreResponse;

interface IShiprocketAuthInfo {
  email: string;
  password: string;
  storeId: string;
}

export interface IShippingInfo {
  shippingCost: number;
  storeId?: string;
  id?: string;
}

class ProductService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async createStore(data: IStore, couponCode: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post("/store/create", {
        ...data,
        couponCode,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async updateStore(data: IStore): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.put(`/store/update/${data.id}`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async deleteStore(storeId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.delete(`/store/${storeId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  //   ********************** | GET All Store list | **************************
  async getAllStoreList(): Promise<IStoreResponse> {
    try {
      const response = await this.axiosInstance.get(`/store/list`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getAllStoreByUserId(userId: string): Promise<IStoreResponse> {
    try {
      const response = await this.axiosInstance.get(`/store/user/${userId}/list`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getTemplateVersion(): Promise<IStoreResponse> {
    try {
      const response = await this.axiosInstance.get(`/store/get-store-version`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getStoreById(storeId: string): Promise<IStoreResponse> {
    try {
      const response = await this.axiosInstance.get(`/store/get/${storeId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getAllStoreEmails(storeId: string): Promise<IEmailResponse> {
    try {
      const response = await this.axiosInstance.get(`/email/contact-emails/${storeId}`);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getAllReservation(storeId: string): Promise<IReservaionResponse> {
    try {
      const response = await this.axiosInstance.get(`/email/reservation/${storeId}`);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async savePaymentMethod(data: PaymentConfig): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post("/store/add-payment-method", {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async saveShiprocketAuthInfo(data: IShiprocketAuthInfo): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post("/store/save-shiprocket-auth", {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async saveShippingInfo(data: IShippingInfo): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post("/shipping-info/save", {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getShippingInfo(storeId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.get(`/shipping-info/get/${storeId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getPymentMethodInfo(storeId: string): Promise<IPaymentMehodResponse> {
    try {
      const response = await this.axiosInstance.get(`/store/get-paymentmethod/${storeId}`);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async applyCouponCode(storeId: string): Promise<IPaymentMehodResponse> {
    try {
      const response = await this.axiosInstance.get(`/store/get-paymentmethod/${storeId}`);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async assignUserToStore(userId: string, storeId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.put(`/store/assign/${storeId}`, {
        userId,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new ProductService(appConstant.BACKEND_API_URL);
