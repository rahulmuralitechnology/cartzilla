import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";

export class SectionBuilderController {
  async createSection(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { name, description, schema, formData, type, status, styles, settings, analytics } = req.body;
      const { storeId } = req.params;

      const section = await prisma.sectionBuilder.create({
        data: {
          name,
          description,
          schema,
          formData,
          type,
          status,
          styles,
          settings,
          analytics,
          storeId,
        },
      });

      res.status(201).json({
        success: "SUCCESS",
        data: { section },
        message: "Section created successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error creating section: ${error.message}`, 500));
    }
  }

  async getSections(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const { type, status } = req.query;

      let whereClause: any = { storeId };

      if (type) {
        whereClause.type = type;
      }

      if (status) {
        whereClause.status = status;
      }

      const sections = await prisma.sectionBuilder.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: "SUCCESS",
        data: { sections },
        message: "Sections retrieved successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving sections: ${error.message}`, 500));
    }
  }

  async getSectionById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, storeId } = req.params;

      const section = await prisma.sectionBuilder.findFirst({
        where: {
          id,
          storeId,
        },
      });

      if (!section) {
        return next(new CustomError("Section not found", 404));
      }

      res.json({
        success: "SUCCESS",
        data: { section },
        message: "Section retrieved successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving section: ${error.message}`, 500));
    }
  }

  async updateSection(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, storeId } = req.params;
      const updateData = req.body;

      const existingSection = await prisma.sectionBuilder.findFirst({
        where: {
          id,
          storeId,
        },
      });

      if (!existingSection) {
        return next(new CustomError("Section not found", 404));
      }

      const updatedSection = await prisma.sectionBuilder.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: "SUCCESS",
        data: { section: updatedSection },
        message: "Section updated successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating section: ${error.message}`, 500));
    }
  }

  async deleteSection(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, storeId } = req.params;

      const existingSection = await prisma.sectionBuilder.findFirst({
        where: {
          id,
          storeId,
        },
      });

      if (!existingSection) {
        return next(new CustomError("Section not found", 404));
      }

      await prisma.sectionBuilder.delete({
        where: { id },
      });

      res.json({
        success: "SUCCESS",
        message: "Section deleted successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting section: ${error.message}`, 500));
    }
  }

  async publishSection(req: Request, res: Response, next: NextFunction) {
    try {
      const { id, storeId } = req.params;

      const existingSection = await prisma.sectionBuilder.findFirst({
        where: {
          id,
          storeId,
        },
      });

      if (!existingSection) {
        return next(new CustomError("Section not found", 404));
      }

      const publishedSection = await prisma.sectionBuilder.update({
        where: { id },
        data: {
          status: "published",
          publishedAt: new Date(),
        },
      });

      res.json({
        success: "SUCCESS",
        data: { section: publishedSection },
        message: "Section published successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error publishing section: ${error.message}`, 500));
    }
  }
}
