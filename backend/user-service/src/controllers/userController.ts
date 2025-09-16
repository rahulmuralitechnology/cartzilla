import { NextFunction, Request, Response } from "express";
import prisma from "../service/prisma";
import { User, UserRole } from "@prisma/client";
import bcryptHelper from "../utils/bcrypt";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import { SourceKey } from "./authController";
import emailServer from "../service/emailServer";
import config from "../config";
import jwt from "jsonwebtoken";

export class UserController {
  async updateUser(req: any, res: Response, next: NextFunction) {
    const { name, dob, phone } = req.body;
    const authUser = req.user as User;
  }

  async updatePassword(req: any, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const userId = req.user?.id as string;
      const { password } = req.body;

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!existingUser) {
        return res.status(404).json({
          success: "FAILED",
          message: "User not found",
        });
      }

      // Hash the new password
      const hashPassword = await bcryptHelper.generateBcryptPassword(password);

      // Update user password
      await prisma.user.update({
        where: { id: userId },
        data: {
          password: hashPassword,
          updatedAt: new Date(),
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        message: "Password updated successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating password: ${error.message}`, 500));
    }
  }

  async forgotPasswordLink(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const {
        source,
        storeId: stId,
        Storeid,
        storeid,
      } = req.headers as {
        source: SourceKey;
        storeId?: string;
        storeid?: string;
        Storeid?: string;
      };
      let storeId = stId || Storeid || storeid;
      const { email } = req.body;

      // Find user
      const user = await prisma.user.findFirst({ where: { email, storeId, source: source } });
      if (!user) {
        return next(new CustomError("User not found", 400));
      }
      // Generate reset token using JWT
      const resetToken = jwt.sign({ userId: user.id }, config.appConstant.JWT_PS_RESET_SECRET as string, { expiresIn: "1h" });

      // Send reset password email
      await emailServer.emailController("PasswordReset", {
        token: resetToken,
        toEmail: email,
        user,
        clientUrl: (req.headers["client-url"] as string) || req.headers.origin,
      });

      res.json({ message: "Password reset email sent" });
    } catch (error) {
      return next(new CustomError(`Error processing forgot password request, ${error}`, 500));
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { token, newPassword } = req.body as { token: string; newPassword: string };

      // Verify JWT token
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, config.appConstant.JWT_PS_RESET_SECRET as string) as {
        // decodedToken = jwt.verify(token, config.appConstant.JWT_PS_RESET_SECRET as string, { ignoreExpiration: true }) as {
          userId: string;
        };
      } catch (error) {
        return next(new CustomError("Invalid or expired reset token", 400));
      }

      // Find user by decoded userId
      const user = await prisma.user.findUnique({
        where: { id: decodedToken.userId },
      });

      if (!user) {
        return next(new CustomError("User not found", 404));
      }

      // Hash new password
      const hashedPassword = await bcryptHelper.generateBcryptPassword(newPassword);

      // Update user's password
      await prisma.user.update({
        where: { id: user.id },
        data: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      });

      res.status(200).json({ message: "Password reset successfully", success: "SUCCESS" });
    } catch (error) {
      return next(new CustomError(`Error resetting password, ${error}`, 500));
    }
  }

  async sendClientUserInvitation(req: any, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { email, storeId, userId, role } = req.body;

      // const notAllowedEmail = await prisma.user.findFirst({
      //   where: {
      //     email,
      //     source: SourceKey.Portal,
      //   },
      //   select: { role: true },
      // });

      // if (
      //   notAllowedEmail?.role === UserRole.CLIENT ||
      //   notAllowedEmail?.role === UserRole.SUPERADMIN ||
      //   notAllowedEmail?.role === UserRole.ADMIN
      // ) {
      //   return res.status(400).json({ message: `This email is already registered` });
      // }

      const alreadySendInvitation = await prisma.user.findFirst({
        where: {
          email,
          source: SourceKey.Portal,
          role: {
            in: [UserRole.CLIENT, UserRole.USER, UserRole.ADMIN],
          },
          tenantId: userId,
        },
        select: { id: true, storeId: true },
      });

      if (alreadySendInvitation && alreadySendInvitation?.storeId?.includes(storeId)) {
        return res.status(400).json({ message: `Invitation already sent for this email: ${email}` });
      }

      if (alreadySendInvitation && alreadySendInvitation?.storeId !== null) {
        const AddedStoreId = alreadySendInvitation?.storeId ? alreadySendInvitation.storeId + "," + storeId : storeId;

        await prisma.user.update({
          where: { id: alreadySendInvitation?.id },
          data: { storeId: AddedStoreId },
        });

        return res.status(200).json({ message: `Site access for this user` });
      }

      const authUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, organizationName: true },
      });

      const store = await prisma.store.findUnique({
        where: { id: storeId },
        select: { id: true, name: true },
      });

      const tokenPayload: any = {
        tenantId: userId,
        email,
        organizationName: authUser?.organizationName,
        storeId: storeId
      };

      // Only add role to payload if it's "client"
      if (role === "client") {
        tokenPayload.role = UserRole.CLIENT;
      }
      // Generate invitation token using JWT
      const invitationToken = jwt.sign(
        tokenPayload,
        config.appConstant.JWT_INVITATION_SECRET as string,
        { expiresIn: "7d" } // Token valid for 7 days
      );

      // Send invitation email
      await emailServer.emailController("ClientUserInvitation", {
        token: invitationToken,
        toEmail: email,
        organizationName: authUser?.organizationName as string,
        storeName: store?.name,
        clientUrl: (req.headers["client-url"] as string) || req.headers.origin,
      });

      res.status(200).json({ message: "Invitation email sent successfully", success: "SUCCESS" });
    } catch (error) {
      return next(new CustomError(`Error sending invitation, ${error}`, 500));
    }
  }

 async AddClientUser(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { username, phone, password, permissions, role, organization, token } = req.body;

      // Verify JWT token
      let decodedToken;
      try {
        decodedToken = jwt.verify(token, config.appConstant.JWT_INVITATION_SECRET as string) as {
          tenantId: string;
          email: string;
          organizationName: string;
          storeId: string;
          role?: string;
        };
      } catch (error) {
        return next(new CustomError("Invalid or expired reset token", 400));
      }

      // Check if user already exists
      const existingUser = await prisma.user.findFirst({
        where: { email: decodedToken.email, source: SourceKey.Portal, tenantId: decodedToken.tenantId, storeId: decodedToken.storeId },
      });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Hash the password
      const hashedPassword = await bcryptHelper.generateBcryptPassword(password);

      // Determine the final role
      const finalRole = decodedToken.role || role || UserRole.USER;

      // Create new user within a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Create new user
        const newUser = await tx.user.create({
          data: {
            username: username,
            email: decodedToken.email,
            phone,
            password: hashedPassword,
            source: SourceKey.Portal,
            permissions: permissions,
            isActive: true,
            verified: true,
            role: finalRole,
            storeId: decodedToken.storeId,
            organizationName: decodedToken.organizationName,
            tenantId: decodedToken.tenantId,
          },
        });

        // If role is CLIENT, update the store's userId
        if (finalRole === UserRole.CLIENT) {
          await tx.store.update({
            where: { id: decodedToken.storeId },
            data: { userId: newUser.id }
          });
        }

        return newUser;
      });

      return res.status(201).json({ message: "Your email registered successfully", user: result });
    } catch (error) {
      return next(new CustomError(`Error creating user, ${error}`, 500));
    }
  }
}
