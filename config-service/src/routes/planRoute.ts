import express from "express";
import { PlanController } from "../controllers/subscriptionController";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const planController = new PlanController();

// Route to add a new plan
router.post("/add", (req, res, next) => {
  planController.addPlan(req, res, next);
});

// Route to delete a plan by ID
router.delete("/delete/:id", isAuthenticated, (req, res, next) => {
  planController.deletePlan(req, res, next);
});

// Route to get all plans
router.get("/all", isAuthenticated, (req, res, next) => {
  planController.getAllPlans(req, res, next);
});

// Route to update a plan by ID
router.put("/update/:id", isAuthenticated, (req, res, next) => {
  planController.updatePlan(req, res, next);
});
router.put("/subscription/store/update-plan", isAuthenticated, (req, res, next) => {
  planController.updateStorePlan(req, res, next);
});

export default router;
