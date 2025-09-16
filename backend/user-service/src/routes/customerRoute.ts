import express from "express";
import { CustomerController } from "../controllers/customerController";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const customerController = new CustomerController();

// Route to get customer information
router.get("/info/:userId", isAuthenticated, (req, res, next) => {
  customerController.getCustomerInfo(req, res, next);
});

export default router;
