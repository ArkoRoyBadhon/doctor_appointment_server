import cloudinary from "cloudinary";
import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import fs from "fs";
import ErrorHandler from "../utils/errorhandler";

cloudinary.v2.config({
  cloud_name: process.env.CN_Cloud_name,
  api_key: process.env.CN_Api_key,
  api_secret: process.env.CN_Api_secret,
  folder: process.env.CN_Folder,
});

export const uploadFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler("Validation Error", 400);
    }

    // Check if file exists in request
    if (!req.file) {
      throw new ErrorHandler("No file uploaded", 400);
    }

    // Upload file to Cloudinary
    const result = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: process.env.CN_Folder,
    });
    // Remove file from server after uploading to Cloudinary
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    next(error);
  }
};

export const replaceFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ErrorHandler("Validation Error", 400);
    }
    if (!req.file) {
      throw new ErrorHandler("No file uploaded", 400);
    }

    const publicId = req.params.publicId;

    const folder = process.env.CN_Folder;
    // Perform deletion
    const result1 = await cloudinary.v2.uploader.destroy(
      `${folder}/${publicId}`
    );
    // Upload file to Cloudinary
    const result2 = await cloudinary.v2.uploader.upload(req.file.path, {
      folder: process.env.CN_Folder,
    });
    // Remove file from server after uploading to Cloudinary
    fs.unlink(req.file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      }
    });
    res.status(200).json({ url: result2.secure_url });
  } catch (error) {
    next(error);
  }
};
