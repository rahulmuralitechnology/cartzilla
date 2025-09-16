import express from "express";
import { OrderController } from "../controllers/orderController";
import { body, param } from "express-validator";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const orderController = new OrderController();

// Create a new order
router.post(
  "/create",
  isAuthenticated,
  [
    body("userId").notEmpty().withMessage("User ID is required"),
    body("storeId").notEmpty().withMessage("Store ID is required"),
    body("paymentMode").notEmpty().withMessage("Payment mode is required"),
  ],
  orderController.createOrder
);

// Generate invoice for an order
router.post(
  "/generate-invoice",
  isAuthenticated,
  [body("orderId").notEmpty().withMessage("Order ID is required")],
  orderController.generateInvoice
);

// List orders for a specific user
router.get("/:userId", isAuthenticated, [param("userId").notEmpty().withMessage("User ID is required")], orderController.listOrders);

// Get orders by store ID
router.get(
  "/store/:storeId",
  isAuthenticated,
  [param("storeId").notEmpty().withMessage("Store ID is required")],
  orderController.getOrdersByStoreId
);

// Change order status
router.post(
  "/status/change",
  isAuthenticated,
  [body("orderId").notEmpty().withMessage("Order ID is required"), body("newStatus").notEmpty().withMessage("New status is required")],
  orderController.changeOrderStatus
);

// Get pending payment orders
router.get(
  "/store/:storeId/pending-payments",
  isAuthenticated,
  [param("storeId").notEmpty().withMessage("Store ID is required")],
  orderController.getPendingPaymentOrders
);

// Track order status
router.get(
  "/track/:orderId",
  isAuthenticated,
  [param("orderId").notEmpty().withMessage("Order ID is required")],
  orderController.trackOrder
);

router.get(
  "/get/order-item/:orderId",
  isAuthenticated,
  [param("orderId").notEmpty().withMessage("Order ID is required")],
  orderController.getOrderItemsByOrderId
);

router.get(
  "/download/shipping-label/:storeId/:orderId",
  isAuthenticated,
  [param("orderId").notEmpty().withMessage("Order ID is required")],
  orderController.getShippingLabel
);
router.get(
  "/download/order-invoice/:storeId/:orderId",
  isAuthenticated,
  [param("orderId").notEmpty().withMessage("Order ID is required")],
  orderController.getOrderInvoice
);
router.get(
  "/get/:orderId",
  isAuthenticated,
  [param("orderId").notEmpty().withMessage("Order ID is required")],
  orderController.getOrderById
);

export default router;
