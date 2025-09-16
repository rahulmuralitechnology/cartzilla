import express, { Request, Response, NextFunction } from "express";
import { ERPSyncService } from "../service/erpNextService/syncService";
import { check } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";

const router = express.Router();

// Optional: Strongly type request bodies
interface WebhookRequestBody {
  storeId: string;
  doctype: string;
  name: string;
  action: string;
  [key: string]: any;
}

interface SyncRequestBody {
  storeId: string;
  productIds?: string[];
  orderIds?: string[];
}

// Webhook route
router.post(
  "/webhook",
  [
    check("storeId").notEmpty().withMessage("Store ID is required"),
    check("doctype").notEmpty().withMessage("Doctype is required"),
    check("name").notEmpty().withMessage("Document name is required"),
    check("action").notEmpty().withMessage("Action is required"),
  ],
  async (
    req: Request<{}, {}, WebhookRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      // console.log('Received webhook with storeId:', req.body);
      // const signature = req.headers["x-erpnext-signature"] as string;
      // if (!signature) throw new CustomError("Missing signature", 401);
      const { storeId, ...payload } = req.body;
      await ERPSyncService.handleERPWebhook(storeId, payload);
      res.json({ success: "SUCCESS", message: "Webhook processed" });
    } catch (error) {
      next(error);
    }
  }
);

// Sync Products
router.post(
  "/sync-products",
  [
    check("storeId").notEmpty().withMessage("Store ID is required"),
  ],
  async (
    req: Request<{}, {}, SyncRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { storeId, productIds } = req.body;
      const result = await ERPSyncService.syncProductsToERP(storeId, productIds);
      res.json({ success: "SUCCESS", data: result });
    } catch (error) {
      next(error);
    }
  }
);

// Sync Orders
router.post(
  "/sync-orders",
  [
    check("storeId").notEmpty().withMessage("Store ID is required"),
  ],
  async (
    req: Request<{}, {}, SyncRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { storeId, orderIds } = req.body;
      const result = await ERPSyncService.syncOrdersToERP(storeId, orderIds);
      res.json({ success: "SUCCESS", data: result });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
