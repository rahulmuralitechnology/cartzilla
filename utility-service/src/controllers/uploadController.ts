import { NextFunction, Request, Response } from "express";
import { BlobServiceClient } from "@azure/storage-blob";
import CustomError from "../utils/customError";
import config from "../config";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
}).single("file");

export class UploadController {
  private blobServiceClient: BlobServiceClient;
  private containerName: string;

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(config.appConstant.azure.storageConnectionString);
    this.containerName = config.appConstant.azure.containerName;
  }

  async uploadFile(req: Request, res: Response, next: NextFunction) {
    try {
      // Handle file upload using multer
      upload(req, res, async (err) => {
        if (err) {
          return next(new CustomError(`Error uploading file: ${err.message}`, 400));
        }

        if (!req.file) {
          return next(new CustomError("No file uploaded", 400));
        }

        const file = req.file;
        const fileExtension = file.originalname.split(".").pop();
        // const fileName = `${uuidv4()}.${fileExtension}`;
        const fileType = "image/webp";
        const webpFileName = `${uuidv4()}.webp`;

        const webpBuffer = await sharp(file.buffer)
          .webp({ quality: 80 }) // Adjust quality if needed
          .toBuffer();

        try {
          const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
          const blockBlobClient = containerClient.getBlockBlobClient(webpFileName);

          await blockBlobClient.uploadData(webpBuffer, {
            blobHTTPHeaders: {
              blobContentType: fileType,
            },
          });

          res.status(200).json({
            success: "SUCCESS",
            data: {
              url: blockBlobClient.url,
              fileName: webpFileName,
              originalName: file.originalname,
              size: webpBuffer.length,
              mimeType: fileType,
            },
            message: "File uploaded successfully",
          });
        } catch (error: any) {
          return next(new CustomError(`Error uploading to Azure: ${error.message}`, 500));
        }
      });
    } catch (error: any) {
      return next(new CustomError(`Upload process error: ${error.message}`, 500));
    }
  }

  async deleteFile(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileName } = req.params;

      if (!fileName) {
        return next(new CustomError("File name is required", 400));
      }

      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      await blockBlobClient.delete();

      res.json({
        success: "SUCCESS",
        message: "File deleted successfully",
      });
    } catch (error: any) {
      return next(new CustomError(`Error deleting file: ${error.message}`, 500));
    }
  }

  async getFileUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const { fileName } = req.params;

      if (!fileName) {
        return next(new CustomError("File name is required", 400));
      }

      const containerClient = this.blobServiceClient.getContainerClient(this.containerName);
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);

      res.json({
        success: "SUCCESS",
        data: {
          url: blockBlobClient.url,
        },
      });
    } catch (error: any) {
      return next(new CustomError(`Error getting file URL: ${error.message}`, 500));
    }
  }
}
