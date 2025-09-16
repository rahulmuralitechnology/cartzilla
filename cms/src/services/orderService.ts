import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { OrderItem } from "./interfaces/common";
import { Address, CustomerOrderItem } from "./interfaces/customerDetail";
import { downloadBlobFile } from "./utils";
import { IUser } from "./authService";
import { IStore } from "./storeService";

export type orderStatus = "PACKED" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "RETURNED" | "REFUNDED";

export interface Order {
  id: string;
  userId: string;
  storeId: string;
  paymentMode: string; // e.g., "CashOn Delivery"
  totalAmount: number;
  orderDate: string; // ISO 8601 date string
  status: orderStatus; // e.g., "Shipped"
  paymentStatus: any;
  deviceType: string; // e.g., "Desktop"
  orderItems: OrderItem[];
  username: string;
  trackingNo: string;
  deliveryPartner: string;
  updatedAt: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  user?: IUser;
  store?: IStore;
  orderId?: string;
  shippingCost?: number;
}

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;

  // Add other properties as needed based on your API response
}

interface IOrderResponse extends IResponse {
  data: Order[] | any;
}

interface IOrderUPIPaymentResponse extends IResponse {
  transactions: any[];
}

interface IOrderItemResponse extends IResponse {
  data: CustomerOrderItem[];
}

type ApiResponse = IOrderResponse;

class OrderService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): ApiResponse {
    return response.data;
  }

  async getAllStoreOrders(storeId: string): Promise<IOrderResponse> {
    try {
      const response = await this.axiosInstance.get(`/order/store/${storeId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getOrderDetailById(orderId: string): Promise<Order> {
    try {
      const response = await this.axiosInstance.get(`/order/get/${orderId}`);
      return response.data.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async updateOrderStatus(
    orderId: string,
    newStatus: string,
    payStatus: any,
    trackingNo: string,
    deliveryPartner: string
  ): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/order/status/change`, {
        orderId,
        newStatus,
        paymentStatus: payStatus,
        trackingNo,
        deliveryPartner,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async downloadOrderInvoice(orderId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(`/order/generate-invoice`, {
        orderId,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async getOrderPayment(storeId: string, orderId: string): Promise<IOrderUPIPaymentResponse> {
    try {
      const response = await this.axiosInstance.get(`/store/get-upi-order/payment/${storeId}/${orderId}`);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getOrderItemByOrderId(orderId: string): Promise<IOrderItemResponse> {
    try {
      const response = await this.axiosInstance.get(`/order/get/order-item/${orderId}`);
      return response.data;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getShippingPrintLabel(storeId: string, orderId: string, print: boolean = false): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/order/download/shipping-label/${storeId}/${orderId}`, {
        responseType: "blob", // Ensure the response is treated as a Blob
      });

      if (print) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, "_blank");
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
            URL.revokeObjectURL(url); // Clean up the object URL after printing
          };
        }
      } else {
        downloadBlobFile(response.data, "application/pdf", "shipping-label.pdf");
      }
      console.log("sss", response.data);
      return;
    } catch (error) {
      console.log("error", error);
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getOrderInvoice(storeId: string, orderId: string, print: boolean = false): Promise<any> {
    try {
      const response = await this.axiosInstance.get(`/order/download/order-invoice/${storeId}/${orderId}`, {
        responseType: "blob", // Ensure the response is treated as a Blob
      });

      if (print) {
        const blob = new Blob([response.data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);
        const printWindow = window.open(url, "_blank");
        if (printWindow) {
          printWindow.onload = () => {
            printWindow.print();
            URL.revokeObjectURL(url); // Clean up the object URL after printing
          };
        }
      } else {
        downloadBlobFile(response.data, "application/pdf", `order-invoice-${orderId}.pdf`);
      }
      return;
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new OrderService(appConstant.BACKEND_API_URL);
