import express from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import { CustomThemeController } from "../controllers/customTheme";

const router = express.Router();
const customTheme = new CustomThemeController();

// Route to add a new plan
router.post("/request", isAuthenticated, (req, res, next) => {
  customTheme.requestCustomTheme(req, res, next);
});

// Route to get all plans
router.get("/request-list", isAuthenticated, (req, res, next) => {
  customTheme.getAllThemeRequests(req, res, next);
});

export default router;
