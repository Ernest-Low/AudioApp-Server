import { Request, Response, NextFunction } from "express";
import fs from "fs";
import audioUpload from "./audioUpload";
import { CustomError } from "../utils/CustomError";

const handleFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  audioUpload(req, res, (err: any) => {
    if (err) {
      if (req.file) {
        fs.unlink(req.file.path, (unlinkErr) => {
          if (unlinkErr) {
            throw new CustomError(
              "Error deleting file after upload error:",
              500,
              unlinkErr
            );
          }
          next(err);
        });
      } else {
        next(err);
      }
    } else {
      next();
    }
  });
};

export default handleFileUpload;
