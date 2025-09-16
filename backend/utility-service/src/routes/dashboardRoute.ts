import express from "express";
import { DashboardController } from "../controllers/dashboardController";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const dashboardController = new DashboardController();

// Route for getting overall dashboard stats
router.get("/stats", isAuthenticated, dashboardController.getDashboardStats.bind(dashboardController));

// Route for getting store-specific stats
router.get("/store-stats/:id", dashboardController.getStoreStats.bind(dashboardController));

export default router;
