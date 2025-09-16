import { NextFunction, Request, Response } from "express";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";

export class CustomerController {
  async getCustomerInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      // Fetch user profile information
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          Address: true,
        },
      });

      if (!user) {
        return next(new CustomError("User not found", 404));
      }

      // Fetch last 3 orders
      const orders = await prisma.order.findMany({
        where: { userId },
        include: {
          orderItems: true,
          billingAddress: true,
          shippingAddress: true,
        },
        orderBy: { createdAt: "desc" },
        take: 3,
      });

      // Fetch user addresses
      const addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
      });

      // Fetch payment information
      const payments = await prisma.payment.findMany({
        where: { orderId: { in: orders.map((order) => order.id) } },
        orderBy: { createdAt: "desc" },
      });

      res.json({
        success: "SUCCESS",
        data: {
          profile: {
            email: user.email,
            username: user.username,
            phone: user.phone,
            isActive: user.isActive,
            role: user.role,
          },
          address: addresses,
          lastOrders: orders,
          payments,
        },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching customer info: ${error.message}`, 500));
    }
  }
}
