import express from "express";
import { PortalCouponController } from "../controllers/portalCouponController";
import { check } from "express-validator";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const portalCouponController = new PortalCouponController();

// Route to create a new coupon
router.post(
  "/create",

  [
    check("code").notEmpty().withMessage("Code is required"),
    check("startDate").isISO8601().withMessage("Start Date must be a valid date"),
    check("endDate").isISO8601().withMessage("End Date must be a valid date"),
  ],
  portalCouponController.createCoupon
);

router.get("/list", isAuthenticated, portalCouponController.getCoupons);

// Route to update a coupon
router.put("/update/:id", isAuthenticated, portalCouponController.updateCoupon);

// Route to delete a coupon
router.delete("/delete/:id", isAuthenticated, [check("id").isUUID().withMessage("Invalid coupon ID")], portalCouponController.deleteCoupon);

export default router;
