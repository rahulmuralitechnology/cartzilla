import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";

export class SiteConfigController {
  async createOrUpdateSiteConfig(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const body = req.body;

      // Check if store exists
      const store = await prisma.store.findUnique({
        where: { id: body.storeId },
      });

      if (!store) {
        return next(new CustomError("Store not found", 404));
      }

      // Find existing configuration
      const existingConfig = await prisma.siteConfig.findFirst({
        where: {
          storeId: body.storeId,
        },
      });

      let config;
      if (existingConfig) {
        // Update existing configuration
        config = await prisma.siteConfig.update({
          where: { id: existingConfig.id },
          data: {
            siteConfig: JSON.stringify(body),
          },
        });
      } else {
        // Create new configuration
        config = await prisma.siteConfig.create({
          data: {
            storeId: body.storeId,
            siteConfig: JSON.stringify(body),
          },
        });
      }

      res.status(201).json({
        success: "SUCCESS",
        data: { siteConfig: config },
        message: "Site configuration saved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error saving site configuration: ${error.message}`, 500));
    }
  }

  async updateSiteConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingConfig = await prisma.siteConfig.findUnique({
        where: { id },
      });

      if (!existingConfig) {
        return next(new CustomError("Site configuration not found", 404));
      }

      const updatedConfig = await prisma.siteConfig.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: "SUCCESS",
        data: { siteConfig: updatedConfig },
        message: "Site configuration updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating site configuration: ${error.message}`, 500));
    }
  }

  async deleteSiteConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingConfig = await prisma.siteConfig.findUnique({
        where: { id },
      });

      if (!existingConfig) {
        return next(new CustomError("Site configuration not found", 404));
      }

      await prisma.siteConfig.delete({
        where: { id },
      });

      res.json({
        success: "SUCCESS",
        message: "Site configuration deleted successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting site configuration: ${error.message}`, 500));
    }
  }

  async getSiteConfigByStore(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.query;

      const configs = await prisma.siteConfig.findFirst({
        where: {
          storeId: storeId as string,
        },
        include: {
          store: {
            include: {
              subscriptionPlan: true,
            },
          },
        },
      });

      res.json({
        success: "SUCCESS",
        data: { ...configs, siteConfig: { ...JSON.parse(configs?.siteConfig as string), store: configs?.store } },
        message: "Site configuration retrieved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching site configurations: ${error.message}`, 500));
    }
  }

  async getSiteConfigById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const config = await prisma.siteConfig.findUnique({
        where: { id },
        include: {
          store: true,
        },
      });

      if (!config) {
        return next(new CustomError("Site configuration not found", 404));
      }

      res.json({
        success: "SUCCESS",
        data: { siteConfig: { ...config, siteConfig: { ...JSON.parse(config.siteConfig as string), store: config.store } } },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching site configuration: ${error.message}`, 500));
    }
  }
}
