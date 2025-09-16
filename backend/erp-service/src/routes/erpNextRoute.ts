import express from "express";
import { StoryErpNextController } from "../controllers/erpNextController";
import { check } from "express-validator";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const storyErpNextController = new StoryErpNextController();

// Route to create or update ERPNext configuration
router.post(
  "/save",
  isAuthenticated,
  [
    check("storeId").notEmpty().withMessage("Store ID is required"),
    check("apiKey").notEmpty().withMessage("API Key is required"),
    check("baseUrl").notEmpty().withMessage("Base URL is required"),
  ],
  storyErpNextController.createOrUpdateStoryErpNext.bind(storyErpNextController)
);

// Route to update ERPNext configuration by ID
router.put(
  "/update/:id",
  isAuthenticated,
  [check("apiKey").notEmpty().withMessage("API Key is required"), check("baseUrl").notEmpty().withMessage("Base URL is required")],
  storyErpNextController.updateStoryErpNext
);

// Route to delete ERPNext configuration by ID
router.delete("/delete/:id", isAuthenticated, storyErpNextController.deleteStoryErpNext);

// Route to get ERPNext configuration by store ID
router.get("/store/:storeId", storyErpNextController.getStoryErpNextByStore);

// Route to get ERPNext configuration by ID
router.get("/:id", storyErpNextController.getStoryErpNextById);

router.post("/test-connection", storyErpNextController.testConnection);

export default router;
