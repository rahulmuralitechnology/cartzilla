import express from "express";
import { UploadController } from "../controllers/uploadController";

const router = express.Router();
const uploadController = new UploadController();

router.post("/upload-file", uploadController.uploadFile.bind(uploadController));
router.delete("/file/:fileName", uploadController.deleteFile.bind(uploadController));
router.get("/file/:fileName", uploadController.getFileUrl.bind(uploadController));

export default router;
