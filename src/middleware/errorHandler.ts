import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { CustomError } from "../utils/CustomError";

const errorHandler: ErrorRequestHandler = (
  err,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", err);

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.details && { details: err.details }),
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: "Something went wrong",
  });
};

export default errorHandler;
