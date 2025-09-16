import { Router } from "express";
import { ShippingController } from "../controllers/shiprocketController";
import isAuthenticated from "../middleware/isAuthenticated";

const router = Router();
const shippingController = new ShippingController();

router.post("/serviceability", shippingController.checkServiceability.bind(shippingController));
router.post("/create-shipment", isAuthenticated, shippingController.createShipment.bind(shippingController));
router.get("/track/:shipmentId", isAuthenticated, shippingController.trackShipment.bind(shippingController));
router.post("/generate-awb", isAuthenticated, shippingController.generateAWB.bind(shippingController));
router.post("/cancel-order", isAuthenticated, shippingController.cancelOrder.bind(shippingController));
router.get("/pickup-locations", isAuthenticated, shippingController.getPickupLocations.bind(shippingController));

export default router;
