import express, { Request, Response } from "express";
import { AuthController } from "../controllers/authController";
import { check } from "express-validator";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const authController = new AuthController();

router.post(
  "/register",
  [
    check("username").isLength({ min: 5 }).withMessage("Name must be at least 5 chars long"),
    check("email").isEmail().withMessage("Email is required"),
    check("password", "Password must be at least 6 chars long").isLength({
      min: 6,
    }),
  ],
  authController.signup
);
router.post(
  "/login",
  [
    check("email").isEmail().withMessage("Email is required"),
    check("password", "Password must be at least 6 chars long").isLength({
      min: 6,
    }),
  ],
  authController.signin
);
router.post("/verify-otp", authController.verifyAuthOtp);
// router.post("/forgot-password",[check("email").isEmail().withMessage("Email is required")], authController.forgotPassword);
// router.post("/reset-password", [check("token").notEmpty().withMessage("token is required"),check("newPassword").notEmpty().withMessage("newPassword is required")], authController.resetPassword);

// Google Authentication routes
router.get("/google", authController.googleAuth);
router.get("/google/callback", authController.googleAuthCallback);

router.get("/get-userinfo", isAuthenticated, (req: Request, res: Response) => {
  return res.status(200).json({ message: "User Authenticated", data: { user: req?.user }, success: "SUCCESS" });
});

router.get("/get-all-clients", isAuthenticated, authController.getAllUsers);
router.get("/:storeId/:tenantId/get-client-user", isAuthenticated, authController.getAllClientUsers);
router.get("/get-all-customer/:storeId", isAuthenticated, authController.getAllCustomers);
router.post("/update-user/:userId", isAuthenticated, authController.updateUser);

export default router;
