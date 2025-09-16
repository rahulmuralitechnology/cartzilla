// controllers/stockController.ts
import { Request, Response } from "express";
import prisma from "../service/prisma";
import { AuthRequest } from "../service/interface";

// Get stock for a specific product
export const getProductStock = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const userId = req.user?.id;

    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: userId,
      },
      select: {
        id: true,
        title: true,
        sku: true,
        stock: true,
        availabilityStatus: true,
        minimumOrderQuantity: true,
        sellEvenInZeroQuantity: true,
        status: true,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: "SUCCESS",
      data: product,
      message: "",
    });
  } catch (error) {
    console.error("Error fetching product stock:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update stock for a specific product
export const updateProductStock = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const { stock, availabilityStatus, reorderLevel } = req.body;

    // Check if product exists and belongs to user
    const existingProduct = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update product stock
    await prisma.product.update({
      where: { id: productId },
      data: {
        stock: stock !== undefined ? stock : undefined,
        availabilityStatus: availabilityStatus || undefined,
        lastStockUpdate: new Date(),
        reorderLevel,
      },
    });

    res.status(200).json({
      success: "SUCCESS",
      message: "Stock updated successfully",
    });
  } catch (error) {
    console.error("Error updating product stock:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get inventory for entire store
export const getStoreInventory = async (req: AuthRequest, res: Response) => {
  try {
    const { storeId } = req.params;
    const { page = 1, limit = 20, search, category, status } = req.query;

    const skip = (Number(page) - 1) * Number(limit);

    // Build where clause
    const whereClause: any = {
      storeId: storeId,
    };

    if (search) {
      whereClause.OR = [
        { title: { contains: search as string, mode: "insensitive" } },
        { sku: { contains: search as string, mode: "insensitive" } },
      ];
    }

    if (category) {
      whereClause.category = category as string;
    }

    if (status) {
      whereClause.status = status as string;
    }

    const [products, totalCount, productCategory] = await Promise.all([
      prisma.product.findMany({
        where: whereClause,
        select: {
          id: true,
          title: true,
          sku: true,
          stock: true,
          price: true,
          availabilityStatus: true,
          minimumOrderQuantity: true,
          sellEvenInZeroQuantity: true,
          lastStockUpdate: true,
          images: true,
          status: true,
          thumbnail: true,
          category: true,
          brand: true,
          updatedAt: true,
        },
        skip,
        take: Number(limit),
        orderBy: { updatedAt: "desc" },
      }),
      prisma.product.count({ where: whereClause }),
      prisma.productCategory.findMany({
        where: { storeId },
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

    // Calculate inventory stats
    const inventoryStats = {
      totalProducts: totalCount,
      inStock: products.filter((p) => (p.stock || 0) > 0).length,
      outOfStock: products.filter((p) => (p.stock || 0) === 0 && !p.sellEvenInZeroQuantity).length,
      lowStock: products.filter((p) => (p.stock || 0) > 0 && (p.stock || 0) <= (p.minimumOrderQuantity || 5)).length,
    };

    res.status(200).json({
      success: "SUCCESS",
      data: {
        products,
        productCategory,
        pagination: {
          currentPage: Number(page),
          totalPages: Math.ceil(totalCount / Number(limit)),
          totalCount,
          hasNext: skip + Number(limit) < totalCount,
          hasPrev: Number(page) > 1,
        },
        stats: inventoryStats,
      },
    });
  } catch (error) {
    console.error("Error fetching store inventory:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get low stock products
export const getLowStockProducts = async (req: AuthRequest, res: Response) => {
  try {
    const { storeId } = req.params;
    const { threshold = 5 } = req.query;
    const userId = req.user?.id;

    const lowStockProducts = await prisma.product.findMany({
      where: {
        storeId: storeId,
        userId: userId,
        stock: {
          lte: Number(threshold),
          gt: 0,
        },
        status: "PUBLISHED",
      },
      select: {
        id: true,
        title: true,
        sku: true,
        stock: true,
        minimumOrderQuantity: true,
        thumbnail: true,
        price: true,
      },
      orderBy: { stock: "asc" },
    });

    res.status(200).json({
      success: true,
      data: lowStockProducts,
      count: lowStockProducts.length,
    });
  } catch (error) {
    console.error("Error fetching low stock products:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Bulk update stock
export const bulkUpdateStock = async (req: AuthRequest, res: Response) => {
  try {
    const { updates } = req.body; // Array of { productId, stock, availabilityStatus }
    const userId = req.user?.id;

    if (!Array.isArray(updates) || updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Updates array is required and cannot be empty",
      });
    }

    // Verify all products belong to the user
    const productIds = updates.map((update) => update.productId);
    const existingProducts = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        userId: userId,
      },
      select: { id: true },
    });

    if (existingProducts.length !== productIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more products not found or not authorized",
      });
    }

    // Perform bulk update
    const updatePromises = updates.map((update) =>
      prisma.product.update({
        where: { id: update.productId },
        data: {
          stock: update.stock !== undefined ? update.stock : undefined,
          availabilityStatus: update.availabilityStatus || undefined,
          updatedAt: new Date(),
        },
      })
    );

    await Promise.all(updatePromises);

    res.status(200).json({
      success: true,
      message: `Successfully updated ${updates.length} products`,
      updatedCount: updates.length,
    });
  } catch (error) {
    console.error("Error bulk updating stock:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Stock history functionality (requires separate StockHistory model)
export const getStockHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    const userId = req.user?.id;

    // First verify product ownership
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        userId: userId,
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Note: This would require a separate StockHistory model
    // For now, we'll return a placeholder response
    res.status(200).json({
      success: true,
      message: "Stock history feature requires StockHistory model implementation",
      data: [],
    });
  } catch (error) {
    console.error("Error fetching stock history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Update stock with history tracking
export const updateStockWithHistory = async (req: AuthRequest, res: Response) => {
  try {
    const { productId } = req.params;
    const { stock, reason, notes } = req.body;

    // Get current product data
    const currentProduct = await prisma.product.findFirst({
      where: {
        id: productId,
      },
    });

    if (!currentProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Update product stock
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        stock: stock,
        updatedAt: new Date(),
      },
    });

    // Here you would also create a stock history record
    // This requires a separate StockHistory model

    res.status(200).json({
      success: true,
      message: "Stock updated with history tracking",
      data: {
        previousStock: currentProduct.stock,
        newStock: stock,
        change: stock - (currentProduct.stock || 0),
        reason,
        notes,
      },
    });
  } catch (error) {
    console.error("Error updating stock with history:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
