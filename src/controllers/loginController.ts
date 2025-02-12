import { Request, Response, NextFunction } from "express";
import { loginUserSchema } from "../models/dtos/loginDtos";
import loginUserService from "../services/loginUserService";

const loginController = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { error, value } = loginUserSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    res.status(400).json({
      message: "Validation failed",
      errors: error.details.map((err) => err.message),
    });
    return;
  }

  try {
    const response = await loginUserService(value);
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

export default loginController;
