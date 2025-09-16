// routes/stock.ts
import { Router } from "express";
import {
  getProductStock,
  updateProductStock,
  getStoreInventory,
  bulkUpdateStock,
  getLowStockProducts,
  getStockHistory,
  updateStockWithHistory,
} from "../controllers/stockController";
import isAuthenticated from "../middleware/isAuthenticated";

const router = Router();

// Get stock for a specific product
router.get("/product/:productId", isAuthenticated, getProductStock);

// Update stock for a specific product
router.patch("/product/:productId", isAuthenticated, updateProductStock);

// Update stock with history tracking
router.patch("/product/:productId/with-history", isAuthenticated, updateStockWithHistory);

// Get inventory for entire store
router.get("/store/:storeId/inventory", isAuthenticated, getStoreInventory);

// Get low stock products for a store
router.get("/store/:storeId/low-stock", isAuthenticated, getLowStockProducts);

// Bulk update stock for multiple products
router.patch("/bulk-update", isAuthenticated, bulkUpdateStock);

// Get stock history for a product
router.get("/product/:productId/history", isAuthenticated, getStockHistory);

export default router;
