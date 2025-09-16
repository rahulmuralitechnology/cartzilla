import express from "express";
import { SectionBuilderController } from "../controllers/sectionBuilderController";
import { check } from "express-validator";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const sectionBuilderController = new SectionBuilderController();

// Create a new section
router.post(
  "/store/:storeId/create",
  isAuthenticated,
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("schema").notEmpty().withMessage("Schema is required"),
    check("formData").notEmpty().withMessage("Form data is required"),
  ],
  sectionBuilderController.createSection
);

// Get all sections for a store
router.get("/store/:storeId/list", sectionBuilderController.getSections);

// Get a specific section
router.get("/store/:storeId/section/:id", isAuthenticated, sectionBuilderController.getSectionById);

// Update a section
router.put("/store/:storeId/section/:id", isAuthenticated, sectionBuilderController.updateSection);

// Delete a section
router.delete("/store/:storeId/section/:id", isAuthenticated, sectionBuilderController.deleteSection);

// Publish a section
router.put("/store/:storeId/section/:id/publish", isAuthenticated, sectionBuilderController.publishSection);

export default router;
