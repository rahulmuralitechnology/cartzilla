import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { IResponse } from "./interfaces/common";
import {
  CreateOrderRequest,
  IShippingServiceability,
  ShipmentData,
  ShiprocketOrderResponse,
  ShiprocketTrackingData,
} from "./interfaces/shippingTypes";

interface IShippingServiceResponse extends IResponse {
  data: {
    available_shipping_companies: IShippingServiceability[];
    shiprocket_order_response: ShiprocketOrderResponse;
    trackingData: ShiprocketTrackingData;
  };
}

type ApiResponse = IShippingServiceResponse;

class ShippingService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): IShippingServiceResponse {
    return response.data;
  }

  async getShippingMethods(data: ShipmentData): Promise<IShippingServiceResponse> {
    try {
      const response = await this.axiosInstance.post(`/serviceability`, data);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async createShippingOrder(data: CreateOrderRequest): Promise<IShippingServiceResponse> {
    try {
      const response = await this.axiosInstance.post(`/create-shipment`, data);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async trackShipment(shipmentId: string): Promise<IShippingServiceResponse> {
    try {
      const response = await this.axiosInstance.get(`/track/${shipmentId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new ShippingService(`${appConstant.BACKEND_API_URL}/shipping`);
