import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { validationErrorHandler } from "../middleware/errorHandler";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";
import { ProductStatus } from "@prisma/client";
import { slugify } from "../utils/helper";
import { SourceKey } from "./authController";
import { ERPNextClient } from "../service/erpNextService/client";
import { ProductService } from "../service/erpNextService/productService";

export class ProductController {
  async createProduct(req: Request, res: Response, next: NextFunction) {
    const exErrors = validationResult(req);
    if (!exErrors.isEmpty()) return next(validationErrorHandler(exErrors));

    try {
      const productData = req.body;
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
      let storeId = stId || Storeid || storeid || productData.storeId;

      if (!storeId) {
        return res.status(400).json({
          success: "FAILED",
          message: "Missing store ID in request.",
        });
      }

      if (!productData.title) {
        return res.status(400).json({
          success: "FAILED",
          message: "Product title is required.",
        });
      }

      const existingProduct = await prisma.product.findFirst({
        where: {
          title: productData.title,
          storeId: productData.storeId,
        },
      });

      if (existingProduct) {
        return res.status(409).json({
          success: "FAILED",
          message: "Product with the same title already exists.",
        });
      }

      const product = await prisma.product.create({
        data: {
          ...productData,
          dimensions: productData.dimensions || {},
          meta: productData.meta || {},
          reviews: productData.reviews || [],
        },
      });

      try {
        const store = await prisma.store.findUnique({ where: { id: storeId }, include: { StoreErpNext: true } });
        const erpConfig: any = store?.StoreErpNext?.[0];
        if (erpConfig.apiKey) {
        // if (erpConfig.apiKey && source === SourceKey.Portal) {
          const erpClient = new ERPNextClient({
            apiKey: erpConfig.apiKey,
            baseUrl: erpConfig.baseUrl,
            apiSecret: erpConfig.apiSecret,
            defaultCustomerGroup: store?.name!,
            defaultTerritory: store?.name!,
          });
          
          // First ensure HSN code exists
          if (productData.hsnCode) {
            await new ProductService(erpClient).createHSNCodeIfNotExists({
              hsn_code: productData.hsnCode,
              description: `HSN Code ${productData.hsnCode}`,
              tax_rate: 0 // Set default tax rate, can be updated later
            });
          }
          
          // Then ensure item group exists
          if (productData.category) {
            await new ProductService(erpClient).createItemGroupIfNotExists({
              name: productData.category,
              parent_item_group: "All Item Groups"
            });
          }
          
          // Now create the product
          const erpResult = await new ProductService(erpClient).createProduct({
            item_code: product.title,
            name: product.title!,
            description: product.description || "",
            item_group: product.category || "All Item Groups",
            stock_uom: product.umo || "Nos",
            standard_rate: product.price || 0,
            image: product?.images?.[0],
            brand: product.brand || "",
            id: product.id,
            is_sales_item: true,
            is_purchase_item: true,
            hsnCode: product.hsnCode || "",
          });
          
          console.log("ERPNext product created:", erpResult);
        }
      } catch (error) {
        console.log("Error while creating product in ERPNext", error);
      }

      res.status(201).json({
        success: "SUCCESS",
        message: "Product created successfully.",
        data: { product },
      });
    } catch (error: any) {
      return next(new CustomError(`Error creating product: ${error.message}`, 500));
    }
  }

  async updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });
      if (!existingProduct) {
        return next(new CustomError("Product not found", 404));
      }

      const updatedProduct = await prisma.product.update({
        where: { id },
        data: updateData,
      });

      // Sync with ERP
      try {
        const store = await prisma.store.findUnique({
          where: { id: updatedProduct.storeId },
          include: { StoreErpNext: true },
        });

        const erpConfig: any = store?.StoreErpNext?.[0];

        if (erpConfig?.apiKey) {
          const erpClient = new ERPNextClient({
            apiKey: erpConfig.apiKey,
            baseUrl: erpConfig.baseUrl,
            apiSecret: erpConfig.apiSecret,
            defaultCustomerGroup: store?.name!,
            defaultTerritory: store?.name!,
          });

          const productService = new ProductService(erpClient);

          // Ensure HSN and Item Group exist
          if (updatedProduct.hsnCode) {
            await productService.createHSNCodeIfNotExists({
              hsn_code: updatedProduct.hsnCode,
              description: `HSN Code ${updatedProduct.hsnCode}`,
              tax_rate: 0,
            });
          }

          if (updatedProduct.category) {
            await productService.createItemGroupIfNotExists({
              name: updatedProduct.category,
              parent_item_group: "All Item Groups",
            });
          }

          // Check if product exists in ERP
          try {
            await erpClient.get("Item", updatedProduct.title);

              await new ProductService(erpClient).updateProduct(updatedProduct.title, {
                item_code: updatedProduct.title,
                name: updatedProduct.title!,
                description: updatedProduct.description || "",
                item_group: updatedProduct.category || "All Item Groups",
                stock_uom: updatedProduct.umo || "Nos",
                standard_rate: updatedProduct.price || 0,
                image: updatedProduct?.images?.[0],
                // brand: updatedProduct.brand || "",
                id: updatedProduct.id,
                is_sales_item: true,
                is_purchase_item: true,
                hsnCode: updatedProduct.hsnCode || "",
              });
          } catch (erpError) {
            await new ProductService(erpClient).createProduct({
                item_code: updatedProduct.title,
                name: updatedProduct.title!,
                description: updatedProduct.description || "",
                item_group: updatedProduct.category || "All Item Groups",
                stock_uom: updatedProduct.umo || "Nos",
                standard_rate: updatedProduct.price || 0,
                image: updatedProduct?.images?.[0],
                // brand: updatedProduct.brand || "",
                id: updatedProduct.id,
                is_sales_item: true,
                is_purchase_item: true,
                hsnCode: updatedProduct.hsnCode || "",
              });
          }
        }
      } catch (configError) {
        console.error("ERP config fetch error:", configError);
      }

      res.json({
        success: "SUCCESS",
        data: { product: updatedProduct },
        message: "Product updated successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating product: ${error.message}`, 500));
    }
  }

  async deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const existingProduct = await prisma.product.findUnique({
        where: { id },
      });
      if (!existingProduct) {
        return next(new CustomError("Product not found", 404));
      }

      await prisma.product.delete({ where: { id } });

      res.json({
        success: "SUCCESS",
        message: "Product deleted successfully.",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting product: ${error.message}`, 500));
    }
  }

  async bulkUploadProducts(req: Request, res: Response, next: NextFunction) {
    try {
      const { products, storeId } = req.body;

      if (!Array.isArray(products) || products.length === 0) {
        return res.status(400).json({
          success: "FAILED",
          message: "Products array is required and must not be empty.",
        });
      }

      // Validate that each product has 'umo' and 'hsnCode'
      const invalidProducts = products.filter((product) => {
        const isValidHsn = /^[A-Za-z0-9]{6,8}$/.test(product.hsnCode);
        return !product.umo || !product.hsnCode || !isValidHsn || !product.thumbnail;
      });

      if (invalidProducts.length > 0) {
        return res.status(400).json({
          success: "FAILED",
          message: "Each product must have both 'umo' and a valid 'hsnCode' (6–8 alphanumeric characters).",
          invalidProducts,
        });
      }


      // First check for existing products with same titles
      const existingProductTitles = await prisma.product.findMany({
        where: {
          storeId,
          title: {
            in: products.map((p) => p.title),
          },
        },
        select: {
          title: true,
        },
      });

      const existingTitles = new Set(existingProductTitles.map((p) => p.title));

      // Filter out products with existing titles
      const uniqueProducts = products.filter((product) => !existingTitles.has(product.title));

      const createdProducts = await prisma.$transaction(
        uniqueProducts.map((product) =>
          prisma.product.create({
            data: {
              ...product,
              storeId,
              dimensions: product.dimensions || {},
              meta: product.meta || {},
              reviews: product.reviews || [],
            },
          })
        )
      );

      // ERP Sync
      try {
        const store = await prisma.store.findUnique({
          where: { id: storeId },
          include: { StoreErpNext: true },
        });

        const erpConfig: any = store?.StoreErpNext?.[0];
        console.log("ERP Config:", erpConfig);

        if (erpConfig?.apiKey) {
          const erpClient = new ERPNextClient({
            apiKey: erpConfig.apiKey,
            baseUrl: erpConfig.baseUrl,
            apiSecret: erpConfig.apiSecret,
            defaultCustomerGroup: store?.name!,
            defaultTerritory: store?.name!,
          });
          console.log(uniqueProducts, "uniqueProducts");
          for (const product of uniqueProducts) {
            try {
              await new ProductService(erpClient).createProduct({
                item_code: product.title,
                name: product.title!,
                description: product.description || "",
                item_group: product.category || "All Item Groups",
                stock_uom: product.umo,
                standard_rate: product.price || 0,
                image: product?.images?.[0],
                brand: product.brand || "",
                id: product.id,
                is_sales_item: true,
                is_purchase_item: true,
                hsnCode: product.hsnCode,
              });
              console.log(`ERPNext product created: ${product.title}`);
            } catch (erpError) {
              console.error(`ERP creation failed for ${product.title}:`, erpError);
            }
          }
        }
      } catch (error) {
        console.error("ERP config or sync failed:", error);
      }

      res.status(200).json({
        success: "SUCCESS",
        message: "Products uploaded successfully.",
        data: { products: createdProducts },
      });
    } catch (error: any) {
      return next(new CustomError(`Error bulk uploading products: ${error.message}`, 500));
    }
  }

  async getProductsByStoreId(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.query;
      const { status, page = 1, pageSize = 100 } = req.query;

      if (!storeId || typeof storeId !== "string") {
        return next(new CustomError("Invalid storeId", 400));
      }

      const whereClause: any = { storeId: storeId.trim() };
      if (status) {
        whereClause.status = status as ProductStatus;
      }

      const products = await prisma.product.findMany({
        skip: (Number(page) - 1) * Number(pageSize),
        take: Number(pageSize),
        where: whereClause,
        orderBy: { createdAt: "asc" },
      });

      res.status(200).json({
        success: "SUCCESS",
        data: { products },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching store products: ${error.message}`, 500));
    }
  }

  async getProductById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { page = 1, pageSize = 10 } = req.query;

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          store: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!product) {
        return next(new CustomError("Product not found", 404));
      }

      // Generate JSON-LD data
      const jsonLdData = {
        "@context": "https://schema.org/",
        "@type": "Product",
        name: product.title,
        // Assuming the first image is the main image
        description: product.description,
        brand: {
          "@type": "Brand",
          name: product?.store?.name,
        },
        image: product?.images || [],
        offers: {
          "@type": "Offer",
          url: `${(req.headers["client-url"] as string) || req.headers.origin}/product/${slugify(product?.category as string)}/${slugify(
            product.title
          )}`,
          priceCurrency: "INR", // Replace with actual currency
          price: product.price,
          itemCondition: "https://schema.org/NewCondition",
          availability: "https://schema.org/InStock",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: product?.rating || 4,
          reviewCount: 20,
        },
      };

      res.json({
        success: "SUCCESS",
        data: { product, jsonLdData },
      });
    } catch (error: any) {
      return next(new CustomError(`Error fetching product: ${error.message}`, 500));
    }
  }
}
