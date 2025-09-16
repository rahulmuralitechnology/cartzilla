// clients/erpnext-client.ts
import axios, { AxiosInstance, AxiosError } from "axios";
import { ERPNextConfig } from "./types";
import { ERPNextListResponse, ERPNextResponse } from "./types";

export class ERPNextClient {
  private client: AxiosInstance;
  private config: ERPNextConfig;

  constructor(config: ERPNextConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        Authorization: `token ${config.apiKey}:${config.apiSecret}`,
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    this.client.interceptors.request.use(
      (config) => {
        console.log(`📤 ERPNext API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
        console.log(`📤 ERPNext Payload:`, config.data);
        return config;
      },
      (error) => {
        console.error("❌ ERPNext API Request Error:", error);
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        console.log("✅ ERPNext Response:", response.data);
        return response;
      },
      (error: AxiosError) => {
        console.error("❌ ERPNext API Response Error:", error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  // Generic methods
  async create<T>(doctype: string, data: any): Promise<ERPNextResponse<T>> {
    try {
      const response = await this.client.post<ERPNextResponse<T>>(`/api/resource/${doctype}`, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`ERPNext API Error: ${axiosError.response?.data || axiosError.message}`);
    }
  }

  async update<T>(doctype: string, name: string, data: any): Promise<ERPNextResponse<T>> {
    try {
      const response = await this.client.put<ERPNextResponse<T>>(`/api/resource/${doctype}/${name}`, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`ERPNext API Error: ${axiosError.response?.data || axiosError.message}`);
    }
  }

  async action<T>(data: any,status: any): Promise<ERPNextResponse<T>> {
    try {
      const response = await this.client.post<ERPNextResponse<T>>(`/api/method/frappe.model.workflow.apply_workflow`, {doc:data, action: status});
      return response.data;
    } catch (error) { 
      const axiosError = error as AxiosError;
      throw new Error(`ERPNext API Error: ${axiosError.response?.data || axiosError.message}`);
    }
  }

  async get<T>(doctype: string, name: string): Promise<ERPNextResponse<T>> {
    try {
      const response = await this.client.get<ERPNextResponse<T>>(`/api/resource/${doctype}/${name}`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`ERPNext API Error: ${axiosError.response?.data || axiosError.message}`);
    }
  }

  async list<T>(doctype: string, params?: any): Promise<ERPNextListResponse<T>> {
    try {
      const response = await this.client.get<ERPNextListResponse<T>>(`/api/resource/${doctype}`, { params });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`ERPNext API Error: ${axiosError.response?.data || axiosError.message}`);
    }
  }

  async delete(doctype: string, name: string): Promise<void> {
    try {
      await this.client.delete(`/api/resource/${doctype}/${name}`);
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`ERPNext API Error: ${axiosError.response?.data || axiosError.message}`);
    }
  }

  async submitDoc<T>(doctype: string, name: string): Promise<ERPNextResponse<T>> {
    try {
      const response = await this.client.post<ERPNextResponse<T>>(`/api/resource/${doctype}/${name}?run_method=submit`);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError;
      throw new Error(`ERPNext API Error: ${axiosError.response?.data || axiosError.message}`);
    }
  }

  async findByExternalId<T>(doctype: string, externalId: string): Promise<T | null> {
    try {
      const response = await this.list<T>(doctype, {
        filters: JSON.stringify([["custom_external_id", "=", externalId]]),
        fields: JSON.stringify(["name", "custom_external_id"]),
      });
      return response.data[0] || null;
    } catch (error) {
      console.error(`Error finding ${doctype} by external ID:`, error);
      return null;
    }
  }
}
