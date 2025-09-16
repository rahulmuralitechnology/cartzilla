import express from "express";
import { RobotsTxtController } from "../controllers/robotsTxtController";
import { check } from "express-validator";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const robotsTxtController = new RobotsTxtController();

// Route to create or update robots.txt
router.post(
  "/save",
  isAuthenticated,
  [check("storeId").notEmpty().withMessage("Store ID is required"), check("content").notEmpty().withMessage("Content is required")],
  robotsTxtController.createOrUpdateRobotsTxt
);

// Route to update robots.txt by ID
router.put(
  "/update/:id",
  isAuthenticated,
  [check("content").notEmpty().withMessage("Content is required")],
  robotsTxtController.updateRobotsTxt
);

// Route to delete robots.txt by ID
router.delete("/delete/:id", isAuthenticated, robotsTxtController.deleteRobotsTxt);

// Route to get robots.txt by store ID
router.get("/store/:storeId", robotsTxtController.getRobotsTxtByStore);

// Route to get robots.txt by ID
router.get("/:id", robotsTxtController.getRobotsTxtById);

// Route to toggle robots.txt active status
router.put("/toggle/:id", isAuthenticated, robotsTxtController.toggleRobotsTxtStatus);

export default router;
