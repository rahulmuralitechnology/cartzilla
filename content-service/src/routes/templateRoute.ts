import express from "express";
import { TemplateController } from "../controllers/templateController";
import { check } from "express-validator";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const templateController = new TemplateController();

// Route to create a new template
router.post(
  "/create",
  isAuthenticated,
  [
    check("name").notEmpty().withMessage("Name is required"),
    check("repoDirName").notEmpty().withMessage("Repository Directory Name is required"),
    check("previewImage").optional().isString().withMessage("Preview Image must be a string"),
  ],
  templateController.createTemplate
);

router.get("/list", isAuthenticated, templateController.getTemplates);
router.get("/list/active", isAuthenticated, templateController.getActiveTemplate);

// Route to update a template
router.put("/update/:id", isAuthenticated, templateController.updateTemplate);

router.put("/update/version", templateController.updateLatestVersion);

// Route to delete a template
router.delete("/delete/:id", isAuthenticated, [check("id").isUUID().withMessage("Invalid template ID")], templateController.deleteTemplate);

export default router;
