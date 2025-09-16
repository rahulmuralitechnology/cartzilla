import { Request, Response } from "express";
import { WebhookService } from "../service/shiprocketWebhookService";
import crypto from "crypto";

export class WebhookController {
  private webhookService: WebhookService;

  constructor() {
    this.webhookService = new WebhookService();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    // Listen for status updates and trigger notifications
    this.webhookService.on("statusUpdate", async (orderStatus) => {
      await this.webhookService.sendStatusNotification(orderStatus);
      //   await this.webhookService.updateOrderInDatabase(orderStatus);
    });
  }

  // Verify webhook signature for security
  private verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
    try {
      const expectedSignature = crypto.createHmac("sha256", secret).update(payload).digest("hex");
      return crypto.timingSafeEqual(Buffer.from(signature, "hex"), Buffer.from(expectedSignature, "hex"));
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return false;
    }
  }

  async handleShiprocketWebhook(req: Request, res: Response) {
    try {
      const payload = JSON.stringify(req.body);
      const signature = req.headers["x-shiprocket-signature"] as string;
      const webhookSecret = process.env.SHIPROCKET_WEBHOOK_SECRET;

      // Verify webhook signature if secret is configured
      if (webhookSecret && signature) {
        if (!this.verifyWebhookSignature(payload, signature, webhookSecret)) {
          console.log("Invalid webhook signature");
          return res.status(401).json({
            success: false,
            message: "Invalid signature",
          });
        }
      }

      // Process the webhook
      const orderStatus = this.webhookService.processWebhook(req.body);

      console.log("Webhook processed successfully:", {
        orderId: orderStatus.orderId,
        status: orderStatus.currentStatus,
        timestamp: orderStatus.lastUpdated,
      });

      res.status(200).json({
        success: true,
        message: "Webhook processed successfully",
        orderId: orderStatus.orderId,
        status: orderStatus.currentStatus,
      });
    } catch (error: any) {
      console.error("Webhook processing error:", error);
      res.status(500).json({
        success: false,
        message: "Webhook processing failed",
        error: error.message,
      });
    }
  }

  async getOrderStatus(req: Request, res: Response) {
    try {
      const { orderId } = req.params;
      const orderStatus = this.webhookService.getOrderStatus(orderId);

      if (!orderStatus) {
        return res.status(404).json({
          success: false,
          message: "Order status not found",
        });
      }

      res.json({
        success: true,
        data: orderStatus,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  async getAllOrderStatuses(req: Request, res: Response) {
    try {
      const orderStatuses = this.webhookService.getAllOrderStatuses();

      res.json({
        success: true,
        data: orderStatuses,
        count: orderStatuses.length,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
