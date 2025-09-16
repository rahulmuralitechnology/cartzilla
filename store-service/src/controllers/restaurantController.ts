import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";
import { transporter } from "../service/emailServer";
import config from "../config";

export class RestaurantController {
  constructor() {}

  // Email validation function (simple regex for email format validation)
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  async createMenuItem(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { name, description, price, image, dietary, category, userId, storeId } = req.body;

      const existingMenu = await prisma.menuItem.findFirst({
        where: {
          name,
          storeId,
        },
      });

      if (existingMenu) {
        return res.status(409).json({
          success: "FAILED",
          message: "Menu with the same name already exists.",
        });
      }

      const menuItem = await prisma.menuItem.create({
        data: {
          storeId,
          userId,
          name,
          description,
          price,
          image,
          dietary: JSON.stringify(dietary),
          category,
          createdAt: new Date().toISOString(),
        },
      });

      res.status(200).json({
        success: "SUCCESS",
        data: { menuItem },
        message: "Menu created successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error creating menu item: ${error.message}`, 500));
    }
  }

  async updateRestaurant(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingRestaurant = await prisma.menuItem.findUnique({
        where: { id },
      });
      if (!existingRestaurant) {
        return next(new CustomError("Restaurant not found", 404));
      }

      const updatedRestaurant = await prisma.menuItem.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: "SUCCESS",
        data: { restaurant: updatedRestaurant },
        message: "Restaurant updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating restaurant: ${error.message}`, 500));
    }
  }

  async deleteRestaurant(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingRestaurant = await prisma.menuItem.findUnique({
        where: { id },
      });
      if (!existingRestaurant) {
        return next(new CustomError("Restaurant not found", 404));
      }

      await prisma.menuItem.delete({ where: { id } });

      res.json({
        success: "SUCCESS",
        message: "Restaurant deleted successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting restaurant: ${error.message}`, 500));
    }
  }

  async getAllRestaurants(req: Request, res: Response, next: NextFunction) {
    const { id } = req.query as { id: string };
    try {
      const restaurants = await prisma.menuItem.findMany({
        orderBy: { createdAt: "desc" },
        where: {
          storeId: id,
        },
      });

      res.json({
        success: "SUCCESS",
        data: { restaurants },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching restaurants: ${error.message}`, 500));
    }
  }

  async getRestaurantById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query as { id: string };

      const restaurant = await prisma.menuItem.findMany({
        where: { storeId: id },
      });

      if (!restaurant) {
        return next(new CustomError("Restaurant not found", 404));
      }

      res.json({
        success: "SUCCESS",
        data: { menuList: restaurant },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching restaurant: ${error.message}`, 500));
    }
  }

  async getRestaurantsByStoreId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.query as { id: string };

      const restaurants = await prisma.menuItem.findMany({
        where: { storeId: id },
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: "SUCCESS",
        data: { menuList: restaurants.map((item) => ({ ...item })) },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching store restaurants: ${error.message}`, 500));
    }
  }

  async bulkCreateMenuItems(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const menuItems = req.body;

      if (!Array.isArray(menuItems) || menuItems.length === 0) {
        return res.status(400).json({
          success: "FAILED",
          message: "Request body must be a non-empty array.",
        });
      }

      // Validate and format menu items
      const formattedMenuItems = menuItems.map(({ name, description, price, image, dietary, category, userId, storeId }) => {
        if (!name || !storeId || !userId) {
          throw new CustomError("Each menu item must have a name, storeId, and userId.", 400);
        }
        return {
          storeId,
          userId,
          name,
          description,
          price,
          image,
          dietary,
          category,
          createdAt: new Date().toISOString(),
        };
      });

      // Ensure all items belong to the same store
      const storeIds = new Set(formattedMenuItems.map((item) => item.storeId));
      if (storeIds.size > 1) {
        return res.status(400).json({
          success: "FAILED",
          message: "All menu items must belong to the same store.",
        });
      }

      // Check for existing menu items with the same names
      const existingMenus = await prisma.menuItem.findMany({
        where: {
          AND: [{ storeId: formattedMenuItems[0].storeId }, { name: { in: formattedMenuItems.map((item) => item.name) } }],
        },
      });

      const existingMenuNames = new Set(existingMenus.map((item) => item.name));
      const newMenuItems = formattedMenuItems.filter((item) => !existingMenuNames.has(item.name));

      if (newMenuItems.length > 0) {
        await prisma.menuItem.createMany({
          data: newMenuItems,
        });
      }

      res.status(201).json({
        success: "SUCCESS",
        message: "Menu items uploaded successfully.",
        insertedCount: newMenuItems.length,
        skippedCount: formattedMenuItems.length - newMenuItems.length,
      });
    } catch (error: any) {
      return next(new CustomError(`Error uploading menu items: ${error.message}`, 500));
    }
  }

  // New method for handling reservations
  async createReservation(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { date, time, guests, occasion, name, email, phone, specialRequests, toEmail, storeId } = req.body;

      // Save reservation details in database using Prisma
      const reservation = await prisma.reservation.create({
        data: {
          date,
          time,
          guests: Number(guests),
          occasion,
          name,
          email,
          phone,
          specialRequests,
          toEmail,
          storeId,
          createdAt: new Date(),
        },
      });

      // Define the email message
      const emailMessage = {
        content: {
          subject: "New Reservation Submission",
          html: `
            <html>
              <head>
                <style>
                  body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f9;
                    margin: 0;
                    padding: 0;
                  }
                  .email-container {
                    width: 100%;
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #ffffff;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                  }
                  h1 {
                    color: #00bcd4;
                    font-size: 24px;
                    margin-bottom: 20px;
                  }
                  p {
                    font-size: 16px;
                    color: #555555;
                  }
                  .reservation-info {
                    margin: 20px 0;
                    padding: 10px;
                    background-color: #f9f9f9;
                    border-left: 5px solid #00bcd4;
                  }
                  .reservation-info p {
                    margin: 5px 0;
                  }
                  .footer {
                    font-size: 12px;
                    color: #888888;
                    margin-top: 20px;
                    text-align: center;
                  }
                </style>
              </head>
              <body>
                <div class="email-container">
                  <h1>New Reservation Submission</h1>
                  <div class="reservation-info">
                    <p><strong>Date:</strong> ${date}</p>
                    <p><strong>Time:</strong> ${time}</p>
                    <p><strong>Guests:</strong> ${guests}</p>
                    <p><strong>Occasion:</strong> ${occasion || "N/A"}</p>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Phone:</strong> ${phone}</p>
                    <p><strong>Special Requests:</strong> ${specialRequests || "None"}</p>
                  </div>
                  <div class="footer">
                    <p>This is an automated message, please do not reply.</p>
                  </div>
                </div>
              </body>
            </html>`,
        },
      };

      const info = await transporter.sendMail({
        from: `Bloomi5 TEAM <${config.appConstant?.BLOOMI5_EMAIL}>`,
        to: toEmail,
        subject: emailMessage.content.subject,
        html: emailMessage.content.html,
      });

      console.log("Sending reservation email to:", toEmail);

      // Respond to the user
      res.status(200).json({
        success: "SUCCESS",
        message: "Your reservation has been submitted successfully.",
        data: { reservation },
      });
    } catch (error: any) {
      console.error("Error processing reservation:", error);
      return next(new CustomError(`Error submitting reservation: ${error.message}`, 500));
    }
  }

  async getReservationsByStoreId(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const reservations = await prisma.reservation.findMany({
        where: { storeId: id },
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: "SUCCESS",
        data: { reservations },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching reservations: ${error.message}`, 500));
    }
  }
}
