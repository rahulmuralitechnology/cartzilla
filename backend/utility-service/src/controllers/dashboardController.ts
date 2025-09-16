import type { NextFunction, Request, Response } from "express";
import prisma from "../service/prisma";
import CustomError from "../utils/customError";
import { UserRole } from "@prisma/client";

export class DashboardController {
  async getMonthlyClientData(storeId?: string) {
    try {
      // Initialize an array for months (Jan-Dec)
      const months = Array(12).fill(0);

      // Query to fetch all users without a storeId or with specific storeId
      const whereClause = storeId
        ? { storeId }
        : {
            OR: [{ storeId: { equals: null } }, { storeId: { equals: "" } }, { storeId: { equals: "undefined" } }],
          };

      const users = await prisma.user.findMany({
        where: whereClause,
      });

      // Process the users to group by month
      users.forEach((user) => {
        const createdAt = new Date(user.createdAt); // Parse the createdAt field
        const monthIndex = createdAt.getMonth(); // Get the zero-based month (0 = Jan, 11 = Dec)
        months[monthIndex] += 1; // Increment the count for the respective month
      });

      // Convert to a chart-friendly format
      const monthlyData = months.map((count, index) => ({
        month: new Date(0, index).toLocaleString("default", { month: "short" }), // Jan, Feb, etc.
        count: count,
      }));

      return monthlyData;
    } catch (error: any) {
      throw new CustomError(`Error fetching monthly client data: ${error.message}`, 500);
    }
  }

  async getStoresPerClient() {
    try {
      // Query all users without a storeId
      const users = await prisma.user.findMany({
        where: {
          OR: [{ storeId: { equals: null } }, { storeId: { equals: "" } }, { storeId: { equals: "undefined" } }],
        },
        select: {
          id: true,
          username: true,
        },
      });

      // Create a map of user IDs to usernames for quick lookup
      const userMap = new Map(users.map((user) => [user.id, user.username]));

      // Query all stores
      const stores = await prisma.store.findMany();

      // Query all products
      const products = await prisma.product.findMany();

      // Aggregate product count by username
      const productCountMap: Record<string, number> = {};
      for (const product of products) {
        const username = userMap.get(product.userId);
        if (username) {
          productCountMap[username] = (productCountMap[username] || 0) + 1;
        }
      }

      // Aggregate store count by username
      const storeCountMap: Record<string, number> = {};
      for (const store of stores) {
        const username = userMap.get(store.userId);
        if (username) {
          storeCountMap[username] = (storeCountMap[username] || 0) + 1;
        }
      }

      // Convert to an array of results
      const result = Object.entries(storeCountMap).map(([username, count]) => ({
        username,
        numberOfStores: count,
        numberOfProducts: productCountMap[username] || 0,
      }));

      return result;
    } catch (error: any) {
      throw new CustomError(`Error fetching stores per client: ${error.message}`, 500);
    }
  }

  async getDashboardStats(req: Request, res: Response, next: NextFunction) {
    try {
      // Query to fetch the total count of stores
      const storeCount = await prisma.store.count();

      // Query to fetch the total count of products
      const productCount = await prisma.product.count();

      // Query to fetch the total count of product categories
      const productCategoryCount = await prisma.productCategory.count();

      // Query to fetch the total count of users without a storeId
      const usersCount = await prisma.user.count({
        where: {
          role: UserRole.CLIENT,
          OR: [{ storeId: { equals: null } }, { storeId: { equals: "" } }, { storeId: { equals: "undefined" } }],
        },
      });

      const storePerClient = await this.getStoresPerClient();
      const clientGrowthData = await this.getMonthlyClientData();

      res.status(200).json({
        success: "SUCCESS",
        message: "Stats found",
        data: {
          stats: {
            storeCount,
            totalProducts: productCount,
            totalCategories: productCategoryCount,
            totalClients: usersCount,
            storesPerClient: storePerClient,
            clientGrowthData,
          },
        },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching dashboard stats: ${error.message}`, 500));
    }
  }

  async getStoreStats(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      if (!id) {
        return next(new CustomError("Store ID is required", 400));
      }

      // Query to fetch the total count of products for this store
      const productCount = await prisma.product.count({
        where: { storeId: id },
      });

      // Query to fetch the total count of product categories for this store
      const productCategoryCount = await prisma.productCategory.count({
        where: { storeId: id },
      });

      // Query to fetch the total count of users for this store
      const usersCount = await prisma.user.count({
        where: { storeId: id, role: UserRole.CUSTOMER },
      });

      const clientGrowthData = await this.getMonthlyClientData(id);
      const totalOrders = await prisma.order.count({ where: { storeId: id } });

      // Query to fetch the total revenue for this store
      const totalRevenue = await prisma.order.aggregate({
        where: { storeId: id, status: "DELIVERED" },
        _sum: {
          totalAmount: true,
        },
      });

      // Query to fetch the total count of DELIVERED orders for this store
      const deliveredOrderCount = await prisma.order.count({
        where: { storeId: id, status: "DELIVERED" },
      });

      // Extract the revenue value or default to 0 if null
      const totalOrderRevenue = totalRevenue._sum.totalAmount || 0;

      res.status(200).json({
        success: "SUCCESS",
        message: "Stats found",
        data: {
          stats: {
            totalProducts: productCount,
            totalCategories: productCategoryCount,
            totalClients: usersCount,
            clientGrowthData,
            totalOrders: totalOrders,
            totalOrderRevenue,
            deliveredOrderCount,
          },
        },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching store stats: ${error.message}`, 500));
    }
  }
}
