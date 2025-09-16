import express from "express";
import { SiteConfigController } from "../controllers/siteConfigController";
import { check } from "express-validator";

const router = express.Router();
const siteConfigController = new SiteConfigController();

// Route to create or update a site configuration
router.post(
  "/save-site-config",
  [check("storeId").notEmpty().withMessage("Store ID is required")],
  siteConfigController.createOrUpdateSiteConfig
);

// Route to update a site configuration by ID
router.put(
  "/update/:id",
  [
    check("id").isMongoId().withMessage("Invalid configuration ID"),
    check("siteConfig").notEmpty().withMessage("Site configuration data is required"),
  ],
  siteConfigController.updateSiteConfig
);

// Route to delete a site configuration by ID
router.delete("/delete/:id", [check("id").isMongoId().withMessage("Invalid configuration ID")], siteConfigController.deleteSiteConfig);

// Route to get site configurations by store ID
router.get("/get-site-config", siteConfigController.getSiteConfigByStore);

// Route to get a site configuration by ID
router.get("/:id", [check("id").isMongoId().withMessage("Invalid configuration ID")], siteConfigController.getSiteConfigById);

export default router;
