import express from "express";
import { BlogController } from "../controllers/blogController";
import { check, param } from "express-validator";
import isAuthenticated from "../middleware/isAuthenticated";

const router = express.Router();
const blogController = new BlogController();

// Route to create a new blog
router.post(
  "/create",
  isAuthenticated,
  [
    check("title").notEmpty().withMessage("Title is required"),
    check("content").notEmpty().withMessage("Content is required"),
    check("storeId").notEmpty().isUUID().withMessage("Valid store ID is required"),
  ],
  blogController.createBlog
);

// Route to get all blogs
router.get("/list/:storeId", blogController.getBlogs);
router.get("/get/:id", blogController.getBlogById);

router.get("/get/:slug", blogController.getBlogByName);

// Route to update a blog
router.put("/update/:id", isAuthenticated, blogController.updateBlog);

// Route to delete a blog
router.delete(
  "/delete/:storeId/:blogId",
  isAuthenticated,
  [param("blogId").isUUID().withMessage("Invalid blog ID")],
  blogController.deleteBlog
);

export default router;
