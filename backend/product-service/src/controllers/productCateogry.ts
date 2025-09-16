import { NextFunction, Request, Response } from "express";
import { Result, validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";
import { SourceKey } from "./authController";
import { ERPNextClient } from "../service/erpNextService/client";
import { ProductCategoryService } from "../service/erpNextService/productCategory";

export class ProductCategoryController {
  // Category Methods
  async createCategory(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { name, description, storeId, userId, image } = req.body;
      const {
        source,
        storeId: stId,
        Storeid,
        storeid,
      } = req.headers as {
        source: SourceKey;
        storeId?: string;
        storeid?: string;
        Storeid?: string;
      };

      const existingCategory = await prisma.productCategory.findFirst({
        where: {
          name,
          storeId,
        },
      });

      if (existingCategory) {
        return res.status(409).json({
          success: "FAILED",
          message: "Category with the same name already exists.",
        });
      }

      const category = await prisma.productCategory.create({
        data: {
          name,
          description,
          storeId,
          userId,
          categoryImage: image,
        },
      });

      try {
        const store = await prisma.store.findUnique({ where: { id: storeId }, include: { StoreErpNext: true } });
        const erpConfig: any = store?.StoreErpNext?.[0];

        if (erpConfig?.apiKey && source === SourceKey.Portal) {
          const erpClient = new ERPNextClient({
            apiKey: erpConfig.apiKey,
            baseUrl: erpConfig.baseUrl,
            apiSecret: erpConfig.apiSecret,
            defaultCustomerGroup: store?.name!,
            defaultTerritory: store?.name!,
          });
          const restult = await new ProductCategoryService(erpClient).createProductCategory({
            name: category.name!,
            image: category?.categoryImage! || "",
            id: category.id,
          });
        }
      } catch (error) {
        console.log("Error while create product", error);
      }

      res.status(201).json({
        success: "SUCCESS",
        data: { category },
        message: "Category created successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error creating category: ${error.message}`, 500));
    }
  }

  async updateCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingCategory = await prisma.productCategory.findUnique({
        where: { id },
      });

      if (!existingCategory) {
        return next(new CustomError("Category not found", 404));
      }

      const updatedCategory = await prisma.productCategory.update({
        where: { id },
        data: {
          name: updateData.name || existingCategory.name,
          description: updateData.description || existingCategory.description,
          categoryImage: updateData.image || existingCategory.categoryImage,
        },
      });

      res.json({
        success: "SUCCESS",
        data: { category: updatedCategory },
        message: "Category updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating category: ${error.message}`, 500));
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingCategory = await prisma.productCategory.findUnique({
        where: { id },
        include: { subCategories: true },
      });

      if (!existingCategory) {
        return next(new CustomError("Category not found", 404));
      }

      // Delete all subcategories first
      if (existingCategory.subCategories.length > 0) {
        await prisma.productSubCategory.deleteMany({
          where: { categoryId: id },
        });
      }

      await prisma.productCategory.delete({ where: { id } });

      res.json({
        success: "SUCCESS",
        message: "Category and its subcategories deleted successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting category: ${error.message}`, 500));
    }
  }

  // SubCategory Methods
  async createSubCategory(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const { name, description, categoryId, image } = req.body;

      const existingCategory = await prisma.productCategory.findUnique({
        where: { id: categoryId },
      });

      if (!existingCategory) {
        return next(new CustomError("Parent category not found", 404));
      }

      const existingSubCategory = await prisma.productSubCategory.findFirst({
        where: {
          name,
          categoryId,
        },
      });

      if (existingSubCategory) {
        return res.status(409).json({
          success: "FAILED",
          message: "Subcategory with the same name already exists in this category.",
        });
      }

      const subCategory = await prisma.productSubCategory.create({
        data: {
          name,
          description,
          categoryId,
          image,
        },
      });

      res.status(201).json({
        success: "SUCCESS",
        data: { subCategory },
        message: "Subcategory created successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error creating subcategory: ${error.message}`, 500));
    }
  }

  async updateSubCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingSubCategory = await prisma.productSubCategory.findUnique({
        where: { id },
      });

      if (!existingSubCategory) {
        return next(new CustomError("Subcategory not found", 404));
      }

      const updatedSubCategory = await prisma.productSubCategory.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: "SUCCESS",
        data: { subCategory: updatedSubCategory },
        message: "Subcategory updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating subcategory: ${error.message}`, 500));
    }
  }

  async deleteSubCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingSubCategory = await prisma.productSubCategory.findUnique({
        where: { id },
      });

      if (!existingSubCategory) {
        return next(new CustomError("Subcategory not found", 404));
      }

      await prisma.productSubCategory.delete({ where: { id } });

      res.json({
        success: "SUCCESS",
        message: "Subcategory deleted successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting subcategory: ${error.message}`, 500));
    }
  }

  // Get Methods
  async getCategoriesByStoreId(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const { page = 1, pageSize = 10 } = req.query;

      const categories = await prisma.productCategory.findMany({
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        where: { storeId },
        include: {
          subCategories: true,
        },
      });

      res.json({
        success: "SUCCESS",
        data: { productCategory: categories },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching categories: ${error.message}`, 500));
    }
  }

  async getSubCategoriesByCategoryId(req: Request, res: Response, next: NextFunction) {
    try {
      const { categoryId } = req.params;
      const { page = 1, pageSize = 10 } = req.query;

      const subCategories = await prisma.productSubCategory.findMany({
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        where: { categoryId },
      });

      res.json({
        success: "SUCCESS",
        data: { subCategories },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching subcategories: ${error.message}`, 500));
    }
  }
}
