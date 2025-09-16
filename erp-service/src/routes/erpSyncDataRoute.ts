import express from "express";
import { SynErpDataController } from "../controllers/erpSyncData";
import isAuthenticated from "../middleware/isAuthenticated";
import { check } from "express-validator";

const router = express.Router();
const storyErpNextController = new SynErpDataController();
router.post(
  "/sync",
  isAuthenticated,
  [
    check("storeId").notEmpty().withMessage("Store ID is required"),
    check("tables").isArray().notEmpty().withMessage("Tables array is required"),
  ],
  storyErpNextController.syncData
);

export default router;
