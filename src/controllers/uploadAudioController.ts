import { Response, NextFunction } from "express";
import { UploadAudioDto, uploadAudioSchema } from "../models/dtos/audioDtos";
import { uploadAudioService } from "../services/audioService";
import { AuthRequest } from "../middlewares/authHandler";
import fs from "fs";
import { CustomError } from "../utils/CustomError";

export const uploadAudioController = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = uploadAudioSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          throw new CustomError(
            "Error deleting file after validation error:",
            500,
            unlinkErr
          );
        }
      });
    }

    res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((detail) => detail.message),
    });
    return;
  }

  if (!req.file) {
    res.status(400).json({ success: false, message: "Audio file is required" });
    return;
  }

  try {
    const userId = req.userId;
    if (!userId) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const audioFile = await uploadAudioService(
      userId,
      req.file,
      value as UploadAudioDto
    );

    res.status(201).json({
      success: true,
      message: "Audio file uploaded successfully",
      data: audioFile,
    });
  } catch (err) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlink(req.file.path, (unlinkErr) => {
        if (unlinkErr) {
          console.error("Error deleting file after service error:", unlinkErr);
        }
      });
    }

    next(err);
  }
};
