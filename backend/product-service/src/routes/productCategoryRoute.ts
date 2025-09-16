import express from "express";
import { ProductCategoryController } from "../controllers/productCateogry";
import { check } from "express-validator";

const router = express.Router();
const productCategoryController = new ProductCategoryController();

// Category Routes

// Route to create a category
router.post(
  "/create",
  [check("name").notEmpty().withMessage("Category name is required"), check("storeId").notEmpty().withMessage("Store ID is required")],
  productCategoryController.createCategory
);

// Route to update a category
router.put(
  "/update/:id",
  [
    check("id").isMongoId().withMessage("Invalid category ID"),
    check("name").optional().notEmpty().withMessage("Category name cannot be empty"),
  ],
  productCategoryController.updateCategory
);

// Route to delete a category
router.delete("/delete/:id", productCategoryController.deleteCategory);

// Route to get categories by store ID
router.get("/get-all-categories/:storeId", productCategoryController.getCategoriesByStoreId);

// SubCategory Routes

// Route to create a subcategory
router.post(
  "/subcategory/create",
  [
    check("name").notEmpty().withMessage("Subcategory name is required"),
    check("categoryId").notEmpty().withMessage("Category ID is required"),
  ],
  productCategoryController.createSubCategory
);

// Route to update a subcategory
router.put(
  "/subcategory/update/:id",
  [
    check("id").isMongoId().withMessage("Invalid subcategory ID"),
    check("name").optional().notEmpty().withMessage("Subcategory name cannot be empty"),
  ],
  productCategoryController.updateSubCategory
);

// Route to delete a subcategory
router.delete(
  "/subcategory/delete/:id",
  [check("id").isMongoId().withMessage("Invalid subcategory ID")],
  productCategoryController.deleteSubCategory
);

// Route to get subcategories by category ID
router.get(
  "/subcategory/category/:categoryId",
  [check("categoryId").notEmpty().withMessage("Category ID is required")],
  productCategoryController.getSubCategoriesByCategoryId
);

export default router;
