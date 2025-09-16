import express from "express";
import { check, param } from "express-validator";
import { EmailController } from "../controllers/emailController";
import isAuthenticated from "../middleware/isAuthenticated";

const route = express.Router();
const emailController = new EmailController();

route.post(
  "/subscription/contact-us",
  [
    check("name").isLength({ min: 5 }).withMessage("Name must be at least 5 chars long"),
    check("email").isEmail().withMessage("Email is required"),
    check("planName")
      .notEmpty()
      .withMessage("Plan name is required")
      .isIn(["BASIC", "PREMIUM", "ADVANCE"])
      .withMessage("Invalid Plan name. Must be BASIC, PREMIUM, or ADVANCE"),
    check("message", "Message is required").isLength({ min: 6 }),
  ],
  emailController.handleSubscriptionContact
);

route.post(
  "/contact-form",
  [
    check("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 chars long"),
    check("email").trim().isLength({ min: 3 }).withMessage("Valid email is required"),
    check("message").trim().isLength({ min: 5 }).withMessage("Message must be at least 5 chars long"),
    check("toEmail").isEmail().withMessage("Valid recipient email is required"),
  ],
  emailController.handleContactForm
);

// Get all contact emails for a specific store
route.get(
  "/contact-emails/:storeId",
  isAuthenticated,
  [param("storeId").notEmpty().withMessage("Store ID is required")],
  emailController.getContactEmailsByStoreId
);

export default route;
