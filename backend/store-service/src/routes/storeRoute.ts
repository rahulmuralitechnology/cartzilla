import express from "express";
import { StoreController } from "../controllers/storeController";
import { check } from "express-validator";
import isAuthenticated from "../middleware/isAuthenticated";
import CreateSiteController from "../controllers/createSiteController";

const router = express.Router();
const storeController = new StoreController();
const createSiteController = new CreateSiteController();

// Route to create a new store

router.post(
  "/create",
  isAuthenticated,
  [
    check("name").notEmpty().withMessage("Store name is required"),
    check("description").optional().notEmpty().withMessage("Description cannot be empty"),
    check("logo").optional().notEmpty().withMessage("Logo cannot be empty"),
    check("storeCategory").optional().notEmpty().withMessage("Store category cannot be empty"),
    check("appType").optional().notEmpty().withMessage("App type cannot be empty"),
    check("siteType").optional().notEmpty().withMessage("Site type cannot be empty"),
    check("favicon").optional().notEmpty().withMessage("Favicon cannot be empty"),
    check("currentVersion").optional().notEmpty().withMessage("Current version cannot be empty"),
    check("latestVersion").optional().notEmpty().withMessage("Latest version cannot be empty"),
    // check("couponCode").optional().notEmpty().withMessage("Coupon code cannot be empty"),
  ],
  storeController.createStore
);

// Route to get all stores
router.get("/list", isAuthenticated, storeController.getAllStores);
router.get("/user/:userId/list", isAuthenticated, storeController.getUserStores);

// Route to get a store by ID
router.get("/get/:id", isAuthenticated, storeController.getStoreById);

// Route to update a store
router.put("/update/:id", isAuthenticated, storeController.updateStore);
router.put("/assign/:id", isAuthenticated, storeController.assignStore);

// Route to delete a store
router.delete("/:id", isAuthenticated, storeController.deleteStore);
router.post("/create-site", isAuthenticated, createSiteController.createSite);

// New payment-related routes
// Route to save payment method
router.post(
  "/add-payment-method",
  isAuthenticated,
  [
    check("storeId").notEmpty().withMessage("Store ID is required"),
    check("paymentMethods").isArray().notEmpty().withMessage("Payment methods are required"),
  ],
  storeController.savePaymentMethod
);

// Route to save UPI transaction
router.post(
  "/save-upi-payment",
  isAuthenticated,
  [
    check("transactionId").notEmpty().withMessage("Transaction ID is required"),
    check("orderId").notEmpty().withMessage("Order ID is required"),
    check("storeId").notEmpty().withMessage("Store ID is required"),
  ],
  storeController.saveUPITransaction
);

// Route to get store UPI transactions
router.get("/upi-transactions/:storeId", isAuthenticated, storeController.getStoreUPITransactions);

// Route to get store payment methods
router.get("/get-paymentmethod/:storeId", isAuthenticated, storeController.getStorePaymentMethods);

// Delivery shiprocket
router.post(
  "/save-shiprocket-auth",
  isAuthenticated,

  [
    check("storeId").notEmpty().withMessage("Store ID is required"),
    check("email").notEmpty().isEmail().withMessage("Valid email is required"),
    check("password").notEmpty().withMessage("Password is required"),
  ],

  storeController.saveShiprocketAuthInfo
);

// Route to get order UPI payment
router.get("/get-upi-order-payment/:storeId/:orderId", isAuthenticated, storeController.getOrderUPIPayment);

router.put(
  "/webhook/store/update/:storeId",
  [check("buildStatus").isBoolean().withMessage("buildStatus is required")],
  storeController.updateWebhookStore
);
router.put(
  "/webhook/store/update/ipaddress/:storeId",
  [check("ipAddress").isString().withMessage("IpAddress is required")],
  storeController.updateStoreIpAddress
);

// STORE VALIDATE CUSTOM DOMAIN

router.get(
  "/validate-custom-domain",
  isAuthenticated,
  [check("domain").notEmpty().withMessage("Domain is required"), check("ipAddress").notEmpty().withMessage("IpAdress  is required")],
  createSiteController.validateDomain
);

export default router;
