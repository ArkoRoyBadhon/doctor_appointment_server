import express from "express";
import multer from "multer";
import { replaceFile, uploadFile } from "../../controllers/file.controller";

const router = express.Router();

// Multer configuration for handling file uploads
const upload = multer({ dest: "uploads/" });

// POST route for uploading files
router.post("/upload", upload.single("file"), uploadFile);
router.post("/replace/:publicId", upload.single("file"), replaceFile);

export default router;
