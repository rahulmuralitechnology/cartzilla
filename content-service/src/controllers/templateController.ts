import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";

export class TemplateController {
  async createTemplate(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { name, repoDirName, latestVersion, currentVersion, previewImage, previewUrl, isActive, templateType } = req.body;

      const existingTemplate = await prisma.template.findUnique({
        where: { repoDirName },
      });

      if (existingTemplate) {
        return next(new CustomError("Template with the same repoDirName already exists", 400));
      }

      const template = await prisma.template.create({
        data: {
          name,
          repoDirName,
          latestVersion: latestVersion || "0.0.0",
          currentVersion,
          templateType,
          isActive,
          previewImage,
          previewUrl,
        },
      });

      res.status(201).json({
        success: "SUCCESS",
        data: { template },
        message: "Template created successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error creating template: ${error.message}`, 500));
    }
  }

  async getTemplates(req: Request, res: Response, next: NextFunction) {
    try {
      const { all } = req.query;
      let whereClaouse: any = {};
      if (all === "false") {
        whereClaouse.isActive = true;
      }
      const templates = await prisma.template.findMany({
        where: whereClaouse,
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: "SUCCESS",
        data: { templates },
        message: "Templates retrieved successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving templates: ${error.message}`, 500));
    }
  }

  async getActiveTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const templates = await prisma.template.findMany({
        where: {
          isActive: true,
        },
      });

      if (!templates) {
        return next(new CustomError("Active template not found", 404));
      }

      res.json({
        success: "SUCCESS",
        data: { templates },
        message: "Template retrieved successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving template: ${error.message}`, 500));
    }
  }

  async updateLatestVersion(req: Request, res: Response, next: NextFunction) {
    try {
      const { latestVersion, repoDirName } = req.body;

      const existingTemplate = await prisma.template.findUnique({
        where: { repoDirName },
      });

      if (!existingTemplate) {
        return next(new CustomError("Template not found", 404));
      }

      const updatedTemplate = await prisma.template.update({
        where: { repoDirName },
        data: { latestVersion },
      });

      res.json({
        success: "SUCCESS",
        data: { template: updatedTemplate },
        message: "Template latest version updated successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating template latest version: ${error.message}`, 500));
    }
  }

  async updateTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingTemplate = await prisma.template.findUnique({
        where: { id },
      });

      if (!existingTemplate) {
        return next(new CustomError("Template not found", 404));
      }

      const updatedTemplate = await prisma.template.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: "SUCCESS",
        data: { template: updatedTemplate },
        message: "Template updated successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating template: ${error.message}`, 500));
    }
  }

  async deleteTemplate(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingTemplate = await prisma.template.findUnique({
        where: { id },
      });

      if (!existingTemplate) {
        return next(new CustomError("Template not found", 404));
      }

      await prisma.template.delete({
        where: { id },
      });

      res.json({
        success: "SUCCESS",
        message: "Template deleted successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting template: ${error.message}`, 500));
    }
  }
}
