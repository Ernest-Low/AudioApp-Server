import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId?: string;
}

// Use this if the jwt isn't required, but checks anyway
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.AUTH_KEY) as {
      userId: string;
    };
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    return next();
  }
};

// Use this if the jwt is definitely required
export const requiredAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required, token not provided",
    });
  }

  try {
    // If token exists, verify it
    const decoded = jwt.verify(token, config.AUTH_KEY) as {
      userId: string;
    };
    req.userId = decoded.userId;
    return next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};
