import express from "express";
import { CartController } from "../controllers/cartController";
import { check } from "express-validator";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const cartController = new CartController();

// Cart Management Routes
router.post(
  "/create",
  isAuthenticated,
  [
    check("userId").notEmpty().withMessage("User ID is required"),
    check("storeId").notEmpty().withMessage("Store ID is required"),
    check("productId").notEmpty().withMessage("Product ID is required"),
    check("quantity").isNumeric().withMessage("Quantity must be a number"),
    check("price").isNumeric().withMessage("Price must be a number"),
  ],
  cartController.addOrUpdateCart
);

//for templates
router.get("/user/:userId", isAuthenticated, cartController.getCartByUserId);

router.delete("/item/:cartItemId", isAuthenticated, cartController.removeCartItem);

router.delete("/clear/:cartId", isAuthenticated, cartController.clearCart);

router.put(
  "/status/:cartId",
  isAuthenticated,
  [check("status").isIn(["ACTIVE", "COMPLETED", "ABANDONED"]).withMessage("Invalid status value")],
  cartController.updateCartStatus
);

// User-specific Cart Operations
router.get("/list/active/:storeId", isAuthenticated, cartController.getActiveCartByStoreId);

router.delete("/clear/:userId", isAuthenticated, cartController.clearCartByUserId);

router.post(
  "/remove",
  isAuthenticated,
  [check("userId").notEmpty().withMessage("User ID is required"), check("productId").notEmpty().withMessage("Product ID is required")],
  cartController.removeProductFromCart
);

router.put(
  "/update-address",
  isAuthenticated,
  [
    check("userId").notEmpty().withMessage("User ID is required"),
    check("addressId").notEmpty().withMessage("Address ID is required"),
    check("addressType").isIn(["billing", "shipping"]).withMessage("Address type must be 'billing' or 'shipping'"),
  ],
  cartController.updateAddressInCart
);

// Store-specific Cart Operations
router.get("/store/:storeId", isAuthenticated, cartController.getCartsByStoreId);

router.get("/abandoned-carts/:storeId", isAuthenticated, cartController.getAbandonedCarts);

// Discount Management Routes
router.post(
  "/discount/add",
  isAuthenticated,
  [
    check("name").notEmpty().withMessage("Discount name is required"),
    check("code").notEmpty().withMessage("Discount code is required"),
    check("discountType").isIn(["PERCENTAGE", "FIXED"]).withMessage("Discount type must be 'PERCENTAGE' or 'FIXED'"),
    check("value").isNumeric().withMessage("Discount value must be a number"),
    check("expiryDate").isISO8601().withMessage("Expiry date must be a valid date"),
    check("showOnCheckout").isBoolean().withMessage("Show on checkout must be a boolean"),
    check("limited").isBoolean().withMessage("Limited must be a boolean"),
  ],
  cartController.addDiscount
);

router.delete("/discount/:code", isAuthenticated, cartController.deleteDiscount);

router.put("/discount/update", [check("code").notEmpty().withMessage("Discount code is required")], cartController.updateDiscount);

router.get("/discount/store/:storeId", isAuthenticated, cartController.fetchDiscountsByStore);

router.post("/discounts/check", isAuthenticated, cartController.fetchDiscounts);

router.post(
  "/apply-discount",
  isAuthenticated,
  [
    check("userId").notEmpty().withMessage("User ID is required"),
    check("discountCode").notEmpty().withMessage("Discount code is required"),
  ],
  cartController.applyDiscountToCart
);

export default router;
