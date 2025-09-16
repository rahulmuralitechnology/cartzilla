import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import config from "../config";
import { sendContactEmail } from "../service/azureEmailService";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import CustomError from "../utils/customError";

dotenv.config();

const prisma = new PrismaClient();

export class EmailController {
  /**
   * Handle subscription contact form submission
   */
  async handleSubscriptionContact(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    const body = req.body;
    try {
      await sendContactEmail({
        fromEmail: process.env.SYSTEM_EMAIL_ADDRESS || "noreply@yourdomain.com",
        toEmail: config.appConstant.BUSINESS_EMAIL,
        subject: "Subscription Contact Us",
        name: body.name,
        email: body.email,
        phone: body.phone || "Not provided",
        message: body.message,
      });

      return res.status(200).json({
        message: "Email sent successfully",
        user: req.user,
        success: true,
      });
    } catch (error: any) {
      return next(error);
    }
  }

  /**
   * Handle general contact form submission
   */
  async handleContactForm(req: Request, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(validationErrorHandler(errors));

    const { name, email, phone, message, storeId, toEmail } = req.body;

    try {
      await prisma.contactSubmission.create({
        data: {
          name,
          email,
          phone: phone || null,
          message,
          storeId: storeId as string,
        },
      });

      await sendContactEmail({
        fromEmail: process.env.SYSTEM_EMAIL_ADDRESS || "noreply@yourdomain.com",
        toEmail,
        name,
        email,
        phone: phone || "Not provided",
        message,
        subject: "New Contact Form Submission",
      });

      return res.status(200).json({
        success: true,
        message:
          "Your message has been sent successfully. We'll get back to you soon.",
      });
    } catch (error) {
      console.error("Contact form submission error:", error);
      return next(error);
    }
  }

  /**
   * Get all contact emails for a specific store
   */
  async getContactEmailsByStoreId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { storeId } = req.params;

      if (!storeId) {
        return next(new CustomError("Store ID is required", 400));
      }

      // Use Prisma to fetch all contact submissions for the given storeId
      const contacts = await prisma.contactSubmission.findMany({
        where: {
          storeId: storeId,
        },
        orderBy: {
          createdAt: "desc", // Order by creation date, newest first
        },
      });

      return res.status(200).json({
        success: "SUCCESS",
        data: contacts,
      });
    } catch (error: any) {
      console.error("Error fetching contact emails:", error);
      return next(
        new CustomError(
          `Error retrieving contact emails: ${error.message}`,
          500
        )
      );
    }
  }
}
