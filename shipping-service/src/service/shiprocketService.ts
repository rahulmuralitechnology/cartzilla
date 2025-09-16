import axios, { AxiosInstance } from "axios";
import {
  ShiprocketAuth,
  ShiprocketToken,
  CreateOrderRequest,
  ShiprocketOrderResponse,
  CourierServiceability,
  ShiprocketTrackingData,
  PickupLocation,
  ShippingAddress,
} from "./interface/shiprocketType";

export class ShiprocketService {
  private api: AxiosInstance;
  private token: string | null = null;
  private baseURL = "https://apiv2.shiprocket.in/v1/external";

  constructor() {
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include auth token
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  async authenticate(credentials: ShiprocketAuth): Promise<ShiprocketToken> {
    try {
      const response = await this.api.post("/auth/login", credentials);
      this.token = response.data.token;
      return response.data;
    } catch (error: any) {
      throw new Error(`Authentication failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async createOrder(orderData: CreateOrderRequest): Promise<ShiprocketOrderResponse> {
    try {
      if (!this.token) {
        throw new Error("Not authenticated. Please login first.");
      }

      const response = await this.api.post("/orders/create/adhoc", orderData);
      return response.data;
    } catch (error: any) {
      throw new Error(`Order creation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async getOrderDetails(orderId: string): Promise<any> {
    try {
      const response = await this.api.get(`/orders/show/${orderId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to get order details: ${error.response?.data?.message || error.message}`);
    }
  }

  async trackShipment(shipmentId: string): Promise<ShiprocketTrackingData> {
    try {
      const response = await this.api.get(`/courier/track/shipment/${shipmentId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to track shipment: ${error.response?.data?.message || error.message}`);
    }
  }

  async checkServiceability(pickupPostcode: string, deliveryPostcode: string, weight: number): Promise<CourierServiceability> {
    try {
      const params = {
        pickup_postcode: Number(pickupPostcode),
        delivery_postcode: Number(deliveryPostcode),
        cod: 1, // Cash on delivery enabled
        weight,
        qc_check: 1,
      };

      const response = await this.api.get("/courier/serviceability", { params });
      return response.data.data;
    } catch (error: any) {
      throw new Error(`Serviceability check failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async generateAWB(shipmentId: number, courierCompanyId: number): Promise<any> {
    try {
      const payload = {
        shipment_id: shipmentId,
        courier_company_id: courierCompanyId,
      };

      const response = await this.api.post("/courier/assign/awb", payload);
      return response.data;
    } catch (error: any) {
      throw new Error(`AWB generation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async cancelOrder(orderIds: number[]): Promise<any> {
    try {
      const payload = { ids: orderIds };
      const response = await this.api.post("/orders/cancel", payload);
      return response.data;
    } catch (error: any) {
      throw new Error(`Order cancellation failed: ${error.response?.data?.message || error.message}`);
    }
  }

  async getPickupLocations(): Promise<PickupLocation[]> {
    try {
      const response = await this.api.get("/settings/company/pickup");
      return response.data.data.shipping_address;
    } catch (error: any) {
      throw new Error(`Failed to get pickup locations: ${error.response?.data?.message || error.message}`);
    }
  }
}
