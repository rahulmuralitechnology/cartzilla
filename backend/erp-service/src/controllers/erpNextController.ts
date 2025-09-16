import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import axios from "axios"; // Added missing import
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";
import { ErpSyncService } from "../service/erpNextService/erpSyncService";

export class StoryErpNextController {
  async createOrUpdateStoryErpNext(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { storeId, apiKey, apiSecret, baseUrl, id } = req.body;

      // Check if store exists
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        return next(new CustomError("Store not found", 404));
      }

      let existingStoryErpNext;
      if (id) {
        existingStoryErpNext = await prisma.storeErpNext.findUnique({
          where: { id },
        });
      }

      let storeErpNext;
      if (existingStoryErpNext) {
        // Update existing configuration
        storeErpNext = await prisma.storeErpNext.update({
          where: { id: existingStoryErpNext.id },
          data: {
            apiKey,
            baseUrl,
            apiSecret,
          },
        });
        await this.triggerFullSync(storeId, storeErpNext);
      } else {
        // Create new configuration
        storeErpNext = await prisma.storeErpNext.create({
          data: {
            storeId,
            apiKey,
            apiSecret,
            baseUrl,
          },
        });
        await this.triggerFullSync(storeId, storeErpNext);
      }

      res.status(201).json({
        success: "SUCCESS",
        data: { storeErpNext },
        message: "ERPNext configuration saved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error saving ERPNext configuration: ${error.message}`, 500));
    }
  }

  private triggerFullSync = async (storeId: string, erpConfig: any) => {
    try {
      const tablesToSync = ['categories', 'hsn-codes', 'products', 'customers', 'addresses', 'orders'];
      
      const syncService = new ErpSyncService({
        storeId,
        tables: tablesToSync,
        batchSize: 100
      });

      await syncService.initializeERPClient();

      for (const table of tablesToSync) {
        try {
          await syncService.syncTables([table]);
          console.log(`Synced table: ${table}`);
        } catch (err) {
          console.error(`Failed to sync table ${table}:`, err);
          // Optionally, you can log this in DB or send alert/notification
        }
      }

      console.log(`Finished full sync for store ${storeId}`);

    } catch (error) {
      console.error(`Failed to initialize sync service for store ${storeId}:`, error);
    }
  };


  async updateStoryErpNext(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { apiKey, baseUrl } = req.body;

      const existingStoryErpNext = await prisma.storeErpNext.findUnique({
        where: { id },
      });

      if (!existingStoryErpNext) {
        return next(new CustomError("ERPNext configuration not found", 404));
      }

      const updatedStoryErpNext = await prisma.storeErpNext.update({
        where: { id },
        data: {
          apiKey,
          baseUrl,
        },
      });

      res.json({
        success: "SUCCESS",
        data: { storeErpNext: updatedStoryErpNext },
        message: "ERPNext configuration updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating ERPNext configuration: ${error.message}`, 500));
    }
  }

  async deleteStoryErpNext(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingStoryErpNext = await prisma.storeErpNext.findUnique({
        where: { id },
      });

      if (!existingStoryErpNext) {
        return next(new CustomError("ERPNext configuration not found", 404));
      }

      await prisma.storeErpNext.delete({
        where: { id },
      });

      res.json({
        success: "SUCCESS",
        message: "ERPNext configuration deleted successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting ERPNext configuration: ${error.message}`, 500));
    }
  }

  async getStoryErpNextByStore(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;

      const storeErpNext = await prisma.storeErpNext.findUnique({
        where: { storeId },
      });

      if (!storeErpNext) {
        return res.status(200).json({
          success: "SUCCESS",
          data: {},
        });
      }

      res.status(200).json({
        success: "SUCCESS",
        data: storeErpNext,
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching ERPNext configuration: ${error.message}`, 500));
    }
  }

  async getStoryErpNextById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const storeErpNext = await prisma.storeErpNext.findUnique({
        where: { id },
        include: {
          store: true,
        },
      });

      if (!storeErpNext) {
        return next(new CustomError("ERPNext configuration not found", 404));
      }

      res.json({
        success: "SUCCESS",
        data: storeErpNext,
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching ERPNext configuration: ${error.message}`, 500));
    }
  }

  async testConnection(req: Request, res: Response, next: NextFunction) { // Fixed method name
    try {
      const { baseUrl, apiKey, apiSecret } = req.body;
      
      // Validate input
      if (!baseUrl || !apiKey || !apiSecret) {
        return res.status(400).json({
          success: false,
          message: 'Missing required parameters',
          valid: false
        });
      }
      
      // Clean up the base URL (remove trailing slash if present)
      const cleanBaseUrl = baseUrl.replace(/\/$/, '');
      
      // Make a request to ERPNext to test the connection
      const response = await axios.get(`${cleanBaseUrl}/api/method/frappe.auth.get_logged_user`, {
        headers: {
          'Authorization': `token ${apiKey}:${apiSecret}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000 // 10 second timeout
      });
      
      // If we get a successful response with user data, the connection is valid
      if (response.status === 200 && response.data && response.data.message) {
        return res.json({
          success: true,
          valid: true,
          message: 'Connection successful',
          user: response.data.message,
          version: response.data.version // If available
        });
      }
      
      return res.json({
        success: false,
        valid: false,
        message: 'Invalid response from ERPNext'
      });
      
    } catch (error: any) {
      console.error('ERPNext connection test error:', error);
      
      let errorMessage = 'Connection test failed';
      let errorDetails = '';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        if (error.response.status === 401) {
          errorMessage = 'Authentication failed';
          errorDetails = 'Please check your API key and secret.';
        } else if (error.response.status === 404) {
          errorMessage = 'ERPNext instance not found';
          errorDetails = 'Please check your base URL.';
        } else {
          errorMessage = `Server error: ${error.response.status}`;
          errorDetails = error.response.statusText;
        }
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server';
        errorDetails = 'Please check your network connection and the base URL.';
      } else {
        // Something happened in setting up the request that triggered an Error
        errorMessage = 'Connection test failed';
        errorDetails = error.message;
      }
      
      return res.status(500).json({
        success: false,
        valid: false,
        message: errorMessage,
        error: errorDetails
      });
    }
  }
}