import { Router } from "express";
import { WebhookController } from "../controllers/shiprocketWebhookController";

const router = Router();
const webhookController = new WebhookController();

// Shiprocket webhook endpoint
router.post("/shiprocket", webhookController.handleShiprocketWebhook.bind(webhookController));

// Get order status endpoints
router.get("/status/:orderId", webhookController.getOrderStatus.bind(webhookController));
router.get("/statuses", webhookController.getAllOrderStatuses.bind(webhookController));

export default router;
