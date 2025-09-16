// clients/erpnext-client.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { Customer, ERPNextCustomer, ERPNextResponse, ERPNextListResponse, SyncResult, ERPNextConfig } from "./types";
import { getErpNextClient } from "./erpNextClinet";

export class ERPNextCustomerService {
  private client: AxiosInstance;
  private config: ERPNextConfig;

  constructor(config: ERPNextConfig) {
    this.config = config;
    this.client = getErpNextClient(config.baseUrl, config.apiKey, config.apiSecret);

    // Add request interceptor for logging
    this.client.interceptors.request.use(
      (config) => {
        console.log(`ERPNext API Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        console.error("ERPNext API Request Error:", error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.error("ERPNext API Response Error customerService:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Create customer in ERPNext
  async createCustomer(customerData: Customer): Promise<ERPNextResponse<ERPNextCustomer>> {
    try {
      const erpCustomerData: ERPNextCustomer = {
        doctype: "Customer",
        customer_name: customerData.name,
        customer_type: "Individual",
        customer_group: "Individual",
        territory: "India",
        custom_mobile: customerData.mobile,
        custom_email: customerData.email,
        custom_id: customerData.id,
      };

      const response = await this.client.post<ERPNextResponse<ERPNextCustomer>>("/api/resource/Customer", erpCustomerData);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error creating customer in ERPNext:", axiosError.response?.data || axiosError.message);
      throw new Error(`ERPNext API Error: ${axiosError.response?.data || axiosError.message}`);
    }
  }

  // Update customer in ERPNext
  async updateCustomer(customerName: string, customerData: Customer): Promise<ERPNextResponse<ERPNextCustomer>> {
    try {
      const erpCustomerData: Partial<ERPNextCustomer> = {
        customer_name: customerData.name,
        custom_mobile: customerData.mobile,
        custom_email: customerData.email,
        customer_type: customerData.type || "Individual",
        customer_group: customerData.group || this.config.defaultCustomerGroup,
        territory: customerData.territory || this.config.defaultTerritory,
      };

      const response = await this.client.put<ERPNextResponse<ERPNextCustomer>>(`/api/resource/Customer/${customerName}`, erpCustomerData);

      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error updating customer in ERPNext:", axiosError.response?.data || axiosError.message);
      throw new Error(`ERPNext API Error: ${axiosError.response?.data || axiosError.message}`);
    }
  }

  // Get customer from ERPNext
  async getCustomer(customerName: string): Promise<ERPNextResponse<ERPNextCustomer>> {
    try {
      const response = await this.client.get<ERPNextResponse<ERPNextCustomer>>(`/api/resource/Customer/${customerName}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error fetching customer from ERPNext:", axiosError.response?.data || axiosError.message);
      throw new Error(`ERPNext API Error: ${axiosError.response?.data || axiosError.message}`);
    }
  }

  // Check if customer exists by external ID
  async findCustomerByExternalId(externalId: string): Promise<ERPNextCustomer | null> {
    try {
      const response = await this.client.get<ERPNextListResponse<ERPNextCustomer>>("/api/resource/Customer", {
        params: {
          filters: JSON.stringify([["custom_external_id", "=", externalId]]),
          fields: JSON.stringify(["name", "customer_name", "custom_external_id"]),
        },
      });

      return response.data.data[0] || null;
    } catch (error) {
      const axiosError = error as AxiosError;
      console.error("Error finding customer by external ID:", axiosError.response?.data || axiosError.message);
      return null;
    }
  }

  // Sync all customers from your database to ERPNext
  async syncAllCustomers(customers: Customer[]): Promise<SyncResult[]> {
    const results: SyncResult[] = [];

    for (const customer of customers) {
      try {
        // Check if customer already exists in ERPNext
        const existingCustomer = await this.findCustomerByExternalId(customer.id);

        if (existingCustomer) {
          console.log(`Customer ${customer.name} already exists in ERPNext`);
          results.push({
            customer: customer.name,
            action: "exists",
            success: true,
            item: "",
          });
        } else {
          // Create new customer
          const result = await this.createCustomer(customer);
          console.log(`Customer ${customer.name} created in ERPNext`);
          results.push({
            customer: customer.name,
            action: "created",
            success: true,
            data: result,
            item: "",
          });
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error(`Failed to sync customer ${customer.name}:`, errorMessage);
        results.push({
          customer: customer.name,
          action: "failed",
          success: false,
          error: errorMessage,
          item: "",
        });
      }
    }

    return results;
  }
}
