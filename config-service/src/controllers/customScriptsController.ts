import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";

export class CustomScriptController {
  async createOrUpdateCustomScript(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { storeId, scripts } = req.body;

      // Check if store exists
      const store = await prisma.store.findUnique({
        where: { id: storeId },
      });

      if (!store) {
        return next(new CustomError("Store not found", 404));
      }

      // Find existing script
      const existingScript = await prisma.customScript.findFirst({
        where: { storeId },
      });

      let script;
      if (existingScript) {
        // Update existing script
        script = await prisma.customScript.update({
          where: { id: existingScript.id },
          data: {
            scripts,
          },
        });
      } else {
        // Create new script
        script = await prisma.customScript.create({
          data: {
            storeId,
            scripts,
          },
        });
      }

      res.status(201).json({
        success: "SUCCESS",
        data: { customScript: script },
        message: "Custom script saved successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error saving custom script: ${error.message}`, 500));
    }
  }

  async updateCustomScript(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { scripts } = req.body;

      const existingScript = await prisma.customScript.findUnique({
        where: { id },
      });

      if (!existingScript) {
        return next(new CustomError("Custom script not found", 404));
      }

      const updatedScript = await prisma.customScript.update({
        where: { id },
        data: { scripts },
      });

      res.json({
        success: "SUCCESS",
        data: { customScript: updatedScript },
        message: "Custom script updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating custom script: ${error.message}`, 500));
    }
  }

  async deleteCustomScript(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingScript = await prisma.customScript.findUnique({
        where: { id },
      });

      if (!existingScript) {
        return next(new CustomError("Custom script not found", 404));
      }

      await prisma.customScript.delete({
        where: { id },
      });

      res.json({
        success: "SUCCESS",
        message: "Custom script deleted successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting custom script: ${error.message}`, 500));
    }
  }

  async getCustomScriptByStore(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;

      const script = await prisma.customScript.findFirst({
        where: { storeId },
      });

      if (!script) {
        return next(new CustomError("No custom script found for this store", 404));
      }

      res.json({
        success: "SUCCESS",
        data: { scripts: script.scripts },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching custom script: ${error.message}`, 500));
    }
  }

  async getCustomScriptById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const script = await prisma.customScript.findUnique({
        where: { id },
        include: {
          store: true,
        },
      });

      if (!script) {
        return next(new CustomError("Custom script not found", 404));
      }

      res.json({
        success: "SUCCESS",
        data: { customScript: script },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching custom script: ${error.message}`, 500));
    }
  }
}
