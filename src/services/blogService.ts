import { AxiosResponse } from "axios";
import appConstant from "./appConstant";
import BaseService from "./BaseService";
import { IRequestCustomTheme } from "./interfaces/common";
import { BlogPost } from "./interfaces/blog";

export interface IResponse {
  success: boolean;
  message?: string;
  error?: string;
  info?: string;
  status?: number;
  // Add other properties as needed based on your API response
}

interface IBlogsResponse extends IResponse {
  data: {
    blogs: BlogPost[];
    blog: BlogPost;
  };
}

type ApiResponse = IBlogsResponse;

class BlogService extends BaseService {
  constructor(apiUrl: string) {
    super(apiUrl);
  }

  private handleResponse(response: AxiosResponse<ApiResponse>): IBlogsResponse {
    return response.data;
  }

  async getBlogPost(storeId: string): Promise<IBlogsResponse> {
    try {
      const response = await this.axiosInstance.get(`/blog/list/${storeId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async getBlogPostById(blogId: string): Promise<IBlogsResponse> {
    try {
      const response = await this.axiosInstance.get(`/blog/get/${blogId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }

  async saveBlogPost(data: BlogPost): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post("/blog/create", {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async updateBlogPost(data: BlogPost, id: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.put(`/blog/update/${id}`, {
        ...data,
      });
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
  async deleteBlogPost(storeId: string, blogId: string): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.delete(`/blog/delete/${storeId}/${blogId}`);
      return this.handleResponse(response);
    } catch (error) {
      const errInfo = this.handleCommonError(error as any);
      throw new Error(errInfo.error);
    }
  }
}

export default new BlogService(appConstant.BACKEND_API_URL);
