import express from "express";
import { ProductController } from "../controllers/productController";
import { check } from "express-validator";

const router = express.Router();
const productController = new ProductController();

// Route to create a product
router.post(
  "/create",
  [check("title").notEmpty().withMessage("Product title is required"), check("storeId").notEmpty().withMessage("Store ID is required")],
  productController.createProduct
);

// Route to update a product
router.put(
  "/update/:id",
  [
    check("id").isMongoId().withMessage("Invalid product ID"),
    check("title").optional().notEmpty().withMessage("Product title cannot be empty"),
  ],
  productController.updateProduct
);

// Route to delete a product
router.delete("/delete/:id", productController.deleteProduct);

// Route to bulk upload products
router.post(
  "/bulk-upload-products",
  [
    check("products").isArray({ min: 1 }).withMessage("Products array must not be empty"),
    check("storeId").notEmpty().withMessage("Store ID is required"),
  ],
  productController.bulkUploadProducts
);

// Route to get products by store ID
router.get("/get-product-list", productController.getProductsByStoreId);

// Route to get a product by ID
router.get("/:id", productController.getProductById);

export default router;
