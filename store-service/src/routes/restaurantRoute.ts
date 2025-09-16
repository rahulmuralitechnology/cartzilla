import express from "express";
import { check } from "express-validator";
import { RestaurantController } from "../controllers/restaurantController";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const restaurantController = new RestaurantController();

// Route to create a menu item
router.post(
  "/add_menu_item",
  isAuthenticated,
  [
    check("name").notEmpty().withMessage("Menu name is required"),
    check("description").notEmpty().withMessage("Description is required"),
    check("price").notEmpty().isNumeric().withMessage("Price is required and must be a number"),
    check("category").notEmpty().withMessage("Category is required"),
    check("userId").notEmpty().withMessage("User ID is required"),
    check("storeId").notEmpty().withMessage("Store ID is required"),
  ],
  restaurantController.createMenuItem
);

// Route to update a menu item
router.put(
  "/update/:id",
  isAuthenticated,
  [
    check("id").notEmpty().withMessage("Invalid menu item ID"),
    check("name").optional().notEmpty().withMessage("Menu name cannot be empty"),
  ],
  restaurantController.updateRestaurant
);

// Route to delete a menu item
router.delete("/menu-item/delete/:id", isAuthenticated, restaurantController.deleteRestaurant);

// Route to get menu items by store ID
router.get("/get-all-menu", restaurantController.getRestaurantsByStoreId);

// New route for creating a reservation
router.post(
  "/reservation",
  isAuthenticated,
  [
    check("date").notEmpty().withMessage("Date is required"),
    check("time").notEmpty().withMessage("Time is required"),
    check("guests").notEmpty().isNumeric().withMessage("Number of guests is required"),
    check("name").notEmpty().withMessage("Name is required"),
    check("email").notEmpty().isEmail().withMessage("Valid email is required"),
    check("toEmail").notEmpty().isEmail().withMessage("Valid recipient email is required"),
    check("storeId").notEmpty().withMessage("Store ID is required"),
  ],
  restaurantController.createReservation
);

// Route to get all reservations for a store
router.get("/reservations/:id", restaurantController.getReservationsByStoreId);
router.post("/menu-bulk-upload", isAuthenticated, restaurantController.bulkCreateMenuItems);

export default router;
