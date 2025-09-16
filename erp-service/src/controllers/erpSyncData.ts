import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";
import { ErpSyncService } from "../service/erpNextService/erpSyncService";

export class SynErpDataController {
  async syncData(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId, tables, batchSize = 100 } = req.body;

      if (!storeId || !tables || !Array.isArray(tables)) {
        return next(new CustomError("Invalid sync parameters", 400));
      }

      const syncService = new ErpSyncService({
        storeId,
        tables,
        batchSize,
      });

      const results = await syncService.syncTables(tables);

      res.json({
        success: "SUCCESS",
        data: { syncResults: results },
        message: "Data synchronization completed successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Sync failed: ${error.message}`, 500));
    }
  }
}
