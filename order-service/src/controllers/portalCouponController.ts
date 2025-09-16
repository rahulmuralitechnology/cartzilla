import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";

export class PortalCouponController {
  async createCoupon(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const {
        code,
        description,
        startDate,
        endDate,
        userRedemption,
        totalRedemption,
        isActive,
        minimumPurchase,
        discountAmount,
        discountType,
        maxDiscount,
      } = req.body;

      const existingCoupon = await prisma.portalCoupon.findUnique({
        where: { code },
      });

      if (existingCoupon) {
        return next(new CustomError("Coupon with the same code already exists", 400));
      }

      const coupon = await prisma.portalCoupon.create({
        data: {
          code,
          description,
          startDate,
          endDate,
          userRedemption,
          totalRedemption,
          isActive,
          minimumPurchase,
          discountAmount,
          discountType,
          maxDiscount,
        },
      });

      res.status(201).json({
        success: "SUCCESS",
        data: { coupon },
        message: "Coupon created successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error creating coupon: ${error.message}`, 500));
    }
  }

  async getCoupons(req: Request, res: Response, next: NextFunction) {
    try {
      const { all } = req.query;
      let whereClause: any = {};
      if (all === "false") {
        whereClause.isActive = true;
      }
      const coupons = await prisma.portalCoupon.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: "SUCCESS",
        data: { coupons },
        message: "Coupons retrieved successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving coupons: ${error.message}`, 500));
    }
  }

  async updateCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingCoupon = await prisma.portalCoupon.findUnique({
        where: { id },
      });

      if (!existingCoupon) {
        return next(new CustomError("Coupon not found", 404));
      }

      const updatedCoupon = await prisma.portalCoupon.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: "SUCCESS",
        data: { coupon: updatedCoupon },
        message: "Coupon updated successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating coupon: ${error.message}`, 500));
    }
  }

  async deleteCoupon(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingCoupon = await prisma.portalCoupon.findUnique({
        where: { id },
      });

      if (!existingCoupon) {
        return next(new CustomError("Coupon not found", 404));
      }

      await prisma.portalCoupon.delete({
        where: { id },
      });

      res.json({
        success: "SUCCESS",
        message: "Coupon deleted successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting coupon: ${error.message}`, 500));
    }
  }
}
