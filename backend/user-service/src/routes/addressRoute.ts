import express from "express";
import { AddressController } from "../controllers/addressController";
import { check } from "express-validator";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const addressController = new AddressController();

// Route to create a new address
router.post(
  "/add-address",
  isAuthenticated,
  [
    check("userId").notEmpty().withMessage("User ID is required"),
    check("name").notEmpty().withMessage("Name is required"),
    check("line1").notEmpty().withMessage("Address Line 1 is required"),
    check("line2").optional().isString().withMessage("Address Line 2 must be a string"),
    check("city").notEmpty().withMessage("City is required"),
    check("state").notEmpty().withMessage("State is required"),
    check("country").notEmpty().withMessage("Country is required"),
    check("zip").notEmpty().withMessage("ZIP code is required"),
    check("phone").optional().isString().withMessage("Invalid phone number"),
    check("isDefault").optional().isBoolean().withMessage("isDefault must be a boolean"),
    check("addressType").optional().isIn(["shipping", "billing", "both"]).withMessage("Invalid address type"),
    check("landmark").optional().isString().withMessage("Landmark must be a string"),
    check("instructions").optional().isString().withMessage("Delivery instructions must be a string"),
  ],
  addressController.createAddress
);

// Route to update an address
router.put("/update-address/:id", isAuthenticated, addressController.updateAddress);

// Route to delete an address
router.delete(
  "/delete-address/:id",
  isAuthenticated,
  [check("id").isUUID().withMessage("Invalid address ID")],
  addressController.deleteAddress
);

// Route to get all addresses for a user
router.get(
  "/get-addresses/:userId",
  isAuthenticated,
  [check("userId").notEmpty().withMessage("User ID is required")],
  addressController.getAddressesByUser
);

// Route to get default address for a user
router.get(
  "/get-default-address/:userId",
  isAuthenticated,
  [check("userId").notEmpty().withMessage("User ID is required")],
  addressController.getDefaultAddress
);

// Route to get a specific address by ID
router.get("/get-address/:id", isAuthenticated, [check("id").isUUID().withMessage("Invalid address ID")], addressController.getAddressById);

// Route to set an address as default
router.patch(
  "/set-default/:id",
  isAuthenticated,
  [check("id").isUUID().withMessage("Invalid address ID")],
  addressController.setDefaultAddress
);

export default router;
