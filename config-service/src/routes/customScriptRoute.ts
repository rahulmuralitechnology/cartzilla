import express from "express";
import { CustomScriptController } from "../controllers/customScriptsController";
import { check } from "express-validator";

const router = express.Router();
const customScriptController = new CustomScriptController();

// Route to create or update a custom script
router.post(
  "/save-custom-script",
  [
    check("storeId").notEmpty().withMessage("Store ID is required"),
    check("scripts").notEmpty().withMessage("Scripts content is required"),
  ],
  customScriptController.createOrUpdateCustomScript
);

// Route to update a custom script by ID
router.put(
  "/update/:id",
  [
    check("id").isMongoId().withMessage("Invalid script ID"),
    check("scripts").notEmpty().withMessage("Scripts content is required"),
  ],
  customScriptController.updateCustomScript
);

// Route to delete a custom script by ID
router.delete(
  "/delete/:id",
  [check("id").isMongoId().withMessage("Invalid script ID")],
  customScriptController.deleteCustomScript
);

// Route to get a custom script by store ID
router.get(
  "/get-custom-script/:storeId",
  customScriptController.getCustomScriptByStore
);

// Route to get a custom script by ID
router.get("/:id", customScriptController.getCustomScriptById);

export default router;
