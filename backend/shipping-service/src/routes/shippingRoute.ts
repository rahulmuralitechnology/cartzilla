import express from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import { param } from "express-validator";
import { ShippingInfoController } from "../controllers/shippingInfoController";

const router = express.Router();
const shippingInfoController = new ShippingInfoController();

// Create shipping info
router.post("/save", isAuthenticated, shippingInfoController.addShippingInfo);

// Get all shipping info
router.get("/list", isAuthenticated, shippingInfoController.getAllShippingInfos);

// Get shipping info by ID
router.get(
  "/get/:storeId",
  [param("storeId").notEmpty().withMessage("Store Id is required")],
  shippingInfoController.getShippingInfoByStoreId
);

// Update shipping info
router.put(
  "/update/:id",
  isAuthenticated,
  [param("id").notEmpty().withMessage("Shipping info ID is required")],
  shippingInfoController.updateShippingInfo
);

// Delete shipping info
router.delete(
  "/delete/:id",
  isAuthenticated,
  [param("id").notEmpty().withMessage("Shipping info ID is required")],
  shippingInfoController.deleteShippingInfo
);

export default router;
