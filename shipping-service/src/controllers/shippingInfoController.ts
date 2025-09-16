import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";

export class ShippingInfoController {
  // Create
  async addShippingInfo(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const bodyPayload = req.body;
      let shippingInfo = null;

      if (bodyPayload?.id) {
        shippingInfo = await prisma.shippingInfo.update({
          where: { id: bodyPayload?.id },
          data: bodyPayload,
        });
      } else {
        shippingInfo = await prisma.shippingInfo.create({
          data: { ...bodyPayload },
        });
      }

      res.status(200).json({
        success: "SUCCESS",
        data: { shippingInfo },
        message: "Shipping info saved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error saving shipping info: ${error.message}`, 500));
    }
  }

  // Read all
  async getAllShippingInfos(req: Request, res: Response, next: NextFunction) {
    try {
      const shippingInfos = await prisma.shippingInfo.findMany();
      res.status(200).json({
        success: "SUCCESS",
        data: shippingInfos,
        message: "Shipping infos retrieved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving shipping infos: ${error.message}`, 500));
    }
  }

  // Read one
  async getShippingInfoByStoreId(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const shippingInfo = await prisma.shippingInfo.findUnique({ where: { storeId: storeId } });
      res.status(200).json({
        success: "SUCCESS",
        data: {
          shippingInfo,
        },
        message: "Shipping info retrieved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving shipping info: ${error.message}`, 500));
    }
  }

  // Update
  async updateShippingInfo(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { id } = req.params;
      const updateData = req.body;
      const updated = await prisma.shippingInfo.update({
        where: { id },
        data: updateData,
      });
      res.status(200).json({
        success: "SUCCESS",
        data: updated,
        message: "Shipping info updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating shipping info: ${error.message}`, 500));
    }
  }

  // Delete
  async deleteShippingInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      await prisma.shippingInfo.delete({ where: { id } });
      res.status(200).json({
        success: "SUCCESS",
        message: "Shipping info deleted successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting shipping info: ${error.message}`, 500));
    }
  }
}
