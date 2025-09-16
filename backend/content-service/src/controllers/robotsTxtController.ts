import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";

export class RobotsTxtController {
  async createOrUpdateRobotsTxt(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { storeId, content, isActive = true, id } = req.body;

      // Check if store exists
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        return next(new CustomError("Store not found", 404));
      }
      let existingRobotsTxt;
      // Find existing robots.txt
      if (id) {
        existingRobotsTxt = await prisma.robotsTxt.findUnique({
          where: { id },
        });
      }

      let robotsTxt;
      if (existingRobotsTxt) {
        // Update existing robots.txt
        robotsTxt = await prisma.robotsTxt.update({
          where: { id: existingRobotsTxt.id },
          data: {
            content,
            isActive,
          },
        });
      } else {
        // Create new robots.txt
        robotsTxt = await prisma.robotsTxt.create({
          data: {
            storeId,
            content,
            isActive,
          },
        });
      }

      res.status(201).json({
        success: "SUCCESS",
        data: { robotsTxt },
        message: "Robots.txt saved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error saving robots.txt: ${error.message}`, 500));
    }
  }

  async updateRobotsTxt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { content, isActive } = req.body;

      const existingRobotsTxt = await prisma.robotsTxt.findUnique({
        where: { id },
      });

      if (!existingRobotsTxt) {
        return next(new CustomError("Robots.txt not found", 404));
      }

      const updatedRobotsTxt = await prisma.robotsTxt.update({
        where: { id },
        data: {
          content,
          ...(isActive !== undefined && { isActive }),
        },
      });

      res.json({
        success: "SUCCESS",
        data: { robotsTxt: updatedRobotsTxt },
        message: "Robots.txt updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating robots.txt: ${error.message}`, 500));
    }
  }

  async deleteRobotsTxt(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingRobotsTxt = await prisma.robotsTxt.findUnique({
        where: { id },
      });

      if (!existingRobotsTxt) {
        return next(new CustomError("Robots.txt not found", 404));
      }

      await prisma.robotsTxt.delete({
        where: { id },
      });

      res.json({
        success: "SUCCESS",
        message: "Robots.txt deleted successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting robots.txt: ${error.message}`, 500));
    }
  }

  async getRobotsTxtByStore(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;

      const robotsTxt = await prisma.robotsTxt.findMany({
        where: { storeId },
      });

      if (robotsTxt.length === 0) {
        return res.status(200).json({
          success: "SUCCESS",
          data: {},
        });
      }

      res.status(200).json({
        success: "SUCCESS",
        data: robotsTxt,
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching robots.txt: ${error.message}`, 500));
    }
  }

  async getRobotsTxtById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const robotsTxt = await prisma.robotsTxt.findUnique({
        where: { id },
        include: {
          store: true,
        },
      });

      if (!robotsTxt) {
        return next(new CustomError("Robots.txt not found", 404));
      }

      res.json({
        success: "SUCCESS",
        data: { robotsTxt },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching robots.txt: ${error.message}`, 500));
    }
  }

  async toggleRobotsTxtStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingRobotsTxt = await prisma.robotsTxt.findUnique({
        where: { id },
      });

      if (!existingRobotsTxt) {
        return next(new CustomError("Robots.txt not found", 404));
      }

      const updatedRobotsTxt = await prisma.robotsTxt.update({
        where: { id },
        data: { isActive: !existingRobotsTxt.isActive },
      });

      res.json({
        success: "SUCCESS",
        data: { robotsTxt: updatedRobotsTxt },
        message: `Robots.txt ${updatedRobotsTxt.isActive ? "activated" : "deactivated"} successfully.`,
      });
    } catch (error: any) {
      return next(new CustomError(`Error toggling robots.txt status: ${error.message}`, 500));
    }
  }
}
