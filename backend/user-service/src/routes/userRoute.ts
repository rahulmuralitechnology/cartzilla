import express, { NextFunction, Request, Response } from "express";
import isAuthenticated from "../middleware/isAuthenticated";
import { UserController } from "../controllers/userController";
import { check } from "express-validator";
import multer from "multer";
const upload = multer({ storage: multer.memoryStorage() });
const route = express.Router();
const userController = new UserController();

// ************************** | GET AUTH INFO | *****************************
route.get("/get-userinfo", isAuthenticated, (req: Request, res: Response) => {
  return res.status(200).json({ message: "User Authenticated", user: req?.user, success: true });
});

route.post(
  "/add-client-user",
  [
    check("username").isLength({ min: 5 }).withMessage("Name must be at least 5 chars long"),
    check("password", "Password must be at least 6 chars long").isLength({
      min: 6,
    }),
  ],
  userController.AddClientUser
);
route.post(
  "/add/send-invitation",
  [
    check("email").isEmail().withMessage("Email is required"),
    check("storeId").isString().withMessage("Store ID is required"),
    check("userId").isString().withMessage("User ID is required"),
  ],
  isAuthenticated,
  userController.sendClientUserInvitation
);

route.post("/update-profile", isAuthenticated, upload.single("profile"), userController.updateUser);
route.post("/update-password", isAuthenticated, userController.updatePassword);
route.post("/forgot-password/link", [check("email").isEmail().withMessage("Email is required")], userController.forgotPasswordLink);
route.post(
  "/reset-password",
  [check("newPassword").isString().withMessage("New password is required"), check("token").isString().withMessage("Token is required")],

  userController.resetPassword
);

export default route;
