import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";

export interface AuthRequest extends Request {
  userId?: string;
}

const verifyToken = (token: string): { userId: string } | null => {
  try {
    return jwt.verify(token, config.AUTH_KEY) as { userId: string };
  } catch (err) {
    return null;
  }
};

// Use this if the jwt isn't required, but checks anyway
export const optionalAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return next();
  }

  const decoded = verifyToken(token);
  if (decoded) {
    req.userId = decoded.userId;
  }
  return next();
};

// Use this if the jwt is definitely required
export const requiredAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    void res.status(401).json({
      success: false,
      message: "Authorization token required",
    });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    void res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
    return;
  }

  req.userId = decoded.userId;
  next();
};
