import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { CustomError } from "../utils/CustomError";

const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error(err);

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details || null,
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Something went wrong on the server.",
      details: err.message || null,
    });
  }
};

export default errorHandler;
