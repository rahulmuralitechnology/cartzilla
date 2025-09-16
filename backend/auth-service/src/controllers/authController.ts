import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import bcryptHelper from "../utils/bcrypt";
import config from "../config";
import prisma from "../service/prisma";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import { User, UserRole } from "@prisma/client"; // Ensure this is the correct module for UserRole
import { sendOtpEmail } from "../service/azureEmailService";
import { ERPNextCustomerService } from "../service/erpNextService/customerService";

export enum SourceKey {
  Portal = "portal",
  Template = "template",
  Google = "google", // Add Google as a source
}

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.FRONTEND_URL}/auth/google/callback` // Update this with your actual callback URL
);

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { email, password, username, organizationName, permissions } = req.body;
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

      if (!source) {
        return res.status(400).json({ success: "FAILED", message: "'source' is required" });
      }

      // Only check for storeId when source is Template
      if (source === SourceKey.Template && !storeId) {
        return res.status(400).json({
          success: "FAILED",
          message: "Store ID is required for template register.",
        });
      }

      // Modify the user existence check based on source
      const existingUserQuery: any = { email };

      // Only include storeId in the query when source is Template
      if (source === SourceKey.Template) {
        existingUserQuery.storeId = storeId;
      }

      const existingUser = await prisma.user.findFirst({
        where: existingUserQuery,
      });

      if (existingUser) {
        return next(new CustomError("Email is already registered.", 409));
      }

      const hashPassword = await bcryptHelper.generateBcryptPassword(password);

      const userData: any = {
        email,
        username,
        organizationName,
        password: hashPassword,
        verified: false,
        role: source === SourceKey.Template ? UserRole.CUSTOMER : UserRole.CLIENT,
        source,
        isActive: false,
        permissions: permissions || [],
        createdAt: new Date().toISOString(),
      };

      // Only include storeId in user data when source is Template
      if (source === SourceKey.Template) {
        userData.storeId = storeId as string;
      }

      const user = await prisma.user.create({
        data: userData,
      });

      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpiry = new Date();
      otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

      const otpCreate = await prisma.otp.create({
        data: {
          code: otp,
          expiresAt: otpExpiry,
          userId: user.id,
        },
      });

      await sendOtpEmail({
        fromEmail: config.appConstant.BUSINESS_EMAIL,
        toEmail: user.email,
        subject: "Email Verification OTP",
        name: user.username as string,
        otp: otp,
      });

      if (source === SourceKey?.Template) {
        try {
          const store = await prisma.store.findUnique({ where: { id: storeId }, include: { StoreErpNext: true } });
          const erpConfig: any = store?.StoreErpNext?.[0];
          if (erpConfig?.apiKey) {
            const erpClient = new ERPNextCustomerService({
              apiKey: erpConfig.apiKey,
              baseUrl: erpConfig.baseUrl,
              apiSecret: erpConfig.apiSecret,
              defaultCustomerGroup: store?.name!,
              defaultTerritory: store?.name!,
            });

            const erpResult = await erpClient.createCustomer({
              name: user.username!,
              email: user.email,
              id: user.id,
            });
          }
        } catch (error: any) {
          console.log("Error while create user on ERPNext", error);
        }
      }

      res.status(201).json({
        success: "SUCCESS",
        message: "User created. Please verify your email.",
      });
    } catch (error) {
      console.log(error, "error");
      return next(new CustomError("Error creating user", 500));
    }
  }

  async signin(req: Request, res: Response, next: NextFunction) {
    try {
      const exErrors = validationResult(req);
      if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

      const { email, password } = req.body;
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

      if (!email || !password) {
        return res.status(400).json({
          success: "FAILED",
          message: "Email and password are required.",
        });
      }

      if (!source) {
        return res.status(400).json({ success: "FAILED", message: "'source' is required" });
      }

      // Only check for storeId when source is Template
      if (source === SourceKey.Template && !storeId) {
        return res.status(400).json({
          success: "FAILED",
          message: "Store ID is required for template login.",
        });
      }

      // Modify user query based on source
      let userQuery: any = { email, source };

      // Only include storeId in the query when source is Template
      if (source === SourceKey.Template) {
        userQuery.storeId = storeId;
      }

      const user = await prisma.user.findFirst({ where: userQuery, include: { Store: { select: { id: true } } } });

      if (!user) {
        return res.status(401).json({ success: "FAILED", message: "Email is not registered." });
      }

      const passwordMatch = await bcryptHelper.validateBcryptPassword(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ success: "FAILED", message: "Invalid password." });
      }

      if (!user.verified) {
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpiry = new Date();
        otpExpiry.setMinutes(otpExpiry.getMinutes() + 10);

        await prisma.otp.update({
          where: { userId: user.id },
          data: { code: otp, expiresAt: otpExpiry },
        });

        await sendOtpEmail({
          fromEmail: config.appConstant.BUSINESS_EMAIL,
          toEmail: user.email,
          subject: "Email Verification OTP",
          name: user.username as string,
          otp: otp,
        });

        return res.status(200).json({
          success: "FAILED",
          message: "Your account is not verified! Please verify your account",
          otpSend: true,
        });
      }

      if (!user.isActive) {
        return res.status(401).json({
          success: "FAILED",
          message: "Sorry, You are not an active user",
        });
      }

      const payload = {
        email: user.email,
        userId: user.id,
        isActive: user.isActive,
      };

      const token = bcryptHelper.generateJWTToken(payload, config.appConstant.LOGIN_EXPIRE, config.appConstant.JWT_LOGIN_SECRET_KEY);

      return res.status(200).json({
        success: "SUCCESS",
        message: "You are logged in successfully",
        data: { token, userId: user.id, store: user.Store?.length },
      });
    } catch (error: any) {
      return next(new CustomError(error.message, 500));
    }
  }

  async verifyAuthOtp(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp } = req.body;
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

      // Create query based on source
      let userQuery: any = { email, source };

      // Only include storeId in the query when source is Template
      if (source === SourceKey.Template) {
        userQuery.storeId = storeId;
      }

      const existingUser = await prisma.user.findFirst({
        where: userQuery,
      });

      if (!existingUser) {
        return res.status(409).json({ success: "FAILED", message: "Email is not registered." });
      }

      const userOtp = await prisma.otp.findFirst({
        where: { userId: existingUser.id, code: otp },
      });
      if (!userOtp) {
        return res.status(404).json({ message: "Invalid OTP", success: "FAILED" });
      }

      if (new Date() > userOtp.expiresAt) {
        return res.status(404).json({ message: "OTP Expired", success: "FAILED" });
      }

      await prisma.user.update({
        where: { id: existingUser.id },
        data: { verified: true, isActive: true },
      });

      await prisma.otp.delete({ where: { id: userOtp.id } });

      return res.status(200).json({
        success: "SUCCESS",
        message: "Your email is verified successfully! Now you can login",
      });
    } catch (error: any) {
      return next(new CustomError(`Internal Server Error: ${error.message}`, 500));
    }
  }

  async googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.query;

      // Generate state parameter containing storeId if provided
      const state = storeId ? Buffer.from(JSON.stringify({ storeId })).toString("base64") : undefined;

      const url = googleClient.generateAuthUrl({
        access_type: "offline",
        scope: ["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email"],
        state: state,
      });

      res.redirect(url);
    } catch (error: any) {
      return next(new CustomError(`Error initiating Google authentication: ${error.message}`, 500));
    }
  }

  async googleAuthCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, state } = req.query;

      // Decode state parameter to get storeId if provided
      let storeId: string | undefined;
      if (state) {
        try {
          const decodedState = JSON.parse(Buffer.from(state as string, "base64").toString());
          storeId = decodedState.storeId;
        } catch (error) {
          console.error("Failed to parse state parameter:", error);
        }
      }

      const { tokens } = await googleClient.getToken(code as string);
      googleClient.setCredentials(tokens);

      const ticket = await googleClient.verifyIdToken({
        idToken: tokens.id_token!,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email) {
        return res.status(400).json({
          success: "FAILED",
          message: "Email not found in Google profile",
        });
      }

      // Determine source based on context
      const source = storeId ? SourceKey.Template : SourceKey.Portal;

      // Create query based on source
      let userQuery: any = { email: payload.email, source };

      // Only include storeId in the query when source is Template
      if (source === SourceKey.Template) {
        userQuery.storeId = storeId;
      }

      // Check if user exists
      let user = await prisma.user.findFirst({
        where: userQuery,
      });

      if (!user) {
        // If user doesn't exist with the given source and storeId, check if they exist at all
        const existingUser = await prisma.user.findFirst({
          where: { email: payload.email, storeId: storeId },
        });

        // Create user data object
        const userData: any = {
          email: payload.email,
          username: existingUser
            ? existingUser.username || payload.name || payload.email.split("@")[0]
            : payload.name || payload.email.split("@")[0],
          password: existingUser ? existingUser.password : await bcryptHelper.generateBcryptPassword(Math.random().toString(36).slice(-8)),
          googleId: payload.sub,
          verified: true,
          isActive: true,
          role: source === SourceKey.Template ? UserRole.CUSTOMER : UserRole.CLIENT,
          source,
          organizationName: existingUser ? existingUser.organizationName || payload.name : payload.name,
          createdAt: new Date().toISOString(),
        };

        // Only include storeId when source is Template
        if (source === SourceKey.Template) {
          userData.storeId = storeId as string;
        }

        // Create the user
        user = await prisma.user.create({
          data: userData,
        });
      } else {
        // Update the existing user with Google ID if not already set
        if (!user.googleId) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: {
              googleId: payload.sub,
              verified: true,
              isActive: true,
            },
          });
        }
      }

      // Generate JWT token
      const tokenPayload = {
        email: user.email,
        username: user.username,
        userId: user.id,
        isActive: user.isActive,
        role: user.role,
        organizationName: user.organizationName,
      };

      const token = bcryptHelper.generateJWTToken(tokenPayload, config.appConstant.LOGIN_EXPIRE, config.appConstant.JWT_LOGIN_SECRET_KEY);

      // Redirect to frontend with token
      res.redirect(`${process.env.FRONTEND_URL}/auth/google/callback?token=${token}&userId=${user.id}`);
    } catch (error: any) {
      return next(new CustomError(`Error during Google authentication: ${error.message}`, 500));
    }
  }

  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = req.query;
    const pageNumber = Number(page);
    try {
      const userCount = await prisma.user.count({ where: { role: { notIn: [UserRole.USER, UserRole.CUSTOMER] } } });
      const users = await prisma.user.findMany({
        where: {
          role: {
            notIn: [UserRole.USER, UserRole.CUSTOMER],
          },
        },
        take: Number(pageSize),
        skip: (pageNumber - 1) * Number(pageSize),
        select: {
          id: true,
          email: true,
          username: true,
          organizationName: true,
          phone: true,
          role: true,
          whatsapp: true,
          whatsappOptIn: true,
          source: true,
          isActive: true,
          verified: true,
          createdAt: true,
          storeId: true,
          permissions: true,
          Store: {
            select: {
              id: true,
              name: true,
              domain: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        message: "Users retrieved successfully",
        data: {
          clients: users,
          totalUsers: userCount,
        },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching users: ${error.message}`, 500));
    }
  }
  async getAllClientUsers(req: any, res: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = req.query;
    const { storeId, tenantId } = req.params as { storeId: string; tenantId: string };
    const pageNumber = Number(page);

    try {
      const userCount = await prisma.user.count({
        where: {
          role: UserRole.USER,
          tenantId: tenantId,
          storeId: {
            contains: storeId,
          },
          source: SourceKey.Portal,
        },
      });
      const users = await prisma.user.findMany({
        where: {
          role: UserRole.USER,
          tenantId: tenantId,
          storeId: {
            contains: storeId,
          },
        },
        take: Number(pageSize),
        skip: (pageNumber - 1) * Number(pageSize),
        select: {
          id: true,
          email: true,
          username: true,
          organizationName: true,
          phone: true,
          role: true,
          source: true,
          isActive: true,
          verified: true,
          createdAt: true,
          storeId: true,
          permissions: true,
          Store: {
            select: {
              id: true,
              name: true,
              domain: true,
            },
          },
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        message: "Users retrieved successfully",
        data: {
          clients: users,
          totalUsers: userCount,
        },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching users: ${error.message}`, 500));
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;
      const { username, organizationName, isActive, phone, whatsapp, role, id, whatsappOptIn, permissions, profileImage } = req.body;

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

      // Update user data
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          username: username || existingUser.username,
          organizationName: organizationName || existingUser.organizationName,
          isActive: isActive !== undefined ? isActive : existingUser.isActive,
          phone: phone || existingUser.phone,
          whatsapp: whatsapp,
          whatsappOptIn: whatsappOptIn,
          role: role || existingUser.role,
          permissions: permissions || existingUser.permissions,
          profileImage: profileImage || existingUser.profileImage,
          updatedAt: new Date().toISOString(),
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating user: ${error.message}`, 500));
    }
  }

  async getAllCustomers(req: Request, res: Response, next: NextFunction) {
    const { page = 1, pageSize = 10 } = req.query;
    const { storeId } = req.params as { storeId: string };
    const pageNumber = Number(page);
    try {
      const userCount = await prisma.user.count({ where: { storeId: storeId, role: UserRole.CUSTOMER, source: SourceKey.Template } });
      const users = await prisma.user.findMany({
        where: { storeId: storeId, role: UserRole.CUSTOMER, source: SourceKey.Template },
        orderBy: { createdAt: "desc" },
        take: Number(pageSize),
        skip: (pageNumber - 1) * Number(pageSize),
        select: {
          id: true,
          email: true,
          username: true,
          organizationName: true,
          role: true,
          source: true,
          isActive: true,
          verified: true,
          createdAt: true,
          storeId: true,
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        message: "Users retrieved successfully",
        data: {
          customers: users,
          totalUsers: userCount,
        },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching users: ${error.message}`, 500));
    }
  }
}
