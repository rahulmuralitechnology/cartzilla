import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";
import crypto from "crypto";
import Razorpay from "razorpay";
import { UserRole } from "@prisma/client";

export class PlanController {
  // ... existing methods ...

  async addPlan(req: Request, res: Response, next: NextFunction) {
    try {
      const body = req.body;

      // Check for existing plan
      const existingPlan = await prisma.plan.findUnique({
        where: { name: body.name },
      });

      if (existingPlan) {
        return res.status(409).json({
          status: "FAILED",
          message: "A plan with the same name already exists.",
          data: null,
        });
      }

      const plan = await prisma.plan.create({
        data: {
          ...body,
          durationDays: 60,
        },
      });

      res.status(201).json({
        status: "SUCCESS",
        message: "Plan created successfully.",
        data: { plan },
      });
    } catch (error: any) {
      return next(new CustomError(`Error saving plan data: ${error.message}`, 500));
    }
  }

  async deletePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingPlan = await prisma.plan.findUnique({
        where: { id },
      });

      if (!existingPlan) {
        return next(new CustomError("Plan not found", 404));
      }

      await prisma.plan.delete({
        where: { id },
      });

      res.json({
        status: "SUCCESS",
        message: "Plan deleted successfully.",
        data: null,
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting plan: ${error.message}`, 500));
    }
  }

  async getAllPlans(req: Request, res: Response, next: NextFunction) {
    try {
      const plans = await prisma.plan.findMany();

      const filterPlan = plans.filter((p) => p.price !== 0);

      res.json({
        status: "SUCCESS",
        message: "Plans retrieved successfully.",
        data: filterPlan,
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching plans: ${error.message}`, 500));
    }
  }

  async updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingPlan = await prisma.plan.findUnique({
        where: { id },
      });

      if (!existingPlan) {
        return next(new CustomError("Plan not found", 404));
      }

      const updatedPlan = await prisma.plan.update({
        where: { id },
        data: updateData,
      });

      res.json({
        status: "SUCCESS",
        message: "Plan updated successfully.",
        data: { plan: updatedPlan },
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating plan: ${error.message}`, 500));
    }
  }

  // async updateStorePlan(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     const { storeId, planId } = req.body;
  //     const userId = req.user?.id; // Assuming user ID is available in request

  //     const userStore = await prisma.store.count({ where: { userId } });

  //     // Validate store existence
  //     const store = await prisma.store.findUnique({
  //       where: { id: storeId },
  //     });

  //     if (!store) {
  //       return next(new CustomError("Store not found", 404));
  //     }

  //     // Validate plan existence
  //     const plan = await prisma.plan.findUnique({
  //       where: { id: planId },
  //     });

  //     if (!plan) {
  //       return next(new CustomError("Plan not found", 404));
  //     }

  //     const now = new Date();
  //     const subscriptionStartDate = now;
  //     let subscriptionEndDate = new Date(now.getTime() + plan.durationDays * 86400000);

  //     if (userStore === 1) {
  //       const featuresValidation = plan.featuresValidation as any;
  //       subscriptionEndDate = new Date(now.getTime() + featuresValidation?.trial_days || plan.durationDays * 86400000);
  //     }

  //     const updatedStore = await prisma.store.update({
  //       where: { id: storeId },
  //       data: {
  //         subscriptionPlanId: plan.id,
  //         subscriptionStartDate,
  //         subscriptionEndDate,
  //         userId,
  //         paymentStatus: "ACTIVE",
  //       },
  //     });

  //     return res.json({
  //       status: "SUCCESS",
  //       message: "Free plan assigned successfully",
  //       data: updatedStore,
  //     });
  //   } catch (error: any) {
  //     console.log("error", error);
  //     return next(new CustomError(`Error updating store plan: ${error.message}`, 500));
  //   }
  // }

  async updateStorePlan(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId, price, planId, couponCode, razorpayPaymentId, razorpayOrderId, razorpaySignature, isAnnualSubscription } = req.body;
      const userId = req.user?.id; // Assuming user ID is available in request

      if (req.user?.role !== UserRole.SUPERADMIN && couponCode) {
        const existCouponCode = await prisma.portalCoupon.findUnique({
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

        if (existCouponCode) {
          await prisma.portalCouponRedemption.create({
            data: {
              couponId: existCouponCode?.id,
              userId: req?.user?.id as string,
              storeId: storeId as string,
              totalAmount: 0,
              amount: 0,
            },
          });
        }
      }

      const userStore = await prisma.store.count({ where: { userId } });

      // Validate store existence
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        return next(new CustomError("Store not found", 404));
      }

      // Validate plan existence
      const plan = await prisma.plan.findUnique({
        where: { id: planId },
      });

      if (!plan) {
        return next(new CustomError("Plan not found", 404));
      }

      // Helper to create Razorpay order
      async function CreateRazorpayOrder(planId: string, amount: number) {
        const razorpay = new Razorpay({
          key_id: process.env.RAZORPAY_KEY_ID!,
          key_secret: process.env.RAZORPAY_KEY_SECRET!,
        });

        const options = {
          amount: amount * 100, // amount in paise
          currency: "INR",
          receipt: `plan_${new Date().getTime()}`,
          payment_capture: 1,
        };

        try {
          const order = await razorpay.orders.create(options);

          await prisma.store.update({
            where: {
              id: storeId,
            },
            data: {
              subscriptionPlanId: planId,
              paymentStatus: "PENDING",
              isAnnualSubscription: isAnnualSubscription,
            },
          });

          return {
            status: "PENDING",
            message: "Razorpay order created",
            data: {
              razorpayOrderId: order.id,
              amount: order.amount,
              currency: order.currency,
              paymentStatus: "PENDING",
              razorpayKey: process.env.RAZORPAY_KEY_ID!,
            },
          };
        } catch (error: any) {
          console.log("error", error);
          throw new CustomError(`Failed to create Razorpay order: ${error.message}`, 500);
        }
      }

      // Handle paid plans
      if (!razorpayPaymentId || !razorpayOrderId || !razorpaySignature) {
        const razorpayResponse = await CreateRazorpayOrder(planId, price);
        return res.status(200).json(razorpayResponse);
      }

      // Helper to verify Razorpay payment
      async function VerifyRazorpayPayment(paymentId: string, orderId: string, signature: string) {
        const generatedSignature = crypto
          .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
          .update(orderId + "|" + paymentId)
          .digest("hex");

        return generatedSignature === signature;
      }

      // Verify Razorpay payment
      const isValidPayment = await VerifyRazorpayPayment(razorpayPaymentId, razorpayOrderId, razorpaySignature);

      if (!isValidPayment) {
        return next(new CustomError("Payment verification failed", 400));
      }

      // Handle free plan || req.user?.role === UserRole.SUPERADMIN
      if (userStore === 1) {
        const now = new Date();
        const subscriptionStartDate = now;
        const featuresValidation = plan?.featuresValidation as any;
        const durationDays = store?.isAnnualSubscription ? 360 : featuresValidation?.trial_days || plan?.durationDays;
        const subscriptionEndDate = new Date(now.getTime() + durationDays * 86400000);

        const updatedStore = await prisma.store.update({
          where: { id: storeId },
          data: {
            subscriptionPlanId: plan.id,
            subscriptionStartDate,
            subscriptionEndDate,
            userId,
            paymentStatus: "ACTIVE",
          },
        });

        return res.status(200).json({
          status: "SUCCESS",
          message: "plan activated successfully",
          data: updatedStore,
        });
      }

      // Update store with new plan details
      const now = new Date();
      const subscriptionStartDate = now;
      const durationDays = store?.isAnnualSubscription ? 360 : plan?.durationDays;
      const subscriptionEndDate = new Date(now.getTime() + durationDays * 86400000);

      const updatedStore = await prisma.store.update({
        where: { id: storeId },
        data: {
          subscriptionStartDate,
          subscriptionEndDate,
          paymentStatus: "ACTIVE",
          razorpayOrderId,
          razorpayPaymentId,
        },
      });

      res.json({
        status: "SUCCESS",
        message: "Subscription plan updated successfully",
        data: updatedStore,
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating store plan: ${error.message}`, 500));
    }
  }

  // ... existing methods ...
}
