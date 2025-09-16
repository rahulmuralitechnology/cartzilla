import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import CustomError from "../utils/customError";
import prisma from "../service/prisma";
import { slugify } from "../utils/helper";

export class BlogController {
  async createBlog(req: any, res: Response, next: NextFunction) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return next(new CustomError("Validation failed", 400));

    try {
      const { title, summary, content, category, isPublished, coverImage, storeId } = req.body;

      const titleAlredyExist = await prisma.blog.findFirst({ where: { title: title, storeId } });

      if (titleAlredyExist) {
        return next(new CustomError("Blog already exist with this title", 400));
      }

      const blog = await prisma.blog.create({
        data: {
          title,
          summary,
          content,
          category,
          isPublished,
          coverImage,
          storeId,
          userId: req.user?.id,
        },
      });

      res.status(201).json({
        success: "SUCCESS",
        data: { blog },
        message: "Blog created successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error creating blog: ${error.message}`, 500));
    }
  }

  async getBlogs(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId } = req.params;
      const blogs = await prisma.blog.findMany({ where: { storeId: storeId }, orderBy: { createdAt: "desc" } });

      res.json({
        success: "SUCCESS",
        data: { blogs },
        message: "Blogs retrieved successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving blogs: ${error.message}`, 500));
    }
  }

  async getBlogById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const blog = await prisma.blog.findUnique({
        where: { id },
      });

      if (!blog) {
        return next(new CustomError("Blog not found", 404));
      }

      res.status(200).json({
        success: "SUCCESS",
        data: { blog },
        message: "Blog retrieved successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving blog: ${error.message}`, 500));
    }
  }

  async getBlogByName(req: Request, res: Response, next: NextFunction) {
    try {
      const { slug } = req.params;

      const blog = await prisma.blog.findFirst({
        where: { title: slugify(slug) },
      });

      if (!blog) {
        return next(new CustomError("Blog not found", 404));
      }

      res.status(200).json({
        success: "SUCCESS",
        data: { blog },
        message: "Blog retrieved successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error retrieving blog: ${error.message}`, 500));
    }
  }

  async updateBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const existingBlog = await prisma.blog.findUnique({
        where: { id },
      });

      if (!existingBlog) {
        return next(new CustomError("Blog not found", 404));
      }

      const updatedBlog = await prisma.blog.update({
        where: { id },
        data: updateData,
      });

      res.json({
        success: "SUCCESS",
        data: { blog: updatedBlog },
        message: "Blog updated successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error updating blog: ${error.message}`, 500));
    }
  }

  async deleteBlog(req: Request, res: Response, next: NextFunction) {
    try {
      const { storeId, blogId } = req.params;

      const existingBlog = await prisma.blog.findUnique({
        where: { id: blogId, storeId },
      });

      if (!existingBlog) {
        return next(new CustomError("Blog not found", 404));
      }

      await prisma.blog.delete({
        where: { id: blogId, storeId },
      });

      res.json({
        success: "SUCCESS",
        message: "Blog deleted successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting blog: ${error.message}`, 500));
    }
  }
}
