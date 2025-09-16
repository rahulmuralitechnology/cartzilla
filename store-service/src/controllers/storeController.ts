import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";
import config from "../config";
import { type Store, User, UserRole } from "@prisma/client";
import emailServer from "../service/emailServer";

export class StoreController {
  async createStore(req: any, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const {
        name,
        description,
        logo,
        storeCategory,
        isPublished,
        publishUrl,
        previewUrl,
        seoTitle,
        seoDescription,
        appType,
        siteType,
        favicon,
        currentVersion,
        latestVersion,
        couponCode,
      } = req.body;

      const userInfo = req?.user as User;

      let existCouponCode = null;

      if (userInfo?.role !== UserRole.SUPERADMIN && couponCode) {
        existCouponCode = await prisma.portalCoupon.findUnique({
          where: {
            code: couponCode,
          },
        });

        if (!existCouponCode) {
          return next(new CustomError("Coupon code not found", 404));
        }

        const alreadyUserCoupon = await prisma.portalCouponRedemption.findFirst({
          where: {
            userId: req?.user?.id as string,
            couponId: existCouponCode?.id,
          },
        });

        if (alreadyUserCoupon) {
          return next(new CustomError("This coupon code has already been redeemed by your account", 400));
        }

        if (existCouponCode?.totalRedemption === existCouponCode?.userRedemption) {
          return next(new CustomError("Coupon code is not available", 400));
        }

        if (existCouponCode.endDate < new Date()) {
          return next(new CustomError("Coupon code is expired", 400));
        }

        await prisma.portalCoupon.update({
          where: {
            id: existCouponCode?.id,
          },
          data: {
            userRedemption: existCouponCode?.userRedemption + 1,
          },
        });
      }

      function generateRandomSubdomain(storeName: string): string {
        // Remove all spaces and slugify the store name (lowercase, replace non-alphanumeric with hyphens)
        const slug = storeName
          .toLowerCase()
          .replace(/\s+/g, "") // Remove all spaces
          .replace(/[^a-z0-9]/g, "-"); // Replace non-alphanumeric with hyphens

        const randomString = Math.random().toString(36).substring(2, 6); // 4 random characters
        return `${slug}-${randomString}`;
      }

      let generatedSubdomain = generateRandomSubdomain(name);
      const existingStore = await prisma.store.findUnique({
        where: { subdomain: generatedSubdomain },
      });
      if (existingStore) {
        generatedSubdomain = generateRandomSubdomain(name);
      }
      const domain = `${generatedSubdomain}.${config.appConstant.subdomain_domain}`;
      const uniqueId = generatedSubdomain;

      const store = await prisma.store.create({
        data: {
          name,
          description,
          logo,
          storeCategory,
          userId: req?.user?.id as string,
          subdomain: `${generatedSubdomain}.${config.appConstant.subdomain_domain}`,
          domain,
          uniqueId,
          isPublished: isPublished || false,
          publishUrl: publishUrl || "",
          previewUrl: previewUrl || "",
          seoTitle,
          seoDescription,
          appType,
          siteType,
          buildStatus: false,
          createdAt: new Date().toISOString(),
          favicon,
          currentVersion,
          latestVersion,
          couponCode,
        },
      });

      if (userInfo?.role !== UserRole.SUPERADMIN && existCouponCode) {
        await prisma.portalCouponRedemption.create({
          data: {
            couponId: existCouponCode?.id,
            userId: req?.user?.id as string,
            storeId: store?.id as string,
            totalAmount: 0,
            amount: 0,
          },
        });
      }

      res.status(201).json({
        success: "SUCCESS",
        data: { store },
        message: "Store created successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error creating store: ${error.message}`, 500));
    }
  }

  async updateStore(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { id } = req.params;
      const updateData = { ...req.body };
      delete updateData?.userId;
      delete updateData?.subscriptionPlanId; // Remove invalid field before update

      const existingStore = await prisma.store.findUnique({ where: { id } });
      if (!existingStore) {
        return next(new CustomError("Store not found", 404));
      }

      // Filter out any unknown fields from updateData
      const validFields = [
        "name",
        "description",
        "logo",
        "storeCategory",
        "subdomain",
        "domain",
        "uniqueId",
        "isPublished",
        "publishUrl",
        "previewUrl",
        "seoTitle",
        "seoDescription",
        "appType",
        "siteType",
        "buildStatus",
        "favicon",
        "currentVersion",
        "latestVersion",
        "couponCode",
        "ipAddress",
      ];

      const filteredUpdateData = Object.keys(updateData)
        .filter((key) => validFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = updateData[key];
          return obj;
        }, {} as any);

      const updatedStore = await prisma.store.update({
        where: { id },
        data: filteredUpdateData,
      });

      res.json({
        success: "SUCCESS",
        data: { store: updatedStore },
        message: "Store updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating store: ${error.message}`, 500));
    }
  }

  async assignStore(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { id } = req.params; // store id
      const { userId } = req.body; // user id to assign the store to

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Verify both store and user exist in a single query
      const [store, user] = await Promise.all([
        prisma.store.findUnique({
          where: { id },
          select: { id: true, userId: true, name: true }
        }),
        prisma.user.findUnique({
          where: { id: userId },
          select: { id: true, role: true, storeId: true, email: true, username: true }
        })
      ]);

      if (!store) {
        return res.status(404).json({ message: "Store not found" });
      }
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if user already has CLIENT role or upgrade them
      const shouldUpdateRole = user.role !== UserRole.CLIENT;

      // Update both store and user within a transaction
      const result = await prisma.$transaction(async (tx) => {
        // Update store with new userId
        const updatedStore = await tx.store.update({
          where: { id },
          data: { userId }
        });

        // Update user's storeId list
        const currentStoreIds = user.storeId ? user.storeId.split(',').filter(Boolean) : [];
        let newStoreIds: string[];
        
        if (currentStoreIds.includes(id)) {
          newStoreIds = currentStoreIds; // Store already assigned
        } else {
          newStoreIds = [...currentStoreIds, id];
        }

        // Prepare user update data
        const userUpdateData: any = {
          storeId: newStoreIds.join(',')
        };

        // Upgrade role to CLIENT if not already
        if (shouldUpdateRole) {
          userUpdateData.role = UserRole.CLIENT;
        }

        await tx.user.update({
          where: { id: userId },
          data: userUpdateData
        });

        return updatedStore;
      });

      return res.status(200).json({ 
        message: `Store "${store.name}" successfully assigned to user "${user.username || user.email}"`,
        success: true,
        data: result 
      });
    } catch (error: any) {
      return next(new CustomError(`Error assigning store: ${error.message}`, 500));
    }
  }

  async deleteStore(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingStore = await prisma.store.findUnique({ where: { id } });
      if (!existingStore) {
        return next(new CustomError("Store not found", 404));
      }

      await prisma.store.delete({ where: { id } });

      res.json({
        success: "SUCCESS",
        message: "Store deleted successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting store: ${error.message}`, 500));
    }
  }

  async getUserStores(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      const stores = await prisma.store.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: { userId },
      });

      res.json({
        success: "SUCCESS",
        data: { stores },
        message: "User stores retrieved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching user stores: ${error.message}`, 500));
    }
  }

  async getStoreById(req: any, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const store = await prisma.store.findUnique({
        where: { id },
      });
      if (!store) {
        return next(new CustomError("Store not found", 404));
      }

      res.json({
        success: "SUCCESS",
        data: { store },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching store: ${error.message}`, 500));
    }
  }

  async getAllStores(req: any, res: Response, next: NextFunction) {
    try {
      const user = req?.user as User;
      let stores: Store[] = [];
      if (user?.role === UserRole.SUPERADMIN) {
        stores = await prisma.store.findMany();
      } else if (user.role === UserRole.USER && user?.storeId) {
        stores = await prisma.store.findMany({
          where: {
            id: {
              in: user.storeId?.split(",").map((storeId) => storeId?.trim()),
            },
          },
        });
      } else {
        stores = await prisma.store.findMany({
          where: {
            userId: user?.id,
          },
        });
      }

      return res.json({
        success: "SUCCESS",
        data: { stores },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching stores: ${error.message}`, 500));
    }
  }

  // New payment-related methods
  async savePaymentMethod(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentMethods, upi, cash, pickup, razorpay, storeId } = req.body;

      const exErrors = validationResult(req);
      if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

      // Check for existing payment method configuration
      const existingPaymentMethod = await prisma.paymentMethod.findFirst({
        where: {
          storeId,
          paymentMethods: {
            hasSome: paymentMethods,
          },
        },
      });

      if (existingPaymentMethod) {
        // Update existing payment method
        const updatedPaymentMethod = await prisma.paymentMethod.update({
          where: { id: existingPaymentMethod.id },
          data: {
            paymentMethods,
            upi: upi || undefined,
            cash: cash || undefined,
            pickup: pickup || undefined,
            razorpay: razorpay || undefined,
            updatedAt: new Date(),
          },
        });

        return res.status(200).json({
          info: "Payment method configuration updated successfully.",
          success: true,
          data: updatedPaymentMethod,
        });
      }

      // Create new payment method
      const paymentMethodData = await prisma.paymentMethod.create({
        data: {
          storeId,
          paymentMethods,
          upi: upi || undefined,
          cash: cash || undefined,
          pickup: pickup || undefined,
          createdAt: new Date(),
        },
      });

      return res.status(200).json({
        paymentMethodData,
        success: true,
        message: "Payment method saved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error saving payment method: ${error.message}`, 500));
    }
  }

  async saveUPITransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const { transactionId, orderId, storeId, email } = req.body;

      const exErrors = validationResult(req);
      if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

      const transactionData = await prisma.uPITransaction.create({
        data: {
          transactionId,
          orderId,
          storeId,
          email: email || null,
          createdAt: new Date(),
        },
      });

      return res.status(200).json({
        transactionData,
        success: true,
        message: "Order UPI transaction saved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error saving UPI transaction: ${error.message}`, 500));
    }
  }

  async getStoreUPITransactions(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;

      // Validate required field
      if (!storeId) {
        return res.status(400).json({
          error: "storeId is required.",
          success: false,
        });
      }

      const transactions = await prisma.uPITransaction.findMany({
        where: { storeId },
      });

      return res.status(200).json({
        transactions,
        success: true,
        message: "Store UPI transactions retrieved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving UPI transactions: ${error.message}`, 500));
    }
  }

  async getStorePaymentMethods(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;

      // Validate storeId
      if (!storeId) {
        return res.status(400).json({
          error: "StoreId is required",
          success: false,
        });
      }

      // Fetch payment methods for the given storeId
      const paymentMethods = await prisma.paymentMethod.findMany({
        where: { storeId },
      });

      return res.status(200).json({
        paymentMethods: paymentMethods.length > 0 ? paymentMethods[0] : {},
        success: true,
        message: "Payment methods retrieved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving payment methods: ${error.message}`, 500));
    }
  }

  async saveShiprocketAuthInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId, email, password } = req.body;

      const exErrors = validationResult(req);
      if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

      // Check if auth info already exists for this store
      const existingAuth = await prisma.shiprocketAuth.findFirst({
        where: { storeId },
      });

      let result;
      if (existingAuth) {
        result = await prisma.shiprocketAuth.update({
          where: { id: existingAuth.id },
          data: {
            email,
            password,
            updatedAt: new Date(),
          },
        });
      } else {
        result = await prisma.shiprocketAuth.create({
          data: {
            storeId,
            email,
            password,
            createdAt: new Date(),
          },
        });
      }

      return res.status(200).json({
        shiprocketAuth: result,
        success: true,
        message: "Shiprocket auth info saved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error saving Shiprocket auth info: ${error.message}`, 500));
    }
  }

  async getOrderUPIPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId, orderId } = req.params;

      // Validate required fields
      if (!storeId || !orderId) {
        return res.status(400).json({
          error: "storeId and orderId are required.",
          success: false,
        });
      }

      const transactions = await prisma.uPITransaction.findMany({
        where: {
          storeId,
          orderId,
        },
      });

      return res.status(200).json({
        transactions,
        success: true,
        message: "Order UPI transactions retrieved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving order UPI transactions: ${error.message}`, 500));
    }
  }

  async updateWebhookStore(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { storeId } = req.params;
      const { buildStatus } = req.body;

      const existingStore = await prisma.store.findUnique({ where: { id: storeId } });
      if (!existingStore) {
        return next(new CustomError("Store not found", 404));
      }

      const updatedStore = await prisma.store.update({
        where: { id: storeId },
        data: {
          buildStatus,
        },
        include: {
          user: true,
        },
      });

      // Send reset password email
      await emailServer.emailController("SITE_PUBLISH_NOTIFICATION", {
        toEmail: updatedStore?.user?.email,
        firstName: updatedStore?.user?.username as string,
        link: `https://${updatedStore.domain}`,
      });

      res.json({
        success: "SUCCESS",
        data: {},
        message: "Store updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating store: ${error.message}`, 500));
    }
  }
  async updateStoreIpAddress(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { storeId } = req.params;
      const { ipAddress } = req.body;

      const existingStore = await prisma.store.findUnique({ where: { id: storeId } });
      if (!existingStore) {
        return next(new CustomError("Store not found", 404));
      }

      const updatedStore = await prisma.store.update({
        where: { id: storeId },
        data: {
          ipAddress,
        },
      });

      res.json({
        success: "SUCCESS",
        message: "IpAdress updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating store: ${error.message}`, 500));
    }
  }
}
