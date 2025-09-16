import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";

export class CustomThemeController {
  async requestCustomTheme(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const bodyPayload = req.body;

      const theme = await prisma.themeRequest.create({
        data: {
          ...bodyPayload,
        },
      });

      res.status(201).json({
        success: "SUCCESS",
        data: { themeRequest: theme },
        message: "Custom theme saved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error saving custom theme: ${error.message}`, 500));
    }
  }

  async getAllThemeRequests(req: Request, res: Response, next: NextFunction) {
    try {
      const themeRequests = await prisma.themeRequest.findMany();

      res.status(200).json({
        success: "SUCCESS",
        data: themeRequests,
        message: "Theme requests retrieved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving theme requests: ${error.message}`, 500));
    }
  }
}
